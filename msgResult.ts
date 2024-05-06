const error = (data: Recordable) => {
  return {
    code: "error",
    data
  }
};

const msg = (data: Recordable) => {
  return {
    code: "ok",
    data
  }
};

module.exports = {
  error,
  msg
}