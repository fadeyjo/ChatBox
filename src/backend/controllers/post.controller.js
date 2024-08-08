const db = require("../db");
const postValidator = require("../validators/post.validator");

class PostController {
  async createPost(req, res) {
    const { content, publication_time, publication_date, customer_id } =
      req.body;
    const errors = await postValidator.validatePost(content, customer_id);
    if (errors.length === 0) {
      const post = await db.query(
        `INSERT INTO post (content, publication_time, publication_date, customer_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [content, publication_time, publication_date, customer_id]
      );
      res.json(post.rows[0]);
    } else {
      res.json({
        error: errors[0],
      });
    }
  }

  async getPostsByCustomerId(req, res) {
    const { customer_id } = req.params;
    res.json(
      (
        await db.query(`SELECT * FROM post WHERE customer_id = $1`, [
          customer_id,
        ])
      ).rows
    );
  }
}

module.exports = new PostController();
