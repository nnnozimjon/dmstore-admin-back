const jwt = require("jsonwebtoken");

const expiresIn = 3 * 24 * 60 * 60;

const token = jwt.sign("DushanbeMarket", "S#$CR#%KEY718");

console.log(token);
