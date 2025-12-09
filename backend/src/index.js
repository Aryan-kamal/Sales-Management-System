import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import salesRoutes from "./routes/sales.routes.js";
import {connectDB} from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"https://sales-management-system-nine-psi.vercel.app",
		].filter(Boolean),
		credentials: true,
	})
);
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
	res.json({status: "ok"});
});

// Routes
app.use("/api/sales", salesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error("Unhandled error:", err);
	res.status(500).json({
		error: "Internal server error",
		message: err.message,
	});
});

const startServer = async () => {
	try {
		// Connect to MongoDB first
		await connectDB();
		console.log("MongoDB connected");

		// Start server only after DB connection is successful
		app.listen(PORT, () => {
			console.log(`Server listening on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();
