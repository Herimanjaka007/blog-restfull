import express from 'express';

import blogsRouter from './routes/blogsRouter.js';
import register from './routes/registerRouter.js';
import login from './routes/login.js';

const app = express();
app.use(express.json());

app.use("/register", register);
app.use("/login", login);
app.use("/blogs", blogsRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT);