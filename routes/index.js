var express = require("express");
var router = express.Router();
var db = require("../db/db");
var elastic = require("../db/elastic");
let llm = require("../ai/llm");

/* GET home page. */
router.get("/", async function (req, res, next) {
  db.connection;
  // elastic.bootstrap();
  // let result = await elastic.find("brave");
  // console.log(result);
  // res.json({ result: result });
  res.render("index", { title: "Express" });
});
// router.get("/", llm);

router.get("/test-cookie", (req, res) => {
  const cookies = req.cookies;
  console.log("Cookies: ", cookies);
  const token = req.cookies.token;
  console.log("Token: ", token);

  res.status(200).send({ message: "Cookie values logged on server" });
});

module.exports = router;
