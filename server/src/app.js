import express from "express";
import userRouter from "./routes/user.routes.js";
import listingRouter from "./routes/listing.routes.js";
import reviewRouter from "./routes/review.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
const app = express();

//middlewares
app.use(express.json());

//routes
app.use("/users", userRouter);
app.use("/listings", listingRouter);
app.use("/reviews", reviewRouter);
app.use("/bookings", bookingRouter);
app.use("/wishlist", wishlistRouter);

export default app;