const Course = {
  instructor(parent, args, ctx, info) {
    return parent.instructorCourse;
  },
  students(parent, args, ctx, info) {
    return parent.studentCourses;
  },
};
module.exports = Course;
