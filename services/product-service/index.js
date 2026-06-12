const express = require("express");

const app = express();

app.get("/products", (req, res) => {
  res.json({
    service: "Product Service",
    products: ["Laptop", "Phone"],
    headers: req.headers,
  });
});

app.listen(3002, () => {
  console.log("Product Service running on 3002");
});
