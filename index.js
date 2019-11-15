const express = require('express')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const Sse = require('json-sse')
const app = express()
const port = 4000

// stream is a list of clients connected
const stream = new Sse()
const messages = []

app
    .use(jsonParser)
    .get('/stream', (req, res, next)=>{
        const string = JSON.stringify(messages)
        
        stream.updateInit(string)
        
        //connect clients
        stream.init(req, res)
    })
    .get('/', (req, res, next) => {
        res.send('hello world')
    })
    .get('/message', (req, res, next)=>{
        res.send(messages)
    })
    .post('/message', (req, res, next)=> {
        const {message} = req.body
        
        const string = JSON.stringify(message)

        stream.send(string)
        messages.push(message)
        
        res.send(message)
    })
    .listen(port, ()=>console.log(`Listening on port ${port}`))
