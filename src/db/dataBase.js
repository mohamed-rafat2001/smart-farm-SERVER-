import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbUrl = process.env.DB_URL.replace(
	"<db_password>",
	process.env.DB_PASSWORD
);
export default function dbConnect() {
	mongoose.connect(dbUrl).then(() => console.log("db is connected"));
}
