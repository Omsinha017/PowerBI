const config = require('./Config.json')
const AuthenticationContext = require('adal-node').AuthenticationContext

const getAuthenticationToken = async() => {

    if (config.authenticationType == "MasterUser"){
        var context = new AuthenticationContext(config.authorityUrl)
        
    }else if (config.authenticationType == "ServicePrincipal"){
        var authorityUrl = config.authorityUrl.replace('common', config.tenantId);
        var context = new AuthenticationContext(authorityUrl)
    }
    try {
        token = await getToken(context)
        return token.accessToken
    } catch (error) {
        console.log("Error ", error)
    }
    
}

const getToken = (context) => {
    return new Promise((resolve, reject) => {
        context.acquireTokenWithClientCredentials(config.resourceUrl, config.appId, config.applicationSecret, (err, tokenResponse) => {
            if (err){ console.log("Error :", err)
            reject(err);
        }
        resolve(tokenResponse);
        })
    })
}

module.exports = getAuthenticationToken