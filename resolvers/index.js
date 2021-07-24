const Course = require("./Course.js");
const InstructorCourse = require("./InstructorCourse.js");
const Mutation = require("./Mutation.js");
const Query = require("./Query.js");
const StudentCourse = require("./StudentCourse.js");
const User = require("./User.js");
const resolvers = {
  Mutation,
  Query,
  User,
  Course,
  InstructorCourse,
  StudentCourse,
};

module.exports = {
  resolvers,
};
