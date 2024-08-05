const Router = require("express");
const router = new Router();
const customerController = require("../controllers/customer.controller");

router.post("/customer", customerController.createCustomer);

module.exports = router;