const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  await prisma.role.createMany({
    data: [{ role: "ADMIN" }, { role: "INSTRUCTOR" }, { role: "STUDENT" }],
  });
}

module.exports = {
  seed,
};
// main()
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {});
