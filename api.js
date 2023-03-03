const db = require('./db_service')

const postApi = (caller, data, res) => {
  let sql = `CALL ${caller}(?)`
  if (data == null) sql = `CALL ${caller}()`
  let payload = null
  // console.log({db})
  db.getConnection((conn) => {
    conn.query(sql, data, (err, rows) => {
      if(err) {
        console.log(err)
      } else {
        payload = {
          state: rows[0][0]['rtn_val'],
          message: rows[0][0]['msg_txt'],
          data: JSON.parse(rows[0][0]['json_data']),
        }
        // console.log({payload})
        return res(payload)
      }
    });
    conn.release(); //사용후 connection 객체 반환
  })
}

module.exports = {
  postApi
}