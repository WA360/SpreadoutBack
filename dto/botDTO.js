const connection = require("../db/db");

async function createNewSession(params) {
  let sql = `insert into api_session (chapter_id, user_id) values(?,?);`;
  try {
    const [rows, fields] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function createNewMessage(params) {
  let sql = `insert into api_message (sender, content, created_at, session_id) values(?,?,NOW(),?);`;
  try {
    const [rows, fields] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function deleteChat(params) {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();

    const sqlDeleteMessage = `DELETE FROM api_message WHERE session_id = ?;`;
    await conn.query(sqlDeleteMessage, params);

    const sqlDeleteSession = `DELETE FROM api_session WHERE id = ?;`;
    await conn.query(sqlDeleteSession, params);

    await conn.commit();
    console.log("Transaction committed successfully");
  } catch (err) {
    console.error("Failed to execute transaction:", err);
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  createNewSession,
  createNewMessage,
  deleteChat,
};
