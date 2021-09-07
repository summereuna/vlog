import User from "../models/User";
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
  const user = await User.findOne({ username });
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

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
