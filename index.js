const express = require('express')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const app = express()
const port = 4000

const messages = []

app
    .use(jsonParser)
    .get('/', (req, res, next) => {
        res.send('hello world')
    })
    .get('/message', (req, res, next)=>{
        res.send(messages)
    })
    .post('/message', (req, res, next)=> {
        const {message} = req.body
        messages.push(message)
        res.send(message)
    })
    .listen(port, ()=>console.log(`Listening on port ${port}`))
