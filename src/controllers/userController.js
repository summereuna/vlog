import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "회원가입" });

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "회원가입";
  //패스워드 체크하기
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "이미 사용 중인 아이디 혹은 이메일입니다.",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "로그인" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "로그인";
  //아에 유저 오브젝트를 가져와서 사용하자.
  const user = await User.findOne({ username, socialOnly: false });
  //로그인에서 입력한 유저네임이 디비에 있는 유저이름이 아니면
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "이 아이디를 가진 계정이 없습니다.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  //유저가 입력한 비번이랑 디비에 있는 비번이 다를 경우
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "비밀번호가 틀렸습니다.",
    });
  }
  //각 유저마다 서로 다른 req.session Object를 가지고 있으니
  //잘 로그인 되었으면, 세션에 로그인한거 맞다고 해주고
  req.session.loggedIn = true;
  //세션 유저에는 DB에서 찾아온 그 user가 맞다고 알려줘서 세션에 정보 추가하기
  req.session.user = user;
  req.flash("info", `${user.name}님 환영합니다!`);
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      req.flash("error", "Github을 이용할 수 없습니다.");
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userData.name ? userData.name : "Unknown",
        avatarUrl: userData.avatar_url,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.flash("info", "Github으로 로그인했습니다!");
    return res.redirect("/");
  } else {
    req.flash("error", "Github을 이용할 수 없습니다.");
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.user = null;
  res.locals.loggedInUser = req.session.user;
  req.session.loggedIn = false;
  req.flash("info", "다음에 또 만나요!");
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("users/edit-profile", {
    pageTitle: "프로필 수정",
  });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  //다른 사용자가 이미 유저네임/이메일 쓰고 있는지 확인하기
  const userExists = await User.exists({
    //$ne 오퍼레이터는
    //{ 필드: { $ne: 값 } } //해당 값과 일치하지 않는 값을 가진 필드를 찾습니다.
    _id: { $ne: _id },
    $or: [{ username }, { email }],
  });
  //이미 사용하고 있는 사용자가 있다면, 에딧페이지에 에러메시지 띄우기
  if (userExists) {
    return res.status(400).render("users/edit-profile", {
      pageTitle: "프로필 수정",
      errorMessage: "이미 사용중인 아이디 혹은 이메일입니다.",
    });
  }

  //🚀 Heroku 사용 중인지 확인하는 변수 추가
  const isHeroku = process.env.NODE_ENV === "production";
  //없다면 계속 진행하여 유저 업데이트 해주기
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl,
      //👉 file이 isHeroku면 file.location 사용하고,
      // file이 localhost면 file.path사용
      //그리고 파일이 없으면 user에 기존 avatarUrl이 있는지 확인
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  req.flash("success", "프로필을 수정하였습니다.");
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("info", "소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다.");
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "비밀번호 변경" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const user = await User.findById(_id);
  //비번 맞는지 확인
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "비밀번호 변경",
      errorMessage: "현재 비밀번호가 틀렸습니다.",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "비밀번호 변경",
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  }
  user.password = newPassword;
  await user.save();
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  const { id } = req.params;
  //double populate
  const user = await User.findById(id)
    .populate({
      path: "videos",
      populate: {
        path: "owner",
        model: "User",
      },
    })
    .populate({
      path: "comments",
      populate: {
        path: "owner",
        model: "User",
      },
    });
  //path는 가장먼저 populate하고 싶은 것은 users.videos 어레이
  //두 번째로 populate하고 싶은 것은 videos.owner
  //비디오 믹신 모양때문에 creator 알아야 해서 받아와야함 ㅇㅇ!
  //owner는 User 모델로 부터 온다.
  if (!user) {
    return res
      .status(404)
      .render("404", { pageTitle: "사용자를 찾을 수 없습니다." });
  }
  return res.render("users/profile", {
    pageTitle: user.name,
    user,
  });
};
