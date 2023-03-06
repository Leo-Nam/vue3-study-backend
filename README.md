# vue3-study-backend
db_config.json과 .env는 공유되지 않았습니다.
db연결되는 부분과 data.go.kr의 api사용을 위한 service key는 개별적으로 등록하여 사용하면 됩니다.


# db_config.json
{
  "db_alias": {
    "host": ip주소 또는 도메인,
    "user": 데이타베이스 접근 가능한 사용자 ID,
    "password": 사용자 암호,
    "database": 데이타베이스 이름,
    "port": 접근포트로서 보통 3306임. 시스템 관리자에 의하여 변경된 경우에는 관리자에게 문의해야 함,
    "charset": "utf8mb4_unicode_ci",
    "multipleStatements": true,
    "connectionLimit": 100,
    "waitForConnections": false,
    "wait_timeout": 5
  }
}


# .env
PORT=프론트앤드가 백앤드와 내부적으로 통신할 수 있는 서버 번호로서 보통 백앤드 개발시 정할 수 있음

ATPT_OFCDC_SC_CODE_API_KEY= https://open.neis.go.kr에 대한 api 사용허가를 득한 api key
dataGoKr_apiKey=http://apis.data.go.kr에 대한 api 사용허가를 득한 api key
