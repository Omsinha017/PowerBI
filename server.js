require('dotenv').config();
const express = require('express');
const app = express();

const powerBITokenRouter = require('./Routes/PowerBI/main')

//middleware
app.use(express.json({ extended:false }))
app.use('/api/PowerBI', powerBITokenRouter)


// starting the server
const PORT = process.env.PORT || 3000;
const startServer = () => {
    try{
        app.listen(PORT,console.log(`Server is listening at ${PORT}`))
    }catch(e){
        console.log(e)
    }
}

startServer()