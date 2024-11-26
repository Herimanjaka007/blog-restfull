import express from 'express';
import swaggerUi from "swagger-ui-express";

import blogsRouter from './routes/blogsRouter.js';
import login from './routes/login.js';
import swaggerSpec from './swagger.js';
import usersRouter from './routes/users.js';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => res.redirect("/docs"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/login", login);
app.use("/blogs", blogsRouter);
app.use("/users", usersRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT);