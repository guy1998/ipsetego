const setCookie = (res, tokenObj) => {
  res.cookie(
    "tokenCookie",
    { ...tokenObj },
    {
      maxAge: 3600000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    }
  );
};

const deleteCookie = (res) => {
  res.cookie("tokenCookie", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};

module.exports = {
  setCookie,
  deleteCookie,
};