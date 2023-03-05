require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const cron = require('node-cron');
const app = express()
const { PORT } = process.env
const routes = require('./router')
const { update_ATPT_OFCDC_SC_CODE } = require('./modules/ATPT_OFCDC_SC_CODE.js')
const { get_bcode_list } = require('./modules/getStanReginCdList.js')
const corsOption = {
  cors: {
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
  },
  allowEIO3: true,
}

// update_ATPT_OFCDC_SC_CODE()
// cron
// 1. second: 0-59
// 2. minute: 0-59
// 3. hour: 0-23
// 4. day of month: 1-31
// 5. month: 1-12
// 6. day of week: 0-7 (0 또는 7이 일요일임)
cron.schedule('* * 0 * * *', function(){ //매일 밤 0시에 실행됨
  console.log('교습소 등록 자료 크롤링 시작함')
  update_ATPT_OFCDC_SC_CODE()
});

// get_bcode_list()
cron.schedule('* * 6 1 * *', function(){ //매월 1일 밤 오전 6시에 실행됨
  console.log('법정동 코드 업데이트 실행됨')
  get_bcode_list()
()
});

let isDisableKeepAlive = false
app.use(function (req, res, next) {
  if (isDisableKeepAlive) {
    res.set('Connection', 'close')
  }
  next()
})
console.log('vue3 vite study backend is now loading...')
// app.use(encryptPassword)
app.use(require('connect-history-api-fallback')())
app.use(express.static('dist'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())
app.use('/api', routes)

const handleListening = () => {
  if (process.send) {
    process.send('ready')
  }
  console.log('Web Server가 ' + PORT + '번 포트를 통하여 서비스를 시작합니다.')
}
const serverListener = app.listen(PORT, handleListening)
process.on('SIGINT', function () {
  isDisableKeepAlive = true
  serverListener.close(function (err) {
    console.log('Web Server closed')
    process.exit(err ? 1 : 0)
  })
})
module.exports = app