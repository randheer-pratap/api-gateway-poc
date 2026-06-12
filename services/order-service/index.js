const express = require("express");

const app = express();

app.get("/orders", (req, res) => {
  res.json({
    service: "Order Service",
    orders: ["ORD-101", "ORD-102"],
    headers: req.headers,
  });
});
app.listen(3003, () => {
  console.log("Order Service running on 3003");
});
