function validateSchemaMiddleware(schema, options) {
  return async (req, res, next) => {
    try {
      req.body = await schema.validateAsync(req.body, options);

      await next();
    } catch (err) {
      res.status(400).json({ errors: [{ message: err.message }] });
    }
  };
}

export default validateSchemaMiddleware;
