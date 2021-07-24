const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    hello: String!
    studentEnrolledCourses: [StudentCourse]
    instructorCourses: [InstructorCourse]
    availableCoursesForStudent: [Course!]
  }

  type Mutation {
    login(data: LoginUserInput!): AuthPayload!
    signUp(data: CreateUserInput!): AuthPayload!
    createCourse(data: CreateCourseInput): InstructorCourse!
    enroll(courseId: ID!): StudentCourse!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    userRole: UserRole!
  }

  type UserRole {
    id: ID!
    role: Role
  }

  type Role {
    id: ID!
    role: AllUserRole
  }

  type Course {
    id: ID!
    name: String!
    prerequisites: String!
    duration: Int!
    numberOfStudents: Int!
    instructor: InstructorCourse
    students: [StudentCourse]!
  }

  type InstructorCourse {
    id: ID!
    user: User!
    course: Course!
  }

  type StudentCourse {
    id: ID!
    status: StudentCourseStatus
    course: Course
    user: User
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  input CreateCourseInput {
    name: String!
    prerequisites: String!
    duration: Int!
  }

  enum StudentCourseStatus {
    IN_PROGRESS
    COMPLETED
  }

  enum AllUserRole {
    ADMIN
    INSTRUCTOR
    STUDENT
  }

  type Instructor {
    id: ID!
    course: Course!
    numberOfStudents: Int!
  }

  enum CreateUserRole {
    INSTRUCTOR
    STUDENT
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    role: CreateUserRole!
  }
`;

module.exports = {
  typeDefs,
};
