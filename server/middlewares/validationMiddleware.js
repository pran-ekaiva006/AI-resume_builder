// server/middlewares/validationMiddleware.js
const { validate: isUUID } = require('uuid');

const validateUUID = (req, res, next) => {
  const { resumeId } = req.params;

  if (!isUUID(resumeId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid resumeId. Must be a valid UUID.',
    });
  }

  next();
};

module.exports = { validateUUID };