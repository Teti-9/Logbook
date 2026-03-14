const errorMiddleware = (err, req, res, next) => {

  const statusCode = err.statusCode || 500
  const message = err.message || 'Ocorreu um erro interno no servidor.'

  res.status(statusCode).json({
    success: false,
    data: message,
  })
}

export default errorMiddleware
