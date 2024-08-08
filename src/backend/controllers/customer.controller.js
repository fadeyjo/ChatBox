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

    async authCustomer(req, res) {
        const [email, password] = req.headers.authorization.split(" ").slice(1, 3);
        const passwordCandidateCustomer = (await db.query(
            `SELECT password FROM customer WHERE email = $1`,
            [email]
        )).rows;
        if (passwordCandidateCustomer.length === 0) {
            res.json({
                error: "There is no user with this email address"
            })
        }
        else if (await bcryptjs.compare(password, passwordCandidateCustomer[0].password)) {
            const {id, surname, name, patronymic, birthday} = (await db.query(
                `SELECT * FROM customer WHERE email = $1`,
                [email]
            )).rows[0];
            res.json({
                id,
                surname,
                name,
                patronymic,
                birthday,
                email
            });
        }
        else {
            res.json({
                error: "Invalid password"
            });
        }
    }

    async getUserById(req, res) {
        const id = req.params.id;
        const {surname, name, patronymic, birthday, email} = (await db.query(
            `SELECT surname, name, patronymic, birthday, email FROM customer WHERE id = $1`,
            [id]
        )).rows[0];
        res.json({
            id,
            surname,
            name,
            patronymic,
            birthday,
            email
        })
    }
}

module.exports = new CustomerController();