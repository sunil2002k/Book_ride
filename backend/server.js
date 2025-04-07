import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import { initializeSocket } from "./socket.js"; // Corrected import

const port = process.env.PORT || 3000;
const server = http.createServer(app);

initializeSocket(server); // Call the function

server.listen(port, () => {
  console.log(`server is running on ${port}`);
});