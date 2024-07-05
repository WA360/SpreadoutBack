require("dotenv").config();
var mysql = require("mysql2");

var connection = mysql.createConnection({
  // host: "localhost",
  // host: "host.docker.internal",
  host: process.env.MYSQL_HOST,
  port: 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "jungle",
  // dateStrings: "date",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database as id " + connection.threadId);
});

// connection.end();

module.exports = {
  connection,
};
