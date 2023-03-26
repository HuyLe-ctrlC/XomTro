const blockUser = (user) => {
  if (user?.isBlocked) {
    throw new Error(`Người dùng ${user?.firstName} ${user?.lastName} đã bị chặn. Do vi phạm tiêu chuẩn cộng đồng của website!`);
  }
};

module.exports = blockUser;
