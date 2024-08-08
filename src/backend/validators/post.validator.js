const db = require("../db");

class PostValidator {
    async validatePost(content, customer_id) {
        return [
            this.#validateContent(content),
            await this.#validateCustomerId(customer_id)
        ].filter((error) => error !== null);
    }

    #validateContent(content) {
        if (content.length !== 0) {
            return null;
        }
        return "Content is empty";
    }

    async #validateCustomerId(customer_id) {
        const customer = (await db.query(
            `SELECT * FROM customer WHERE id = $1`,
            [customer_id]
        )).rows
        console.log(customer)
        if (customer.length === 0) {
            return "System error. Not found customer ID"
        }
        return null;
    }
}

module.exports = new PostValidator();