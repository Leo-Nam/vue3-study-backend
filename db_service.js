const mysql = require('mysql');
const db_config = require('./db_config.json');

let pool = mysql.createPool(db_config.ubuntu);

const db = {
  getConnection : (callback)=>{
    pool.getConnection((err, conn)=>{ 
      if(err) throw err; //연결 오류 발생시 상위 함수로 오류를 던지기
      callback(conn); //상위 함수에서 보낸 콜백함수에 conn이라는 Connection 객체를 파라미터로 담고 호출
    });
  }
}

module.exports = db; //db객체 반환