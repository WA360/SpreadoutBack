var express = require("express");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
var router = express.Router();
const userDTO = require("../dto/userDTO");
const fileDTO = require("../dto/fileDTO");
const botDTO = require("../dto/botDTO");
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
    let nodes = await fileDTO.readPdfNode(params);
    let links = await fileDTO.readPdfInfo(params);
    let url = await fileDTO.readPdfUrl(params);
    let lastnum = nodes[nodes.length - 1].id;
    let nodelen = nodes.length;
    for (let i = 0; i < nodelen; i++) {
      let arr = JSON.parse(nodes[i].keywords);
      // console.log("nodes" + i + ": ", nodes[i]);
      // console.log("arr: ", arr);
      lastnum++;
      if (arr != null) {
        for (let j = 0; j < arr.length; j++) {
          nodes.push({
            id: lastnum,
            name: arr[j],
            start_page: 0,
            end_page: 0,
            level: 10,
            bookmarked: 0,
            group: nodes[i].group,
            pdf_file_id: nodes[i].pdf_file_id,
            summary: null,
            keywords: null,
          });
          links.push({
            id: 0,
            similarity: 1,
            source: lastnum,
            target: nodes[i].id,
            pdf_file_id: nodes[i].pdf_file_id,
            bookmarked: 0,
          });
        }
      }
    }

    if (!url.length > 0) {
      res.status(400).send({ result: "해당 번호 결과 없음" });
      return;
    }
    let result = {
      url: url[0].url,
      nodes: nodes,
      links: links,
      session_nodes: [],
      session_links: [],
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

router.get("/bookmark", uath.checkAuth, async (req, res, next) => {
  if (req.query == undefined) {
    res.status(500).send({ error: "not found req.body" });
  } else {
    const params = [req.query.pdfId];
    let url = await fileDTO.readPdfUrl(params);
    let nodes = await fileDTO.getBookmark(params);
    let links = await fileDTO.getBookmarkConnect(params);
    let result = {
      url: url[0].url,
      nodes: nodes,
      links: links,
    };
    res.status(200).send(result);
  }
});

router.put("/bookmark", uath.checkAuth, async (req, res, next) => {
  if (req.body == undefined) {
    res.status(500).send({ error: "not found req.body" });
  } else {
    const params = [req.body.bookmarked, req.body.chapterId];
    let node = await fileDTO.updateBookmark(params);

    let result = {
      user: node,
    };
    res.status(200).send(result);
  }
});

router.post("/bookmark/connection", uath.checkAuth, async (req, res) => {
  if (
    req.body.source == undefined ||
    req.body.source == undefined ||
    req.body.pdfId == undefined
  ) {
    console.log(req.body);
    res.status(500).send({ error: " not found req.query" });
  } else {
    const params = [req.body.source, req.body.target, req.body.pdfId];
    let result = await fileDTO.createConnection(params);
    res.status(200).send(result);
  }
});

router.get("/custom", uath.checkAuth, async (req, res, next) => {
  if (req.query == undefined) {
    res.status(500).send({ error: "not found req.body" });
  } else {
    const params = [req.query.pdfId, req.user.uuid];
    let result = await fileDTO.readCustomConnection(params);
    console.log(result);
    res.status(200).send(result);
  }
});

router.get("/custom/detail", uath.checkAuth, async (req, res, next) => {
  if (req.query == undefined) {
    res.status(500).send({ error: "not found req.body" });
  } else {
    const params = [req.query.pdfId];
    const customparams = [req.query.pdfId, req.user.uuid, req.query.connName];
    let nodes = await fileDTO.readPdfNode(params);
    let links = await fileDTO.readCustomConnectionDetail(customparams);
    let url = await fileDTO.readPdfUrl(params);
    let sessions = await botDTO.selectSession(params);
    let session_nodes = [];
    for (let i = 0; i < sessions.length; i++) {
      let session = {
        id: sessions[i].id,
        chapter_id: sessions[i].chapter_id,
        name: "chat_" + sessions[i].id,
        level: 10,
        user_id: sessions[i].user_id,
      };
      session_nodes.push(session);
    }

    let session_links = await botDTO.selectSessionLinks(params);
    // console.log("connection: ", connection);
    // console.log("url: ", url);
    if (!url.length > 0) {
      res.status(400).send({ result: "해당 번호 결과 없음" });
      return;
    }
    let result = {
      url: url[0].url,
      nodes: nodes,
      links: links,
      session_nodes: session_nodes,
      session_links: session_links,
    };
    res.status(200).send(result);
  }
});

router.post("/custom/connection", uath.checkAuth, async (req, res) => {
  if (req.body == undefined) {
    res.status(500).send({ error: " not found req.query" });
  } else {
    const params = [
      req.body.source,
      req.body.target,
      req.body.pdfId,
      req.user.uuid,
      req.body.connName,
    ];
    let result = await fileDTO.createCustomConnection(params);
    res.status(200).send(result);
  }
});

// // pdf 업로드 완료 체크(파이썬 서버에서 요청 받으)
// router.post("/download", uath.checkAuth, async (req, res, next) => {
//   const bucketName = process.env.AWS_BUCKET;
//   const key = req.body.file;

//   res.attachment(key); // 파일을 다운로드하도록 브라우저에 지시합니다.
//   downloadFile(bucketName, key, res);
// });

router.get("/circle", async (req, res, next) => {
  if (req.query.pdfId == undefined) {
    res.status(500).send({ error: "not found req.body" });
  } else {
    const params = [req.query.pdfId];
    let result = await fileDTO.selectcircle(params);
    // console.log(result);
    result2 = mergeArrays(result);
    console.log(result2);
    res.status(200).send(result2);
  }
});

function mergeArrays(arrays) {
  const result = {};

  arrays.forEach((array) => {
    array.forEach((keywords) => {
      if (result[keywords]) {
        result[keywords] += 1;
      } else {
        result[keywords] = 1;
      }
    });
  });

  return result;
}

module.exports = router;
