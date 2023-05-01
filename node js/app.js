const server = require('http').createServer()
const io = require('socket.io')(server)

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://abdalhkim220598:A97427212@cluster0.kqxpi2c.mongodb.net/alldata?retryWrites=true&w=majority').then(r=>{
console.log('----===========-------');

console.log('connected');
}).catch((e)=>{
    console.log(e);
})




let users = [];


const addUser = (userId,socketId)=>{
    !users.some((user)=> user.userId === userId) && users.push({userId, socketId});
}

const getUser = (userId)=>{
   return  users.find(user => user.userId === userId);
}


const removeUser = (socketId)=>{
    users = users.filter((user)=>user.socketId !== socketId);
}



io.on('connection', function (client) {

    console.log('connection ----');


 



  console.log('client connect...', client.id);


  client.on('addUser', function name(data) {
   addUser(data.userId,client.id);
   console.log(users);

   io.emit('getUsers', users);
  })


  client.on('typing', function name(data) {
    console.log(data);
    const user = getUser(data.targetId);
    if(user)  io.to(user.socketId).emit('typing', data)
  })

  client.on('message', function name(data) {

    const user = getUser(data.targetId);

    console.log('-----------user------');
    if(user)   console.log(user.socketId);
    console.log('-----------user------');

   if(user) io.to(user.socketId).emit('message', {
        'sender':data.sender,
        'text':data.message,
        'target':data.targetId,
    });
  })

 


  client.on('disconnect', function () {
    console.log('client disconnect ...', client.id);
    removeUser(client.id);
   
  })

  client.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})

var server_port = process.env.PORT || 3000;
server.listen(server_port, function (err) {
  if (err) throw err
  console.log('Listening on port %d', server_port);
});

// mongodb+srv://abdalhkim220598:<password>@cluster0.kqxpi2c.mongodb.net/?retryWrites=true&w=majority






// var chat = {
//     "chatId": "22",
//     "users": [],
//     "history": [
//         {
//             "messageId": "15",
//             "sender": "Ata",
//             "content": "selam"
//         },
//         {
//             "messageId": "16",
//             "sender": "Ata",
//             "content": "selam"
//         },
//         {
//             "messageId": "17",
//             "sender": "Hasan",
//             "content": "naber"
//         },
//         {
//             "messageId": "18",
//             "sender": "Ata",
//             "content": "iyi senden naber"
//         },
//         {
//             "messageId": "19",
//             "sender": "Ata",
//             "content": "fena değil"
//         },
//         {
//             "messageId": "20",
//             "sender": "Hasan",
//             "content": "güzel!"
//         },
//     ]
// }
