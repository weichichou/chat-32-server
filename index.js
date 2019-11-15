const express = require('express')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const Sse = require('json-sse')
const cors = require('cors')
const app = express()
const port = 4000
const corsMiddleware = cors()

// stream is a list of clients connected
const stream = new Sse()

const streams = {}

const messages = {}
// the object contains (key) room's name and (value) messages

function send(data){
    const string = JSON.stringify(data)
    stream.send(string)
}

app
    .use(corsMiddleware)
    .use(jsonParser)
    .get('/stream', (req, res, next)=>{
        
        const rooms = Object.keys(messages)
        const string = JSON.stringify(rooms)
        
        stream.updateInit(string)
        
        //connect clients
        stream.init(req, res)
    })
    .get('/rooms/:roomName', (req, res, next)=>{
        const {roomName} = req.params
        const stream = streams[roomName]
        const data = messages[roomName]
        const string = JSON.stringify(data)
        
        stream.updateInit(string)
        
        //connect clients
        stream.init(req, res)
    })
    .post('/room', (req, res, next)=>{
        const {name} = req.body
        send(name)

        streams[name] = new Sse()

        res.send(name)
    })
    .get('/', (req, res, next) => {
        res.send('hello world')
    })
    .get('/message', (req, res, next)=>{
        res.send(messages)
    })
    .post('/message/:roomName', (req, res, next)=> {
        const {message} = req.body
        const {roomName} = req.params
        const room = mesages[roomName]
        room.push(message)

        const stream = streams[roomName]
        const string = JSON.stringify(message)
        stream.send(string)
        
        res.send(message)
    })
    .listen(port, ()=>console.log(`Listening on port ${port}`))
