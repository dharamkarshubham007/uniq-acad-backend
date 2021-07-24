const InstructorCourse = {
  user(parent, args, ctx, info) {
    delete parent.user.password;
    return parent.user;
  },
  course(parent, args, ctx, info) {
    return parent.course;
  },
};
module.exports = InstructorCourse;
