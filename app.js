import express from 'express';

import blogsRouter from './routes/blogsRouter.js';
import register from './routes/registerRouter.js';

const app = express();
app.use(express.json());


app.use("/blogs", blogsRouter);
app.use("/register", register);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT);