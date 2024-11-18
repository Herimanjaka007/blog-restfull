import express from 'express';
import swaggerUi from "swagger-ui-express";
import multer from 'multer';

import blogsRouter from './routes/blogsRouter.js';
import register from './routes/registerRouter.js';
import login from './routes/login.js';
import swaggerSpec from './swagger.js';

const app = express();
app.use(express.json());

app.get("/", async (req, res) => res.redirect("/docs"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/register", register);
app.use("/login", login);
app.use("/blogs", blogsRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT);