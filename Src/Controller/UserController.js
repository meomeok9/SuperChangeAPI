const User = require("../Model/User");
const bcrypt = require("bcryptjs");

module.exports.login = async (req, res, next) => {
  const { email, password, role } = req.body;
  //   console.log("#1 request body : ", req.body);

  //   console.log(`${email} --- ${password}`);
  //const { email, password } = req.body;

  try {
    const exitsUser = await User.findOne({ email });
    if (!exitsUser)
      return res
        .status(401)
        .json({ message: "USER NOT FOUND", isLoggIn: false });
    else {
      bcrypt
        .compare(password, exitsUser.password)
        .then((isMatch) => {
          if (isMatch) {
            return res
              .status(200)
              .json({ message: "SUCCESS to LOGIN", isLoggIn: true });
          } else
            return res
              .status(401)
              .json({ message: "PASSWORD NOT CORRECT", isLoggIn: false });
        })
        .catch((err) =>
          res.status(403).json({ message: "Some thing wrong", isLoggIn: false })
        );
    }
  } catch (err) {}
};
module.exports.getRegister = async (req, res, next) => {
  try {
    const allUser = await User.find();
    return res.status(200).render("add-new-user", {
      users: allUser,
      alertSucess: false,
      arlerFail: false,
    });
  } catch (err) {}
};

module.exports.postRegister = async (req, res, next) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPw = req.body.confirmPw;
  const address = req.body.address;
  const user = { fullName, email, password, address };
  try {
    user.password = await bcrypt.hash(user.password, 12);

    const existUser = await User.find({ email: user.email });
    if (existUser.length !== 0) {
      return res.status(400).redirect("/add-new-user");
    } else {
      const newUser = new User(user);
      await newUser.save();
      return res.status(200).redirect("/add-new-user");
    }
  } catch (err) {}
};
module.exports.postDeleteUser = (req, res, next) => {
  const userId = req.body.userId;

  User.findByIdAndRemove(userId)
    .then(() => {
      return res.status(200).redirect("/add-new-user");
    })
    .catch((err) => {
      return res.status(200).redirect("/add-new-user");
    });
};
