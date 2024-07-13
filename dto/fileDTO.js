const connection = require("../db/db");

function insertPdfInfo(params) {
  let sql = `INSERT into jungle_file (name, userId_id,url) values(?,?,?)`;
  return new Promise((resolve, reject) => {
    connection((conn) => {
      conn.query(sql, params, (err, rows, fields) => {
        if (err) reject(err);
        resolve(rows);
      });
      conn.release();
    });
  });
}

function readPdfInfo(params) {
  let sql = `select * from api_pageconnection ap where ap.pdf_file_id = ?;`;
  return new Promise((resolve, reject) => {
    connection((conn) => {
      conn.query(sql, params, (err, rows, fields) => {
        if (err) reject(err);
        resolve(rows);
      });
      conn.release();
    });
  });
}

function readPdfUrl(params) {
  let sql = `select ap.url from api_pdffile ap where ap.id =?;`;
  return new Promise((resolve, reject) => {
    connection((conn) => {
      conn.query(sql, params, (err, rows, fields) => {
        if (err) reject(err);
        resolve(rows);
      });
      conn.release();
    });
  });
}

function readPdfNode(params) {
  let sql = `select * from api_chapter ac where ac.pdf_file_id =?;`;
  return new Promise((resolve, reject) => {
    connection((conn) => {
      conn.query(sql, params, (err, rows, fields) => {
        if (err) reject(err);
        resolve(rows);
      });
      conn.release();
    });
  });
}

function readPdfListFromUser(params) {
  let sql = `select * from api_pdffile ap where ap.user_id =?;`;
  return new Promise((resolve, reject) => {
    connection((conn) => {
      conn.query(sql, params, (err, rows, fields) => {
        if (err) reject(err);
        resolve(rows);
      });
      conn.release();
    });
  });
}

module.exports = {
  insertPdfInfo,
  readPdfInfo,
  readPdfUrl,
  readPdfNode,
  readPdfListFromUser,
};
