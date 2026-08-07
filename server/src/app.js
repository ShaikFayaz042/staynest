import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import listingRouter from "./routes/listing.routes.js";
import reviewRouter from "./routes/review.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import imageKitRouter from "./routes/imagekit.routes.js";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/listings", listingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/imagekit", imageKitRouter);

export default app;