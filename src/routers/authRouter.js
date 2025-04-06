import {
	forgotPassord,
	resetPassword,
	login,
	signUp,
	updatePassword,
} from "../controllers/authController.js";
import { protect } from "../middelwares/authMiddelware.js";

import express from "express";
const Route = express.Router();

Route.post("/signUp", signUp);
Route.post("/login", login);
Route.post("/forgotPassword", forgotPassord);
Route.post("/resetPassword/:token", resetPassword);
Route.patch("/updatePassword", protect, updatePassword);

export default Route;
