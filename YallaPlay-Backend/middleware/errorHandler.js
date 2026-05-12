function notFoundHandler(req, res) {
  res.status(404).json({ message: "Route not found" });
}

function errorHandler(error, req, res, next) {
  console.error(error);
  res.status(500).json({ message: "Something went wrong on the server" });
}

module.exports = { notFoundHandler, errorHandler };
