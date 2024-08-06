const db = require("../db");
const bcryptjs = require("bcryptjs");
const customerValidator = require("../validators/customer.validator");

const saltPassword = 10;

class CustomerController {
    async createCustomer(req, res) {
        const customer = req.body;
        const errors = await customerValidator.validateCustomer(customer);
        if (errors.length === 0) {
            const {surname, name, patronymic, email, birthday, password} = customer;
            await db.query(
                `INSERT INTO customer (surname, name, patronymic, email, birthday, password) VALUES ($1, $2, $3, $4, $5, $6)`,
                [surname, name, patronymic, email, birthday, await bcryptjs.hash(password, saltPassword)]
            );
            const id = (await db.query(`SELECT id FROM customer WHERE email = $1`, [email])).rows[0].id;
            res.json({
                id,
                surname,
                name,
                patronymic,
                email,
                birthday
            });
        }
        else {
            res.json({
                "error": errors[0]
            });
        }
    }
}

module.exports = new CustomerController();