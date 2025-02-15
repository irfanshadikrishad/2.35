import chalk from "chalk";
import Author from "../models/auth-model.js";
import pkg from "bcryptjs";
import { config } from "dotenv";
import Blog from "../models/blog-model.js";

config();
const { genSalt, hash, compare } = pkg;

const register = async (req, res) => {
  try {
    const { name, email, username, password } = await req.body;
    const isRegisteredEmail = await Author.findOne({ email: email });
    const isUsedUsername = await Author.findOne({ username: username });
    if (isRegisteredEmail || isUsedUsername) {
      res.status(403).json({ message: "User already exists!" });
    } else {
      genSalt(Number(process.env.SALT), function (err, salt) {
        hash(password, salt, function (err, hashedPassword) {
          const user = new Author({
            name,
            email,
            username,
            password: hashedPassword,
          });
          const author = user.save();
          res.status(201).json({
            registered: author._id,
            token: user.genJWT(),
            id: user._id,
          });
        });
      });
    }
  } catch (error) {
    console.log(chalk.magenta(`[controller] ${error.message}`));
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = await req.body;
    const author = await Author.findOne({ email: email });
    if (!author) {
      res.status(404).json({ message: "Invalid Credentials!" });
    } else {
      compare(password, author.password, function (err, isValid) {
        if (isValid) {
          res.status(200).json({
            id: author._id.toString(),
            email: author.email,
            token: author.genJWT(),
          });
        } else {
          res.status(404).json({ message: "Invalid Credentials!" });
        }
      });
    }
  } catch (error) {
    console.log(chalk.magenta(`[controller-306] ${error.message}`));
    res.status(403).json({ message: error.message });
  }
};

const user = async (req, res) => {
  try {
    const user = await req.user;
    const userBlogs = await Blog.find({ author: user._id }).populate("author");
    const modifiedUser = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      blogs: userBlogs,
    };
    res.status(200).json(modifiedUser);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const { id, username, avatar, email, name } = await req.body;
    // need to verify if username or email exist's to be changed to
    const update = await Author.findByIdAndUpdate(id, {
      username,
      avatar,
      email,
      name,
    });
    res.status(200).json({ message: "Profle updated" });
  } catch (error) {
    console.log(chalk.magenta(`[editUser] ${error.message}`));
    res.status(401).json({ message: error.message });
  }
};

export default register;
export { login, user, editUser };
