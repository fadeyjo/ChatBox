const express = require("express");

const customerRouter = require("./routes/customer.route");

const PORT = process.env.PORT || 8080;

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
app.use(express.json());
app.use("/api", customerRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));