var express = require('express');
var app = express();

app.use(express.static('./'));
app.get('/', function (req, res) {
    res.sendFile('./index.html');
})

app.listen(3001, function () {
    console.log('Listening on port 3001');
})
