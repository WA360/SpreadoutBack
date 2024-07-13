var express = require("express");
var router = express.Router();
let botDTO = require("../dto/botDTO");
const uath = require("../auth");

router.post("/session", async (req, res, next) => {
  let params = [req.body.chapterId, req.body.userId];
  try {
    let result = await botDTO.createNewSession(params);
    res.status(200).send({ message: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.get("/session", uath.checkAuth, async (req, res, next) => {
  let params = [req.user.uuid];
  try {
    let result = await botDTO.selectSession(params);
    res.status(200).send({ message: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.post("/message", async (req, res, next) => {
  let params = [req.body.sender, req.body.content, req.body.sessionId];
  try {
    let result = await botDTO.createNewMessage(params);
    res.status(200).send({ message: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.get("/message", async (req, res, next) => {
  let params = [req.query.sessionId];
  try {
    let result = await botDTO.selectMessage(params);
    res.status(200).send({ message: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.get("/chat", (req, res) => {
  res.status(200).send({ message: "Cookie values logged on server" });
});

module.exports = router;
