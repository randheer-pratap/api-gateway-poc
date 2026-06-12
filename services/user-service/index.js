const express = require("express");

const app = express();

const PORT = process.env.PORT || 3001;

app.get("/users", (req, res) => {
  res.json({
    service: "User Service",
    runningOn: PORT,
    headers: req.headers,
  });
});

app.listen(PORT, () => {
  console.log(`User Service running on ${PORT}`);
});
