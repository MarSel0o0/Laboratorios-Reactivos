import express from "express";
import bycrypt from "bcrypt";
import User from "../models/user";

const router = express.Router();

// TODO (P2): crear un usuario guardando el hash de la contraseña.
router.post("/", async (request, response) => {
  const { username, email, password } = request.body;

  if (!password || password.length < 3) {
    return response.status(400).json({ error: "Password must be at least 3 characters long" });
  }

  const saltRounds = 10;
  const passwordHash = await bycrypt.hash(password, saltRounds);

  const user = new User({
    username,
    email,
    passwordHash,
  });

  const savedUser = await user.save(); // Express se encargará de manejar los errores de validación y duplicados, gracias al middleware de manejo de errores.

  response.status(201).json(savedUser);

  // TODO (P2): guardar el usuario en la base de datos.
});

// TODO (P2): listar los usuarios.
router.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

export default router;
