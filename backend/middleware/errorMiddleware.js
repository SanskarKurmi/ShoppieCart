function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  const payload = {
    success: false,
    message: err.message || "Server error",
  };

  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}

module.exports = errorMiddleware;

