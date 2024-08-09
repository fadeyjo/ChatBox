const db = require("../db");

class SubscriberController {
  async subscribeOn(req, res) {
    const { subscriberId, onWhoSubscribeId } = req.body;
    const maybeSubscribeId = (
      await db.query(
        `SELECT id FROM subscriber WHERE subscriber_customer_id = $1 AND subscribe_on_customer_id = $2`,
        [subscriberId, onWhoSubscribeId]
      )
    ).rows;

    const maybeFriendshipId = (
      await db.query(
        `SELECT id FROM friendship WHERE (first_customer_id = $1 AND second_customer_id = $2) OR (first_customer_id = $2 AND second_customer_id = $1)`,
        [subscriberId, onWhoSubscribeId]
      )
    ).rows;

    if (maybeSubscribeId.length !== 0 || maybeFriendshipId.length !== 0) {
      res.json({
        error: "Subscribe or friendship already exists",
      });
    } else {
      const id = (
        await db.query(
          `SELECT id FROM subscriber WHERE subscriber_customer_id = $1 AND subscribe_on_customer_id = $2`,
          [onWhoSubscribeId, subscriberId]
        )
      ).rows;
      if (id.length !== 0) {
        const friendship = (
          await db.query(
            `INSERT INTO friendship (first_customer_id, second_customer_id) VALUES ($1, $2) RETURNING *`,
            [onWhoSubscribeId, subscriberId]
          )
        ).rows[0];
        await db.query(
          `DELETE FROM subscriber WHERE subscriber_customer_id = $1 AND subscribe_on_customer_id = $2`,
          [onWhoSubscribeId, subscriberId]
        );
        res.json(friendship);
      } else {
        res.json(
          (
            await db.query(
              `INSERT INTO subscriber (subscriber_customer_id, subscribe_on_customer_id) VALUES ($1, $2) RETURNING *`,
              [subscriberId, onWhoSubscribeId]
            )
          ).rows[0]
        );
      }
    }
  }

  async isFriendsOrCustomerSubscribe(req, res) {
    const { customerId, secondId } = req.params;
    const friendShipId = (
      await db.query(
        `SELECT id FROM friendship WHERE (first_customer_id = $1 AND second_customer_id = $2) OR (first_customer_id = $2 AND second_customer_id = $1)`,
        [customerId, secondId]
      )
    ).rows;
    if (friendShipId.length !== 0) {
      res.json({
        friendsOrCustomerSubscribe: true,
      });
    } else {
      const subscribeId = (
        await db.query(
          `SELECT id FROM subscriber WHERE subscriber_customer_id = $1 AND subscribe_on_customer_id = $2`,
          [customerId, secondId]
        )
      ).rows;
      if (subscribeId.length !== 0) {
        res.json({
          friendsOrCustomerSubscribe: true,
        });
      } else {
        res.json({
          friendsOrCustomerSubscribe: false,
        });
      }
    }
  }

  async deleteFromFriends(req, res) {
    const { customerId, deletableFriendId } = req.body;
    const friendshipId = (
      await db.query(
        `SELECT id FROM friendship WHERE (first_customer_id = $1 AND second_customer_id = $2) OR (first_customer_id = $2 AND second_customer_id = $1)`,
        [customerId, deletableFriendId]
      )
    ).rows;
    if (friendshipId.length !== 0) {
      await db.query(
        `DELETE FROM friendship WHERE (first_customer_id = $1 AND second_customer_id = $2) OR (first_customer_id = $2 AND second_customer_id = $1)`,
        [customerId, deletableFriendId]
      );
      await db.query(
        `INSERT INTO subscriber (subscriber_customer_id, subscribe_on_customer_id) VALUES ($1, $2)`,
        [deletableFriendId, customerId]
      );
    } else {
      await db.query(
        `DELETE FROM subscriber WHERE subscriber_customer_id = $1 AND subscribe_on_customer_id = $2`,
        [customerId, deletableFriendId]
      );
    }
    res.json({
        customerId,
        deletableFriendId
    })
  }
}

module.exports = new SubscriberController();
