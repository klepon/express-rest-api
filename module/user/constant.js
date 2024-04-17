exports.table = {
  user: "users",
  history: "user_history",
  schedule: "user_deletion_schedule",
};

exports.validEmailValue = 1;

exports.onFinishUser = {
  emailUpdated: "emailUpdated",
  deleted: "deleted",
  updated: "updated",
};

exports.userPath = {
  main: "/user",
  register: "/register",
  login: "/login",
  profile: "/profile",
  requestEmailVerificationCode: "/request-email-verification-code",
  verifyEmail: "/verify-email",
};

exports.nonExistPuidToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWlkIjoiODQyNGM5MTQtNDFlYS00OTNiLWExYTgtN2I4NzdjMjYwZjkyIiwiaWF0IjoxNzEzMjU2MTg0fQ.KdlBsjFD7-OIBOINyBx_hRjo0EnEKVBs75O_jGg4rcE";
