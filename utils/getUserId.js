const jwt = require("jsonwebtoken");
const getUserId = (request, requireAuth = true) => {
  const header = request.req
    ? request.req.headers.authorization
    : request.connection.context.authorization;
  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.userId;
  }

  if (requireAuth) {
    throw new Error("Authentication required");
  }
};
module.exports = getUserId;
