import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, ".env") });

const { default: app } = await import("./src/app.js");
const { connectDB } = await import("./src/db/db.js");

const PORT = process.env.PORT;
connectDB();
app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});