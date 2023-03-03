const express = require('express')
const router = express.Router()

const service = require('./modules/service')

router.use('/service', service)

module.exports = router
