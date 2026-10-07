import express from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../utils/config";
import { withUser } from "../utils/middleware";

const router = express.Router();

// TODO (P3): login con el JWT en una cookie httpOnly y el token CSRF en un header.
router.post("/", withUser , async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;
    
  if (!user || !passwordCorrect) {
    return response.status(401).json({
       error: "invalid username or password" 
    });
  }

  const userForToken = {
    username: user.username,
    csrf: crypto.randomUUID(),
    id: user._id.toString(),
  };

  const token = jwt.sign(userForToken, config.JWT_SECRET, {
     expiresIn: 60 * 60, // 1 hora 
  });

  response.setHeader("X-CSRF-Token", userForToken.csrf);
  response.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  response.status(200).send({ username: user.username });
});

// TODO (P4): usuario de la sesión actual (protegido con withUser).
router.get("/me", withUser, async (request, response) => {
  const user = await User.findById(request.userId);
  response.status(200).json(user);
});

// TODO (P4): cerrar sesión.
router.post("/logout", async (request, response) => {
  response.clearCookie("token");
  response.status(200).send({ message: "Logged out successfully" });
});

export default router;
