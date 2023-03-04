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
cron.schedule('* * 0 * * *', function(){
  console.log('node-cron 실행됨')
  update_ATPT_OFCDC_SC_CODE()
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