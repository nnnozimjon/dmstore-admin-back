const jwt = require("jsonwebtoken");

const token = jwt.sign("key", "secre_key", { expiresIn: "3d" });

console.log(token);
