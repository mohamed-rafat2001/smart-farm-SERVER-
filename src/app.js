import express from "express";
import dotenv from "dotenv";

import dbConnect from "./db/dataBase.js";
dotenv.config();
export const app = express();

app.use(express.json());
import userRoute from "./routers/userRoute.js";
import authRouter from "./routers/authRouter.js";
import farmRouter from "./routers/farmRouter.js";
import appError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";

// routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/farm", farmRouter);

//handel unhandel route
app.all("*", (req, res, next) => {
	next(new appError(`can't find ${req.originalUrl} on this server.`, 404));
});

//global error handler
app.use(globalErrorHandler);
dbConnect();
