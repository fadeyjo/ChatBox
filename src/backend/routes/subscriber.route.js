const Router = require("express");
const router = new Router();
const subscriberController = require("../controllers/subscriber.controller");

router.post("/subscriber", subscriberController.subscribeOn);
router.get("/subscriber/:customerId/:secondId", subscriberController.isFriendsOrCustomerSubscribe)
router.delete("/subscriber", subscriberController.deleteFromFriends)

module.exports = router;
