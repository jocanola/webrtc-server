const {
  addNewActiveRoom,
  getActiveRoom,
  getActiveRooms,
  joinActiveRoom,
  updateActiveRoomInfo,
  removeActiveRoom,
} = require("./activeRooms");
const {
  addNewActiveStudent,
  updateActiveUserInfo,
  getActiveStudents,
  removeActiveStudentBySocketId,
  removeActiveStudentByRoomId,
} = require("./activeStudents");
const {
  getStudentsAwaiting,
  addNewStudent,
  removeStudentBySocketId,
  addNewAwaitingStudent,
} = require("./studentAwaitingTutor");

const groupCallListeners = (socket, io) => {
  socket.on("disconnect", () => {
    // removeStudentBySocketId(socket.id);
    console.log(`${socket.id} disconnected successfully`);
  });

  socket.on("group-call-register", (data) => {
    const { roomId, user, peerId, streamId } = data;
    const roomInfo = addNewActiveRoom(roomId, {
      ...user,
      socketId: socket.id,
      peerId,
      streamId,
    });

    const tutorInfo = addNewActiveStudent(roomId, socket.id, {
      ...user,
      peerId: peerId,
      streamId: streamId,
    });

    io.to(roomId).emit("group-call-register", {
      peerId: peerId,
      streamId: streamId,
      user: user,
      roomInfo: roomInfo,
    });

    const participants = getActiveStudents(roomId);

    io.to(data.roomId).emit("group-call-join-request", {
      peerId: peerId,
      streamId: streamId,
      user: user,
      roomInfo: roomInfo,
      participants,
    });

    socket.join(data.roomId);

    const studentsWaiting = getStudentsAwaiting(roomId);
    if (studentsWaiting.length > 0) {
      studentsWaiting.forEach((item) => {
        io.to(item.socketId).emit("has-class-started", {
          roomInfo: roomInfo,
          hasClassStarted: true,
          participants,
        });
      });
    }
  });

  socket.on("has-class-started", (data) => {
    const { roomId, user } = data;
    const roomInfo = getActiveRoom(roomId);
    const participants = getActiveStudents(roomId);

    if (roomInfo) {
      socket.emit("has-class-started", {
        roomInfo: roomInfo,
        hasClassStarted: true,
        participants,
      });
    }

    if (!roomInfo) {
      addNewAwaitingStudent(roomId, socket.id, user);
    }
  });

  socket.on("group-call-join-request", (data) => {
    const { roomId, user, streamId, peerId } = data;

    joinActiveRoom(roomId, {
      ...user,
      socketId: socket.id,
      peerId,
      streamId,
    });

    const roomInfo = getActiveRoom(roomId);
    const participants = getActiveStudents(roomId);

    io.to(data.roomId).emit("group-call-join-request", {
      peerId: data.peerId,
      streamId: data.streamId,
      user: data.user,
      room: roomInfo,
      participants,
    });

    socket.join(data.roomId);
  });

  socket.on("change-user-info", (data) => {
    const user = updateActiveUserInfo(socket.id, data);
    io.to(data.roomId).emit("change-user-info", {
      user,
    });
  });

  socket.on("get-room-info", (data) => {
    const participants = getActiveStudents(data.roomId);
    io.to(data.roomId).emit("get-room-info", {
      participants,
    });
  });

  socket.on("sharing-screen", (data) => {
    io.to(data.roomId).emit("sharing-screen", {
      peerId: data.peerId,
      userId: data.userId,
    });
  });

  socket.on("group-call-user-left", (data) => {
    socket.leave(data.roomId);

    removeActiveStudentBySocketId(socket.id);
    removeStudentBySocketId(socket.id);

    io.to(data.roomId).emit("group-call-user-left", {
      streamId: data.streamId,
      // peerId: data.peerId
    });
  });

  socket.on("group-call-close-by-host", (data) => {
    removeActiveStudentByRoomId(data.roomId);
    removeActiveRoom(data.roomId);
    console.log("group-call-close-by-host", data.roomId);
    io.to(data.roomId).emit("group-call-close-by-host");
  });

  socket.on("live-class-chat", (data) => {
    io.to(data.roomId).emit("live-class-chat", {
      message: data.messageInfo,
    });
  });

  socket.on("start-recording", (data) => {
    const room = updateActiveRoomInfo(data.roomId, data);
    io.to(data.roomId).emit("start-recording", {
      ...room,
    });
  });
};

module.exports = groupCallListeners;
