import { ObjectID } from 'mongodb';
import * as _ from 'lodash';

import { simplifiedRoomFieldsOptions, toSimplifiedRoom } from './helpers';
import { Message } from '../src/app/models/message.model';
import { SimplifiedRoom, Room } from '../src/app/models/room.model';
import { User } from '../src/app/models/user.model';

export function configureSockets(io, db) {
  io.on('connection', (socket: SocketIO.Socket) => {
    db.collection('rooms')
      .find({}, simplifiedRoomFieldsOptions)
      .toArray()
      .then((rooms: SimplifiedRoom[]) => {
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
      db.collection('rooms')
        .findOne({ _id: new ObjectID(data.roomId) })
        .then((room: Room) => removeUserFromRoom(data.user, room));
    });

    socket.on('disconnect', () => {
      /* The `decoded_token` property is added by the `socketio-jwt` lib, so we need to work around the Typescript definition. */
      const user: User = (socket as any).decoded_token.user;
      db.collection('rooms')
        .findOne({ users: { $in: [user] } })
        .then((room: Room) => removeUserFromRoom(user, room));
    });

    socket.on('message', (message: Message) => {
      /* TODO: Save to the db. */
      /* TODO: Emit to users in the room. */
    });

    function removeUserFromRoom(user: User, room: Room) {
      _.remove(room.users, user);
      if (room.users.length) {
        return db.collection('rooms')
                 .updateOne({ _id: room._id }, room)
                 .then(() => {
                   socket.leave(room._id);
                   io.to(room._id).emit('userLeft', user);
                 });
      } else {
        return db.collection('rooms')
                 .removeOne({ _id: room._id })
                 .then(() => {
                   socket.leave(room._id);
                   io.sockets.emit('roomRemoved', toSimplifiedRoom(room));
                 });
      }
    }
  });
}
