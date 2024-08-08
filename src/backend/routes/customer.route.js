const Router = require("express");
const router = new Router();
const customerController = require("../controllers/customer.controller");

router.post("/customer", customerController.createCustomer);
router.get("/customer",  customerController.authCustomer);
router.get("/customer/:id", customerController.getUserById)

module.exports = router;