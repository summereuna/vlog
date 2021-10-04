import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  //패스워드 체크하기
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
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
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  //아에 유저 오브젝트를 가져와서 사용하자.
  const user = await User.findOne({ username, socialOnly: false });
  //로그인에서 입력한 유저네임이 디비에 있는 유저이름이 아니면
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  //유저가 입력한 비번이랑 디비에 있는 비번이 다를 경우
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password.",
    });
  }
  //각 유저마다 서로 다른 req.session Object를 가지고 있으니
  //잘 로그인 되었으면, 세션에 로그인한거 맞다고 해주고
  req.session.loggedIn = true;
  //세션 유저에는 DB에서 찾아온 그 user가 맞다고 알려줘서 세션에 정보 추가하기
  req.session.user = user;
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
    //2. 중복되니까 apiUrl 앞부분만 떼서 변수로 주고 fetch에서 뒷부분 편하게 사용할 수 있게 변수로 주자.
    const apiUrl = "https://api.github.com";
    //1. 이 부분에서 user의 데이터를 가져오고 있으니까 이름 바꾸자
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    //4.유저데이터는 위에서 불러올수 있으니까 이제 이메일 데이터도 불러와보자
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    //이메일 오브젝트 = 이메일 오브젝트들 중에 프라이머리랑 베리파이드가 트루인 이메일을 찾아라
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      //그런 이베일 오브젝트가 없으면 로그인 화면으로 다시 보내기
      return res.redirect("/login");
    }
    //이 부분에 도착하면 유저데이터/이멜데이터 다 받은 상태
    //이제 DB에 있는 기존 user의 email이 깃헙에서 가져온 유저의 emailObj.email와 같은 user찾기
    let user = await User.findOne({ email: emailObj.email });
    // DB에 같은 이메일 가진 user가 없으면, 유저의 깃헙 정보로 사이트 계정 생성할 수 있게 해주기
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
    // DB에 같은 이메일 가진 user가 있으면 로그인 시켜주쇼 -> 세션에 로그드인 트루/유저 데이터 넣어주기 -> 그리고 나서 홈으로 보내주자
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
    //이제 깃헙으로 로그인 했음!
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("users/edit-profile", {
    pageTitle: "Edit Profile",
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
      pageTitle: "Edit Profile",
      errorMessage: "This username/email is already taken.",
    });
  }
  //없다면 계속 진행하여 유저 업데이트 해주기
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
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
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect.",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation.",
    });
  }
  user.password = newPassword;
  await user.save();
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  const { id } = req.params;
  //double populate
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  console.log(user);
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  return res.render("users/profile", {
    pageTitle: user.name,
    user,
  });
};
