import { ObjectID } from 'mongodb';

import { Room } from '../src/app/models/room.model';
import { User } from '../src/app/models/user.model';

export function configureSockets(io, db) {
  io.on('connection', (socket: SocketIO.Socket) => {
    db.collection('rooms').find().toArray().then((rooms: Room[]) => {
      socket.emit('initialRooms', rooms);
    });

    socket.on('joinRoom', (data: { roomId: string; user: User; }) => {
      db.collection('rooms')
        .updateOne({ _id: new ObjectID(data.roomId) }, { $addToSet: { users: data.user } })
        .then(({ modifiedCount }) => {
          if (modifiedCount) {
            socket.join(data.roomId);
            io.to(data.roomId).emit('userJoined', data.user);
          }
        });
    });
  });
}
