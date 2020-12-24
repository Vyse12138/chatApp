var express = require('express');
var bodyParser = require('body-parser');

var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


var dbUrl = "mongodb+srv://admin:admin@chatapp-db.hhq8z.mongodb.net/admin?retryWrites=true&w=majority";

var Message = mongoose.model('Message',{
    name: String,
    message: String
})

var messages = [
    {name: 'Tim', message: 'Hello'},
    {name: 'Jake', message: 'Hi'}
]

app.get('/message', (req, res) => {
    res.send(messages);
})

app.post('/message', (req, res) => {
    let message = new Message(req.body)
    message.save((err) => {
        if (err) {
            sendStatus(500)
        }
        messages.push(req.body)
        io.emit('message', req.body)
        res.sendStatus(200)
    })

    
})

io.on('connection', (socket) => {
    console.log('connected')
})

mongoose.connect(dbUrl,   (err) => {
    console.log('mongo db connection',err)
})

let server = http.listen(3000, () => {
    console.log('server on: ' , server.address().port)
})