// test/testApp.js
import "express-async-errors";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import authRoutes from "../server/routes/auth.routes.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount only auth routes for testing
app.use("/auth", authRoutes);

export default app;
