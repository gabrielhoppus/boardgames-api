export async function validateSchema(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            res.status(400).send(error.details)
        }
        next();
    }
}