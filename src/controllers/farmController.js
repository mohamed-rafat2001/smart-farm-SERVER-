import FarmModel from "../models/farm.js";
import {
	CreateByOwner,
	deleteByOwner,
	getAllDocs,
	getByOwner,
	getByParams,
	updateByOwner,
} from "./handlerFactory.js";

// create farm
export const createFarm = CreateByOwner(FarmModel, "name", "location");

// get user farms
export const userFarms = getByOwner(FarmModel);

// delete farm
export const deletefarm = deleteByOwner(FarmModel);

// update farm detales
export const updateFarm = updateByOwner(FarmModel, "name", "location");

// get farm by id params
export const getFarm = getByParams(FarmModel);

// get all users farms
export const usersFarms = getAllDocs(FarmModel);
