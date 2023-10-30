import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

//🚀 프로덕션용, 즉 fly.io 사용중이면 multer s3 사용 O / 로컬이면 s3 사용 X
const isHeroku = process.env.NODE_ENV === "production";
console.log("🥺", isHeroku);
//s3 오브젝트 만들기
//옵션으로 AWS_ID와 AWS_SECRET 둘 다 옵션으로 전달해야 한다.
const s3 = new aws.S3({
  signatureVersion: "v4",
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

//multer s3 업로더
//✅ 이미지 폴더
const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "vlog2023",
  acl: "public-read",
  // bucket 안에 folder 속에 file 분류하기
  key: function (request, file, ab_callback) {
    const newFileName = Date.now() + "-" + file.originalname;
    const fullPath = "images/" + newFileName;
    ab_callback(null, fullPath);
  },
});

//✅ 비디오 폴더
const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "vlog2023",
  acl: "private",
  // acl: "public-read",
  // bucket 안에 folder 속에 file 분류하기
  key: function (request, file, ab_callback) {
    const newFileName = Date.now() + "-" + file.originalname;
    const fullPath = "videos/" + newFileName;
    ab_callback(null, fullPath);
  },
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Vlog";
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isHeroku = isHeroku; // 👈 local일 때는 url 앞에 /를 추가해 줘야 제대로 작동, 미들웨어에 추가하여 pug에서도 사용
  next();
};

//로그인하지 않은 사용자가 로그인한 유저만 접근할 수 있는 페이지에 접근하는 것 방지하기 위한 미들웨어(에딧, 프로필 페이지)
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "로그인 후 이용하세요.");
    return res.redirect("/login");
  }
};

//로그인하지 않은 사용자만 이용하는 url에 추가할 미들웨어(로그인 페이지, 가입 페이지)
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "승인되지 않은 접근입니다.");
    return res.redirect("/");
  }
};

//local 업로더
export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  //✅ 저장소: 인 경우면 AWS에 있는 vlog2023/images에 업로드 하기,
  //👉 아니면(local이면) 특별한 storage 사용하지 않고 업로드 폴더 사용
  storage: isHeroku ? s3ImageUploader : undefined,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 30000000,
  },
  //✅ 저장소: isHeroku인 경우면 AWS에 있는 vlog2023/videos에 업로드 하기,
  //👉 아니면(local이면) 특별한 storage 사용하지 않고 업로드 폴더 사용
  storage: isHeroku ? s3VideoUploader : undefined,
});
