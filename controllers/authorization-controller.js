/**
 * This file contains the controller functions for the authorization for admin and users.
 * Its functions gets called in the main.js file.
 * The controller functions are responsible for handling the request and response.
 */

const authorize = (roles) => {
  return (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = {
  authorize,
};