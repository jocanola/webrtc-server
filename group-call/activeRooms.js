const { addNewActiveStudent } = require("./activeStudents");

let activeRooms = [];

const addNewActiveRoom = (roomId, userInfo) => {
  const room = getActiveRoom(roomId);

  if (!room) {
    const newActiveRoom = {
      roomId: roomId,
      roomName: roomId,
      host: {
        ...userInfo,
      },
    };

    activeRooms = [...activeRooms, newActiveRoom];
    const activeStudent = addNewActiveStudent(
      roomId,
      userInfo.socketId,
      userInfo
    );

    return newActiveRoom;
  }

  return { ...room };
};

const getActiveRooms = () => {
  return [...activeRooms];
};

const getActiveRoom = (roomId) => {
  const activeRoom = activeRooms.find((room) => room.roomId == roomId);
  if (activeRoom) {
    return { ...activeRoom };
  }
  if (!activeRoom) {
    return null;
  }
};

const removeActiveRoom = (roomId) => {
  const filteredRooms = activeRooms.filter((room) => room.roomId !== roomId);
  activeRooms = [...filteredRooms];
};

const joinActiveRoom = (roomId, newParticipant) => {
  const activeStudent = addNewActiveStudent(
    roomId,
    newParticipant.socketId,
    newParticipant
  );
  return { ...activeStudent, roomId };
};

const removeAllParticipantRoom = (roomId) => {
  removeActiveStudentByRoomId(roomId);
};

const leaveActiveRoomBySocketId = (socketId) => {
  removeActiveStudentBySocketId(socketId);
};

const updateActiveRoomInfo = (roomId, data) => {
  const room = getActiveRoom(roomId);
  if (room) {
    const filteredRooms = activeRooms.filter(
      (student) => student.roomId !== roomId
    );

    activeRooms = [...filteredRooms, { ...room, ...data }];

    const updatedRoomInfo = getActiveRoom(roomId);

    return updatedRoomInfo;
  }
};

module.exports = {
  addNewActiveRoom,
  getActiveRooms,
  getActiveRoom,
  joinActiveRoom,
  removeAllParticipantRoom,
  leaveActiveRoomBySocketId,
  updateActiveRoomInfo,
  removeActiveRoom,
};
