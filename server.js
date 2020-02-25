const http = require('http');
const config = require('config')
const mongoose = require('mongoose');
const app = require('./app')
const port = process.env.PORT || config.get('port')
const server = http.createServer(app)
const db = config.get('db')

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result=>{
    console.log("MongoDB Connected");
    server.listen(port, ()=> console.log(`Server Running on ${port}`));
}) 
.catch(err=>{
    console.log('MongoDB Connection Failed.....' + err)
    throw err;
})

