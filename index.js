process.on("uncaughtException", (err) => {
	console.log(err.name, err.message);
	console.log("UNCAUGHT EXCEPTION ... SHUTTING DOWN..");
	process.exit(1);
});

import { app } from "./src/app.js";

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
	console.log(`app listen at port ${port}`);
});

process.on("unhandledRejection", (err) => {
	console.log(err.name, err.message);
	console.log("UNHANDLED REJUCTION ... SHUTTING DOWN..");
	server.close(() => {
		process.exit(1);
	});
});
