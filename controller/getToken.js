const getAuthenticationToken = require('../src/PowerBI/Authentication')
const config = require('../src/PowerBI/Config.json')
const {validateConfigFile, getAuthHeader, sendGenerateEmbedTokenRequest} = require('../src/PowerBI/Utils')
const { StatusCodes } = require('http-status-codes')


class bodyData {
    constructor(username, datasetId){
        this.body = {}
        this.body.accessLevel = "View";
        this.body.identities = [{}];
        this.body.identities[0].username = username
        this.body.identities[0].datasets = [datasetId]
    }

    complianceAndGovernance() {                                                                  
        // datasetId: 4e828801-0ce7-4c1e-826f-fff588cf6eb4  reportId: e6728bf5-6222-42de-809b-3d36b6695ea5

        this.body.identities[0].roles = ["Access_Role","Global_admin"]
        return this.body
    }

    costMonitoringAndOptimization() {
        // datasetId: ba3d483d-cd58-46ab-8f6a-8d1dc4e45f4a  reportId: 9adbb041-1a60-4410-9f1e-fd48837be755
        this.body.identities[0].roles = ["New role"]
        return this.body
    }

    applicationHealthMonitoringORanomalyDetection(){
        // reportId: 169bfeea-b150-4e2b-a3c7-c42f85a8af43   datasetId: e63f6ab2-c5f5-40c1-abef-36964bc2d6e1
        // OR
        // reportId: 3a62d677-d312-44f3-bfc7-79703b0217a0   groupId: 92df1775-3ab0-4356-9b9a-3e4e1703c8ef

        this.body.identities[0].roles = ["Role_1"]
        return this.body
    }
}


const generateEmbedToken = async(res, reportId, username, datasetId) => {
    
    // validating for the config.json file

    const validation = validateConfigFile()

    if(validation){  
        return res.status(StatusCodes.BAD_REQUEST).json({"Error: ": validation})
    } 
    
    const tokenResponse = await getAuthenticationToken() // geting the authorization token
    const authHeader = getAuthHeader(tokenResponse)
    const url = config.apiUrl + 'v1.0/myorg/groups/' + config.workspaceId + '/reports/' + reportId + '/GenerateToken'
    const body = new bodyData(username, datasetId)
    let newData;

    if(datasetId === "ba3d483d-cd58-46ab-8f6a-8d1dc4e45f4a"){ // Cost Monitoring and Optimization
        newData = body.costMonitoringAndOptimization()
    }else if(datasetId === "4e828801-0ce7-4c1e-826f-fff588cf6eb4"){ // Compliance and Governance
        newData  = body.complianceAndGovernanceBody()
    }else{
        newData = body.applicationHealthMonitoringORanomalyDetection()  // Application health monitoring or Anomaly Detection
    }

    const options = {
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'      
        },
        method: 'POST',
        body: JSON.stringify(newData)
    }

    return await sendGenerateEmbedTokenRequest(url, options,reportId);
}

const getTokenForPowerBI = async(req, res) => {
    const { reportId, datasetId } = req.body 

    generateEmbedToken(res, reportId, req.user, datasetId).then((response) => {
        res.status(StatusCodes.OK).json({ accessToken : response})
    }).catch(err => {
        res.status(StatusCodes.BAD_REQUEST).json({"Error: ": err})
    })
}

module.exports = getTokenForPowerBI