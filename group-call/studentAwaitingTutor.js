let studentsWaitingForTutor = [];

const addNewAwaitingStudent = (roomId, socketId, userInfo) => {
  const newActiveStudent = {
    roomId,
    socketId,
    userInfo,
  };

  studentsWaitingForTutor = [...studentsWaitingForTutor, newActiveStudent];
  return newActiveStudent;
};

const getStudentsAwaiting = (roomId) => {
  const students = studentsWaitingForTutor.filter(
    (item) => item.roomId === roomId
  );
  return [...students];
};

const removeStudentByRoomId = (roomId) => {
  const remainingstudents = studentsWaitingForTutor.filter(
    (room) => room.roomId !== roomId
  );
  studentWaitingForTutor = [...remainingstudents];
};

const removeStudentBySocketId = (socketId) => {
  const remainingstudents = studentsWaitingForTutor.filter(
    (room) => room.socketId !== socketId
  );
  studentWaitingForTutor = [...remainingstudents];
};

module.exports = {
  addNewAwaitingStudent,
  getStudentsAwaiting,
  removeStudentByRoomId,
  removeStudentBySocketId,
};
