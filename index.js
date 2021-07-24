const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers/index");
const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context(request) {
    return { prisma, request };
  },
});

server.listen().then(({ url }) => {
  console.log("Server is running at " + url);
});
