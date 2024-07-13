var express = require("express");
var router = express.Router();
let botDTO = require("../dto/botDTO");

router.post("/session", async (req, res, next) => {
  let params = [req.body.chapterId, req.body.userId];
  try {
    let result = await botDTO.createNewSession(params);
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

router.get("/chat", (req, res) => {
  res.status(200).send({ message: "Cookie values logged on server" });
});

module.exports = router;
