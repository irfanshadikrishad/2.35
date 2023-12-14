import chalk from "chalk";
import Blog from "../models/blog-model.js";

const createBlog = async (req, res) => {
  try {
    const { title, body, image, category } = await req.body;
    const blog = new Blog({ title, body, image, category });
    const savedBlog = await blog.save();
    console.log(chalk.cyan(`created ${savedBlog._id}`));
    res.status(201).json({ message: "Blog Posted" });
  } catch (error) {
    console.log(chalk.magenta(`[blog-controller] ${error.message}`));
    res.status(400).json({ message: error.message });
  }
};

export { createBlog };
