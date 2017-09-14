import { ObjectID } from 'mongodb';
import * as _ from 'lodash';

import { simplifiedRoomFieldsOptions, toSimplifiedRoom, scrambleFor } from './helpers';
import { Message } from '../src/app/models/message.model';
import { SimplifiedRoom, Room } from '../src/app/models/room.model';
import { State, UserState } from '../src/app/models/user-state.model';
import { Solve } from '../src/app/models/solve.model';
import { User } from '../src/app/models/user.model';

export function configureSockets(io, db) {
  io.on('connection', (socket: SocketIO.Socket) => {
    db.collection('rooms')
      .find({ public: true }, simplifiedRoomFieldsOptions)
      .toArray()
      .then((rooms: SimplifiedRoom[]) => {
        socket.emit('initialRooms', rooms);
      });

    socket.on('joinRoom', (data: { roomId: string; user: User; }) => {
      db.collection('rooms')
        .updateOne({ _id: new ObjectID(data.roomId) }, {
          $addToSet: {
            users: data.user,
            userStates: { userId: data.user._id, state: State.Ready }
          }
        })
        .then(({ modifiedCount }) => {
          if (modifiedCount) {
            socket.join(data.roomId);
            socket.broadcast.to(data.roomId).emit('userJoined', data.user);
          }
        });
    });

    socket.on('leaveRoom', (data: { roomId: string; user: User; }) => {
      db.collection('rooms')
        .findOne({ _id: new ObjectID(data.roomId) })
        .then((room: Room) =>
          removeUserFromRoom(data.user, room).then(() => newScrambleForRoomIfReady(room))
        );
    });

    socket.on('disconnect', () => {
      /* The `decoded_token` property is added by the `socketio-jwt` lib, so we need to work around the Typescript definition. */
      const user: User = (socket as any).decoded_token.user;
      db.collection('rooms')
        .findOne({ users: { $in: [user] } })
        .then((room: Room) => removeUserFromRoom(user, room));
    });

    socket.on('message', (data: { roomId: string, message: Message }) => {
      db.collection('rooms')
        .updateOne({ _id: new ObjectID(data.roomId) }, { $push: { messages: data.message } })
        .then(() => {
          socket.broadcast.to(data.roomId).emit('message', data.message);
        });
    });

    socket.on('solve', (data: { roomId: string, solve: Solve }) => {
      db.collection('rooms').findOne({ _id: new ObjectID(data.roomId) })
        .then((room: Room) => {
          room.solves.push(data.solve);
          _.find(room.userStates, { userId: data.solve.userId }).state = State.Ready;
          socket.broadcast.to(data.roomId).emit('solve', data.solve);
          return newScrambleForRoomIfReady(room).then(updated => {
            /* Ensure the changes are saved if the room hasn't been updated. */
            return updated || db.collection('rooms').updateOne({ _id: new ObjectID(data.roomId) }, room);
          });
        });
    });

    socket.on('stateChange', (data: { roomId: string, userState: UserState }) => {
      db.collection('rooms')
        .updateOne({ _id: new ObjectID(data.roomId), 'userStates.userId': data.userState.userId }, {
          $set: { 'userStates.$': data.userState }
        })
        .then(() => {
          socket.broadcast.to(data.roomId).emit('stateChange', data.userState);
        });
    });

    socket.on('newScrambleRequest', (roomId: string) => {
      db.collection('rooms').findOne({ _id: new ObjectID(roomId) })
        .then(newScrambleForRoomIfReady);
    });

    function newScrambleForRoomIfReady(room: Room): Promise<boolean> {
      const everyoneReady = _(room.userStates).map('state').difference([State.Ready, State.Spectating]).isEmpty();
      if (everyoneReady) {
        room.solveIndex += 1;
        _.filter(room.userStates, { state: State.Ready }).forEach((userState: UserState) => {
          userState.state = State.Scrambling;
        });
        return db.collection('rooms')
          .updateOne({ _id: new ObjectID(room._id) }, room)
          .then(() => io.to(room._id).emit('scramble', scrambleFor(room.event.id)))
          .then(() => true);
      } else {
        return Promise.resolve(false);
      }
    }

    function removeUserFromRoom(user: User, room: Room) {
      /* Note room always comes from the database, so the _id field is already an ObjectID. */
      _.remove(room.users, user);
      _.remove(room.userStates, { userId: user._id });
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
                   if (room.public) {
                     io.sockets.emit('roomRemoved', toSimplifiedRoom(room));
                   }
                 });
      }
    }
  });
}
