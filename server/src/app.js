import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import listingRouter from "./routes/listing.routes.js";
import reviewRouter from "./routes/review.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
const app = express();

//cors
app.use(cors());

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes
app.use("/api/users", userRouter);
app.use("/api/listings", listingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/wishlist", wishlistRouter);

export default app;