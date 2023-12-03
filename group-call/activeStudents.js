let activeStudents = [];

const addNewActiveStudent = (roomId, socketId, userInfo) => {
  const newActiveStudent = {
    roomId,
    socketId,
    ...userInfo,
    localCameraEnabled: false,
    localMicrophoneEnabled: false,
  };
  const participant = getActiveStudent(socketId);
  
  if (!participant) {
    activeStudents = [...activeStudents, newActiveStudent];
    return newActiveStudent;
  }

  participant;
};

const getActiveStudents = (roomId) => {
  const students = activeStudents.filter((item) => item.roomId === roomId);
  return [...students];
};

const getActiveStudent = (socketId) => {
  const student = activeStudents.find((item) => item.socketId === socketId);
  return student;
};

const removeActiveStudentByRoomId = (roomId) => {
  const remainingstudents = activeStudents.filter(
    (room) => room.roomId !== roomId
  );
  studentWaitingForTutor = [...remainingstudents];
};

const removeActiveStudentBySocketId = (socketId) => {
  const remainingstudents = activeStudents.filter(
    (room) => room.socketId !== socketId
  );
  studentWaitingForTutor = [...remainingstudents];
};

const updateActiveUserInfo = (socketId, data) => {
  const user = getActiveStudent(socketId);
  if (user) {
    const filteredStudents = activeStudents.filter(
      (student) => student.socketId !== socketId
    );

    activeStudents = [...filteredStudents, { ...user, ...data }];

    const updatedUser = getActiveStudent(socketId);

    return updatedUser;
  }
};

module.exports = {
  getActiveStudent,
  addNewActiveStudent,
  getActiveStudents,
  updateActiveUserInfo,
  removeActiveStudentByRoomId,
  removeActiveStudentBySocketId,
};
