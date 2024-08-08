import express from "express";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // allow json
app.use(cookieParser()); // allow cookies

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port:", PORT);
});

app.use("/api/auth", authRoutes); // auth routes
