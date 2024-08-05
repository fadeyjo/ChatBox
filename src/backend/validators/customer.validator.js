const db = require("../db");

class CustomerValidator {
    async validateCustomer(customer) {
        return [
            this.#validateSurname(customer.surname),
            this.#validateName(customer.name),
            this.#validatePatronymic(customer.patronymic),
            await this.#validateEmail(customer.email),
            this.#equalPasswords(customer.password, customer.repeatPassword)].filter((error) => error !== null);
    }

    #validateSurname(surname) {
        const match = surname.match(/[A-Z]{1}[a-z]{1,19}/g);
        if (match && match[0] === surname) {
            return null;
        }
        return "Surname not validate";
    }

    #validateName(name) {
        const match = name.match(/[A-Z]{1}[a-z]{1,19}/g);
        if (match && match[0] === name) {
            return null;
        }
        return "Name not validate";
    }

    #validatePatronymic(patronymic) {
        const match = patronymic.match(/[A-Z]{1}[a-z]{1,19}/g);
        if (match && match[0] === patronymic) {
            return null;
        }
        return "Patronymic not validate";
    }

    async #validateEmail(email) {
        const match = email.match(/[A-Za-z.0-9]{1,64}@[A-Za-z.]{1,255}/g);
        if (match && match[0] === email) {
            const emails = (await db.query(
                `SELECT email FROM customer`
            )).rows.map(obj => obj.email)
            if (emails.includes(email)) {
                return "This user already exists";
            }
            return null;
        }
        return "Email not validate";
    }

    #equalPasswords(password, repeatPassword) {
        return password === repeatPassword ? null : "Passwords not equal";
    }
}

module.exports = new CustomerValidator();