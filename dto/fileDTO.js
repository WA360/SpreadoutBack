const connection = require("../db/db");

async function insertPdfInfo(params) {
  let sql = `INSERT into jungle_file (name, userId_id,url) values(?,?,?)`;
  try {
    const [rows, fields] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function readPdfInfo(params) {
  let sql = `select * from api_pageconnection ap where ap.pdf_file_id = ?;`;
  try {
    const [rows, fields] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function readPdfUrl(params) {
  let sql = `select ap.url from api_pdffile ap where ap.id =?;`;
  try {
    const [rows, fields] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function readPdfNode(params) {
  let sql = `select * from api_chapter ac where ac.pdf_file_id =?;`;
  try {
    const [rows, fields] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function readPdfListFromUser(params) {
  let sql = `select * from api_pdffile ap where ap.user_id =?;`;
  try {
    const [rows, fields] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  insertPdfInfo,
  readPdfInfo,
  readPdfUrl,
  readPdfNode,
  readPdfListFromUser,
};
