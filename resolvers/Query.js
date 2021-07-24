const getUserId = require("../utils/getUserId");
const { course } = require("./InstructorCourse");

const Query = {
  hello() {
    return "Hello World!";
  },
  async availableCoursesForStudent(parent, args, { request, prisma }, info) {
    const userId = getUserId(request);
    try {
      if (!userId) {
        throw new Error("Unauthenticated Access");
      }
      const studentCourses = await prisma.studentCourse.findMany({
        where: {
          studentId: userId,
        },
        select: {
          courseId: true,
        },
      });

      const courseIds = studentCourses.map((studentCourse) => {
        return studentCourse.courseId;
      });

      const courses = await prisma.course.findMany({
        where: {
          id: {
            notIn: courseIds,
          },
        },
        include: {
          instructorCourse: {
            include: {
              user: true,
            },
          },
        },
      });

      return courses;
    } catch (e) {
      return e;
    }
  },
  async studentEnrolledCourses(parent, args, { request, prisma }, info) {
    const userId = getUserId(request);
    try {
      if (!userId) {
        throw new Error("Unauthenticated Access");
      }
      const studentCourses = await prisma.studentCourse.findMany({
        where: {
          studentId: userId,
        },
        include: {
          course: {
            include: {
              instructorCourse: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
      return studentCourses;
    } catch (e) {
      return e;
    }
  },
  async instructorCourses(parent, args, { request, prisma }, info) {
    const userId = getUserId(request);
    try {
      if (!userId) {
        throw new Error("Unauthenticated Access");
      }
      const instructorCourse = await prisma.instructorCourse.findMany({
        where: {
          instructorId: userId,
        },
        include: {
          course: {
            include: {
              studentCourses: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
      console.log(instructorCourse);
      return instructorCourse;
    } catch (e) {
      return e;
    }
  },
};

module.exports = Query;
