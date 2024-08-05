const express = require("express");

const customerRouter = require("./routes/customer.route");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use("/api", customerRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));