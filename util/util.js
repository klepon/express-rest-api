// only for ststic function, no import or required

exports.nonExistPuidToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWlkIjoiODQyNGM5MTQtNDFlYS00OTNiLWExYTgtN2I4NzdjMjYwZjkyIiwiaWF0IjoxNzEzMjU2MTg0fQ.KdlBsjFD7-OIBOINyBx_hRjo0EnEKVBs75O_jGg4rcE";

exports.getPath = (servicePath, path) => {
  return `${servicePath.main}${path}`;
};
