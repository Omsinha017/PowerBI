const request = require('request');
const config = require('./Config.json')
const guid = require('guid');
const errors = require('../../src/PowerBI/Errors.json')
const { StatusCodes } = require('http-status-codes')


const getAuthHeader = (accessToken) => {
    return "Bearer ".concat(accessToken)
}

const validateConfigFile = () => {

    if(!config.authenticationType){
        return errors.AUTHENTICATION_EMPTY
    }

    if(config.authenticationType != 'MasterUser' && config.authenticationType != 'ServicePrincipal'){
        return errors.AUTHENTICATION_TYPE_ERROR
    }

    if(!config.appId){
        return errors.APP_ID_EMPTY
    }

    if(!guid.isGuid(config.appId)){
        return errors.APP_ID_INVALID
    }

    if(!config.workspaceId){
        return errors.EMPTY_WORKSPACE_ID
    }

    if(!guid.isGuid(config.workspaceId)){
        return errors.WORKSPACE_ID_INVALID
    }

    if(!config.authorityUrl){
        return errors.EMPTY_AUTHORITY_URL
    }

    if(config.authenticationType === 'MasterUser'){
        if(!config.username || !config.username.trim()){
            return errors.EMPTY_USERNAME
        }

        if(!config.password || !config.password.trim()){
            return errors.EMPTY_PASSWORD
        }

    } else if(config.authenticationType === 'ServicePrincipal'){

        if (!config.applicationSecret || !config.applicationSecret.trim()){
            return errors.APPLICATION_SECRET_EMPTY
        }

        if(!config.tenantId){
            return errors.TENANT_ID_EMPTY
        }

        if(!guid.isGuid(config.tenantId)){
            return errors.TENANT_ID_INVALID
        }
    }
}

const sendGenerateEmbedTokenRequest = async(url, options, reportId) => {

    const embedTokenRespose = () => {
        return new Promise((resolve, reject) => {
            request(url, options, (error, response, body) => {
                const generateEnbedTokenRes = JSON.parse(body)
                if(body == ''){
                    reject(`No report with id: ${reportId} in group with id: ${config.workspaceId}`)
                }
                if(response.statusCode !==200){
                    reject(`Error: ${generateEnbedTokenRes}`)
                }else{
                    resolve(generateEnbedTokenRes.token)
                }
    
            })
        })
    }
    try {
        return await embedTokenRespose()
    } catch (error) {
        return res.status(StatusCodes.OK).json({"Error: ": error})
    }
}

module.exports = {getAuthHeader, validateConfigFile, sendGenerateEmbedTokenRequest}