import express from "express";
import { protect } from "../middelwares/authMiddelware.js";
import {
	createFarm,
	deletefarm,
	getFarm,
	updateFarm,
	userFarms,
} from "../controllers/farmController.js";

const Router = express.Router();

// add protect func to all routes
Router.use(protect);

Router.route("/")
	.post(createFarm)
	.get(userFarms)
	.delete(deletefarm)
	.patch(updateFarm);
Router.get("/:id", getFarm);
export default Router;
