var express = require("express");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
var router = express.Router();
const userDTO = require("../dto/userDTO");
const fileDTO = require("../dto/fileDTO");
// import imageUploader from "../aws";
const imageUploader = require("../aws");
const uath = require("../auth");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

// AWS.config.update({
//   region: process.env.AWS_REGION,
//   accessKeyId: process.env.S3_ACCESS_KEY,
//   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
// });

const downloadFile = (bucketName, key, res) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  s3.getObject(params).createReadStream().pipe(res);
};

// 데이터 조회
// router.post("/", uath.checkAuth, async (req, res, next) => {
router.get("/", async (req, res, next) => {
  if (req.query == undefined) {
    res.status(500).send({ error: "not found req.body" });
  } else {
    const params = [req.query.pdfId];
    let node = await fileDTO.readPdfNode(params);
    let connection = await fileDTO.readPdfInfo(params);
    let url = await fileDTO.readPdfUrl(params);
    // console.log("connection: ", connection);
    // console.log("url: ", url);
    if (!url.length > 0) {
      res.status(400).send({ result: "해당 번호 결과 없음" });
      return;
    }
    let result = {
      url: url[0].url,
      node: node,
      connection: connection,
    };
    res.status(200).send(result);
  }
});

// pdf 목록 조회
router.get("/list", uath.checkAuth, async (req, res, next) => {
  if (req.query == undefined) {
    res.status(500).send({ error: "not found req.body" });
  } else {
    console.log(req.user);
    const params = [req.user.uuid];
    let node = await fileDTO.readPdfListFromUser(params);

    let result = {
      user: node,
    };
    res.status(200).send(result);
  }
});

// pdf 업로드 완료 체크(파이썬 서버에서 요청 받으)
router.post("/download", uath.checkAuth, async (req, res, next) => {
  const bucketName = process.env.AWS_BUCKET;
  const key = req.body.file;

  res.attachment(key); // 파일을 다운로드하도록 브라우저에 지시합니다.
  downloadFile(bucketName, key, res);
});

module.exports = router;
