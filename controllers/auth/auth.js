const jwt = require("jsonwebtoken");

module.exports.auth = async (req, res, next) => {
  const token = req.headers["auth"];
  if (!token) {
    throw Error("unauthorize user, access denied");
  }

  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
