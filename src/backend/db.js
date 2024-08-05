const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    port: 5432,
    password: "123",
    database: "chat_box"
});

module.exports = pool;