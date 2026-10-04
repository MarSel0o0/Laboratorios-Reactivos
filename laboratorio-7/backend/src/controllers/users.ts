import express from "express";
import bcrypt from "bcrypt";
import middleware from "../utils/middleware";
import User from "../models/user";

const router = express.Router();

// TODO (P2): crear un usuario guardando el hash de la contraseña.
router.post("/", middleware.validatePassword, async (request, response) => {
  const { username, email, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    email,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

// TODO (P2): listar los usuarios.
router.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

export default router;
