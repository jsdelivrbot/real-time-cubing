import { Room } from '../src/app/models/room.model';

export function configureSockets(io, db) {
  io.on('connection', (socket: SocketIO.Socket) => {
    db.collection('rooms').find().toArray().then((rooms: Room[]) => {
      socket.emit('initialRooms', rooms);
    });
  });
}
