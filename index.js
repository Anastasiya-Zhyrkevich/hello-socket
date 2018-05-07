const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs  = require('fs');

const file_name = 'messages';
fs.appendFileSync(file_name, '');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/clear', (req, res) => {
  fs.writeFileSync(file_name, '');
  res.redirect('/');
});

io.on('connection', socket => {
  //connect
  console.log('socket connected');
  fs.readFileSync(file_name, 'utf8').split('\n').filter(e => e).forEach(element => {
    socket.emit('chat message', element);
  });

  // disconnect
  socket.on('disconnect', () => console.log('socket disconnected'));

  //send message
  socket.on('chat message', msg => {
    if (!msg) return;
    io.emit('chat message', msg);
    fs.appendFileSync(file_name, msg + '\n');
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log('http');
});
