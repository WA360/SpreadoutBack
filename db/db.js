require("dotenv").config();
var mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "jungle",
  port: 3306,
  connectionLimit: 3,
  waitForConnections: true,
  queueLimit: 0,
  keepAliveInitialDelay: 10000, // 0 by default.
  enableKeepAlive: true, // false by default.
});

function getConnection(callback) {
  pool.getConnection(function (err, conn) {
    if (!err) {
      callback(conn);
    }
  });
}
// var connection = pool.getConnection((err, conn) => {
//   if (err) {
//     console.error("Error connecting to the database:", err.stack);
//     return;
//   }
//   console.log("Connected to the database as id");
//   return conn;
// });

// console.log(connection);
// var connection = mysql.createConnection({
//   // host: "localhost",
//   // host: "host.docker.internal",
//   host: process.env.MYSQL_HOST,
//   port: 3306,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: "jungle",
//   // dateStrings: "date",
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err.stack);
//     return;
//   }
//   console.log("Connected to the database as id " + connection.threadId);
// });

// connection.end();

module.exports = getConnection;
