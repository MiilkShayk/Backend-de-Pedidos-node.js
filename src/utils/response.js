exports.sendSuccess = (res, data) => {
  return res.status(200).json({
    success: true,
    data
  });
};

exports.sendCreated = (res, data) => {
  return res.status(201).json({
    success: true,
    data
  });
};

exports.sendNoContent = (res) => {
  return res.status(204).send();
};
