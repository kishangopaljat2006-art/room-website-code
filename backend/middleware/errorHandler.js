const errorHandler = (err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack || err.message);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};

module.exports = errorHandler;
