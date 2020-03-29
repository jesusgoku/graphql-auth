function validateSchemaResolver(schema, options) {
  return (resolver) => {
    return async (parent, args, context, info) => {
      const validatedArgs = await schema.validateAsync(args, options);

      return resolver(parent, validatedArgs, context, info);
    };
  };
}

export default validateSchemaResolver;
