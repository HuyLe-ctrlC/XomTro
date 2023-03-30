const idMaxInRoom = (room) => {
  const allServices = room.map((item) => item.services).flat();
  const maxID = Math.max(...allServices.map((item) => item._id));
  return maxID;
};

module.exports = idMaxInRoom;
