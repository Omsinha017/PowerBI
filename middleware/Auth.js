const jwtDecode = require('jwt-decode')
const { StatusCodes } = require('http-status-codes')
const errors = require('../src/PowerBI/Errors.json')

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({"Error: ":errors.TOKEN_NOT_PROVIDED})
  }

  token = req.headers.authorization.split(' ')[1]

  try {
    const decoded = jwtDecode(token)
    if(!decoded.unique_name){
        return res.status(StatusCodes.UNAUTHORIZED).json({"Error: ":errors.INVALID_TOKEN})
    }
    if (!req.body.datasetId || !req.body.reportId){
        return res.status(StatusCodes.BAD_REQUEST).json({"Error: ":errors.BODY_PARAMETERS_MISSING})
    }
    req.user = decoded.unique_name
    next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({"Error: ":errors.TOKEN_DECODE_ISSUE})
  }   
}

module.exports = authenticationMiddleware
