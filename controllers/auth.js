const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");
const { nanoid } = require("nanoid");
const dotenv = require("dotenv");
dotenv.config();

const { User } = require("../models/user");

const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { password, email, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `${email} is already exist`);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const result = await User.create({
    password: hashPassword,
    email,
    subscription,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify Email</a>`
  }

  await sendEmail(verifyEmail);

  res.json({
    email: result.email,
    subscription: result.subscription,
  });
};

const verify = async(req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({verificationToken});
  if (!user) {
    throw HttpError(400, "Not found");
  }
  await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""} );

  res.json({ 
    message: "Verification successful"
  })
}

const resendVerifyEmail = async(req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify Email</a>`
  }

  await sendEmail(verifyEmail);
  res.json({
    message: "Verification email sent"
  })
}

const login = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, {token});
  res.json({
    token,
  });
};

const updateAvatar = async(req, res) => {
  if(!req.file) {
    throw HttpError("401", "Missing avatar in request");
  }
  const { path: tempUpload, originalname } = req.file;
  const { _id } = req.user;
  const extenstion = originalname.split(".").pop();
  const filename = `${_id}_avatar.${extenstion}`;
  const resultUpload = path.join(avatarDir, filename);

  const img = await jimp.read(tempUpload);
  img.resize(250, 250);
  img.rotate(-90);
  await img.writeAsync(tempUpload);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  })
}

const getCurrent = async(req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email: email,
    subscription: subscription,
  });
}

const logout = async(req, res) => {
  await User.findByIdAndUpdate(req.user._id, {token: ""});
  res.json({
    message: "Logout is successful",
  })
}

module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
