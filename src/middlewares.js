import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

//로그인하지 않은 사용자가 로그인한 유저만 접근할 수 있는 페이지에 접근하는 것 방지하기 위한 미들웨어(에딧, 프로필 페이지)
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};

//로그인하지 않은 사용자만 이용하는 url에 추가할 미들웨어(로그인 페이지, 가입 페이지)
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const uploadFiles = multer({ dest: "uploads/" });
