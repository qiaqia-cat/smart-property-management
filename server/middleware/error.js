const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ code: 500, msg: '服务器内部错误', error: err.message });
};

module.exports = errorHandler;
