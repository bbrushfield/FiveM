const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  token: process.env.TOKEN,
  port: process.env.PORT,
  MONGOURI: process.env.MONGOIDENT
};