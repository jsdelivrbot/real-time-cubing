import { ObjectID } from 'mongodb';
import * as _ from 'lodash';

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

    socket.on('leaveRoom', (data: { roomId: string; user: User; }) => {
      const idCondition = { _id: new ObjectID(data.roomId) };
      db.collection('rooms')
        .findOne(idCondition)
        .then((room: Room) => {
          _.remove(room.users, data.user);
          if (room.users.length) {
            return db.collection('rooms')
                     .updateOne(idCondition, room)
                     .then(() => {
                       socket.leave(data.roomId);
                       io.to(data.roomId).emit('userLeft', data.user);
                     });
          } else {
            return db.collection('rooms')
                     .removeOne(idCondition)
                     .then(() => {
                       socket.leave(data.roomId);
                       io.sockets.emit('roomRemoved', room);
                     });
          }
        });
    });
  });
}
