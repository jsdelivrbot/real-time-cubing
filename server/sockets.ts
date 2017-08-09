import { Room } from '../src/app/models/room.model';

export function configureSockets(io, db) {
  io.on('connection', (socket: SocketIO.Socket) => {
    db.collection('rooms').find().toArray().then((rooms: Room[]) => {
      socket.emit('initialRooms', rooms);
    });

    socket.on('createRoom', (room: Room) => {
      db.collection('rooms').insertOne(room).then(() => {
        socket.join(room.name);
        socket.broadcast.emit('newRoom', room);
      });
    });
  });
}
