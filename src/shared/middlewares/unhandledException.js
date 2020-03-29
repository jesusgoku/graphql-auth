// eslint-disable-next-line no-unused-vars
function unhandledExceptionMiddleware(err, _req, res, _next) {
  const statusCode = err.message === 'Not found' ? 404 : 500;
  res.status(statusCode).json({
    errors: [{ message: err.message }],
  });
}

export default unhandledExceptionMiddleware;
