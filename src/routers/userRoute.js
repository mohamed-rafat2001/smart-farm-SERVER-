import {
	deleteMe,
	getAllUsers,
	getMe,
	getUserById,
	getUserByParams,
	updateMe,
} from "../controllers/userController.js";
import { protect, restrictTo } from "../middelwares/authMiddelware.js";
import express from "express";

const Route = express.Router();

// add protect func to all routes
Route.use(protect);

Route.get("/allUsers", restrictTo("admin"), getAllUsers);
Route.route("/").get(getMe).patch(updateMe).delete(deleteMe).post(getUserById);
Route.get("/:id", getUserByParams);
export default Route;
