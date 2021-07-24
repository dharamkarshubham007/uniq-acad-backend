const User = {
  userRole(parent, args, ctx, info) {
    return parent.UserRole;
  },
};

module.exports = User;
