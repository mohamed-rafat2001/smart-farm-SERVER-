import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./db/dataBase.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
dotenv.config();
export const app = express();

app.use(cors());
// set security HTTP headers.
app.use(helmet());

//limit requests from same API
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "too many requests for this IP, Please try again in an hour ",
});
app.use("/api", limiter);

// body pareser, reading date from body into req.body
app.use(express.json({ limit: "10kb" }));

// from cookie
app.use(cookieParser());
//Data sanitization against noSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(hpp());
// Routers
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
