const errorMiddleware = (err, req, res, next) => {

  const statusCode = err.statusCode || 500
  const message = err.message || 'Ocorreu um erro interno no servidor.'

  if (err.code === 11000 ) {
    res.status(409).json({
      success: false,
      data: 'Esse email está em uso, digite outro email.'
    })

  } else {
    res.status(statusCode).json({
      success: false,
      data: message,
    })
  }

}

export default errorMiddleware
