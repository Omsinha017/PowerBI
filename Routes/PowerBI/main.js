const express = require('express')
const router = express.Router()

const getTokenForPowerBI = require('../../controller/getToken')

const authMiddleware = require('../../middleware/Auth')

router.route('/token').post(authMiddleware, getTokenForPowerBI)

module.exports = router
