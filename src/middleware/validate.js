const validate = (schema, type) => (req, res, next) => {
    const { error, value } = schema.validate(req[type], { abortEarly: false })

    if (error) {
        return res.status(422).json({
            success: false,
            data: error.details.map(d => d.message)
        })
    }
    
    req[type] = value
    next()
}

export default validate