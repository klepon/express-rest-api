// only for ststic function, no import or required

exports.getPath = (servicePath, path) => {
  return `${servicePath.main}${path}`
}
