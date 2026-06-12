const express = require("express");

const app = express();

app.get("/validate", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  if (authHeader === "Bearer valid-token") {
    return res.sendStatus(200);
  }

  return res.sendStatus(401);
});

app.listen(3006, () => {
  console.log("Auth Service running on 3006");
});
