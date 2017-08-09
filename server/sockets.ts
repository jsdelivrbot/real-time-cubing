const rooms = [];

export function configureSockets(io, db) {
  io.on('connection', socket => {
    socket.emit('initialRooms', rooms);

    socket.on('createRoom', room => {
      rooms.push(room);
      socket.join(room.name);
      socket.broadcast.emit('newRoom', room);
    });
  });
}
