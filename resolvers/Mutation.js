const { generateToken } = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const getUserId = require("../utils/getUserId");

const Mutation = {
  login: async (parent, { data }, { prisma }, info) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
        include: {
          UserRole: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(data.password, user.password);

      if (!isMatch) {
        throw new Error("Invalid email or password");
      }
      return {
        user,
        token: generateToken(user.id),
      };
    } catch (e) {
      return e;
    }
  },
  createCourse: async (parent, { data }, { prisma, request }, info) => {
    const userId = getUserId(request);
    try {
      if (!userId) {
        throw new Error("Unauthenticated Access");
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          UserRole: {
            include: {
              role: true,
            },
          },
        },
      });

      const role = user.UserRole.role.role;

      if (role != "INSTRUCTOR") {
        throw new Error("Unauthorized Access");
      }

      const { name, duration, prerequisites } = data;

      const course = await prisma.course.create({
        data: {
          name,
          duration,
          prerequisites,
          numberOfStudents: 0,
        },
      });

      const instructorCourse = await prisma.instructorCourse.create({
        data: {
          instructorId: userId,
          courseId: course.id,
        },
      });

      instructorCourse.course = course;
      return instructorCourse;
    } catch (e) {
      return e;
    }
  },
  enroll: async (parent, { courseId }, { prisma, request }, info) => {
    // Need to convert to int for query
    courseId = parseInt(courseId);
    const userId = getUserId(request);
    try {
      if (!userId) {
        throw new Error("Unauthenticated Access");
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          UserRole: {
            include: {
              role: true,
            },
          },
        },
      });

      const role = user.UserRole.role.role;

      if (role != "STUDENT") {
        throw new Error("Unauthorized Access");
      }

      const course = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        include: {
          instructorCourse: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!course) {
        throw new Error("Invalid Course Id");
      }
      console.log({ course });

      const isStudentAlreadyEnrolled = await prisma.studentCourse.findFirst({
        where: {
          studentId: userId,
          courseId: courseId,
        },
      });

      if (isStudentAlreadyEnrolled) {
        throw new Error("You have already enrolled for this course");
      }

      const studentCourse = await prisma.studentCourse.create({
        data: {
          status: "IN_PROGRESS",
          studentId: userId,
          courseId,
        },
      });

      await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          numberOfStudents: {
            increment: 1,
          },
        },
      });

      studentCourse.course = course;
      return studentCourse;
    } catch (e) {
      return e;
    }
  },
  signUp: async (parent, { data }, { prisma }, info) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: data.email.toLowerCase(),
        },
      });

      if (user) {
        throw new Error("User already registered with given email");
      }

      const salt = bcrypt.genSaltSync(+process.env.SALT_ROUND);
      data.password = await bcrypt.hash(data.password, salt);

      const role = await prisma.role.findFirst({
        where: {
          role: data.role,
        },
      });

      if (!role) {
        throw new Error("Invalid role is provided");
      }

      const { firstName, lastName, email, password } = data;

      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email: email.toLowerCase(),
          password,
        },
      });

      const userRole = await prisma.userRole.create({
        data: {
          roleId: role.id,
          userId: newUser.id,
        },
      });

      newUser.role = { ...userRole };

      return { user: newUser, token: generateToken(newUser.id) };
    } catch (error) {
      return error;
    }
  },
};

module.exports = Mutation;
