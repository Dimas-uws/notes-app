import express from "express";
import { testConnection } from "./config/db.js";
import helloRouter from "./routes/helloRoute.js";
import noteRoute from "./routes/notesRoute.js";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());

const port = 3000;
//cara menggunakan router
app.use(helloRouter);
app.use(noteRoute);

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
  testConnection();
});
