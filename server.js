var express = require('express');
var bodyParser = require('body-parser');

var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
var messages = [
    {name: 'Tim', message: 'Hello'},
    {name: 'Jake', message: 'Hi'}
]

app.get('/message', (req, res) => {
    res.send(messages);
})

app.post('/message', (req, res) => {
    messages.push(req.body)
    io.emit('message', req.body)
    res.sendStatus(200)
    
})

io.on('connection', (socket) => {
    console.log('connected')
})

let server = http.listen(3000, () => {
    console.log('server on: ' , server.address().port)
})