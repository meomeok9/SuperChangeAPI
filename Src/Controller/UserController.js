const User = require("../Model/User");
const bcrypt = require("bcryptjs");

module.exports.login = async (req, res, next) => {
  const { email, password, role, isBackEndLogin } = req.body;
  const isBackEnd = isBackEndLogin === "true";
  try {
    const exitsUser = await User.findOne({ email });
    if (!exitsUser) {
      if (!isBackEnd)
        return res
          .status(401)
          .json({ message: "USER NOT FOUND", isLoggIn: false });
      else return res.status(400).redirect("/add-new-user");
    } else {
      bcrypt
        .compare(password, exitsUser.password)
        .then((isMatch) => {
          if (isMatch) {
            if (!isBackEnd) {
              req.session.isLoggIn = true;
              req.session.user = exitsUser;
              req.session.save((err) => {
                if (err) console.log(err);
                return res.status(200).json({
                  message: "Admin SUCCESS to LOGIN",
                  isAdmin: true,
                  isLoggIn: true,
                });
              });
            } else {
              if (exitsUser.role === "admin") {
                req.session.isLoggIn = true;
                req.session.user = exitsUser;
                req.session.save((err) => {
                  if (err) console.log(err);
                  return res.status(200).redirect("/add-new-user");
                });
              } else {
                console.log("#43 here");
                return res.status(200).redirect("/add-new-user");
              }
            }
          } else
            return res
              .status(401)
              .json({ message: "PASSWORD NOT CORRECT", isLoggIn: false });
        })
        .catch((err) =>
          res
            .status(403)
            .json({ message: "Some thing wrong", isLoggIn: false })
        );
    }
  } catch (err) {}
};

module.exports.getAddNewUser = async (req, res, next) => {
  try {
    if (!req.session.isLoggIn) {
      return res.status(200).render("add-new-user", {
        users: [],
        userName: null,
        isLoggIn: false,
        role: null,
      });
    } else {
      let allUser = await User.find();

      return res.status(200).render("add-new-user", {
        users: allUser,
        userName: req.session.user.fullName,
        isLoggIn: true,
        role: req.session.user.role,
      });
    }
  } catch (err) {}
};

module.exports.postRegister = async (req, res, next) => {
  const fullName = req.body.fullName;
  const email = req.body.email2;
  const password = req.body.password2;
  const confirmPw = req.body.cfPassword;
  const address = req.body.address;
  const phoneNunber = req.body.phoneNunber;
  const activeDate = req.body.activeDate;
  const expirateDate = req.body.expirateDate;
  const role = "user";
  const user = {
    fullName,
    email,
    password,
    address,
    phoneNunber,
    activeDate,
    expirateDate,
    role,
  };
  const isBackEnd = req.body.isBackEnd === "true";
  if (password !== confirmPw) return res.status(400).redirect("/add-new-user");
  try {
    user.password = await bcrypt.hash(user.password, 12);
    const existUser = await User.find({ email: user.email });
    if (existUser.length !== 0) {
      const allUser = await User.find();
      if (isBackEnd) return res.status(400).redirect("/add-new-user");
      else
        res
          .status(400)
          .json({ message: "Fail to add new one", results: allUser });
    } else {
      const newUser = new User(user);
      await newUser.save();
      const allUser = await User.find();
      if (isBackEnd) return res.status(200).redirect("/add-new-user");
      else
        return res
          .status(200)
          .json({ message: "Success to add new User", results: allUser });
    }
  } catch (err) {}
};

module.exports.postDeleteUser = async (req, res, next) => {
  const userId = req.body.userId;
  const isBackEnd = req.body.isBackEnd === "true";
  let allUser;
  if (isBackEnd) allUser = await User.find();
  User.findByIdAndRemove(userId)
    .then(() => {
      return isBackEnd
        ? res.status(200).redirect("/add-new-user")
        : res.status(200).json({ message: "Deleted !", results: allUser });
    })
    .catch((err) => {
      return isBackEnd
        ? res.status(200).redirect("/add-new-user")
        : res
            .status(200)
            .json({ message: "Fail to delete!", results: allUser });
    });
};

module.exports.logout = (req, res) => {
  req.session.destroy();
  const isBackEnd = req.body.isBackEndLogout === "true";
  if (!isBackEnd) return res.status(200).json({ message: "SUCCESS" });
  else {
    return res.status(200).redirect("/");
  }
};
