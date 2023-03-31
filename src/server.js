import Express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { pgConnect } from "./db.js";
import userRouter from "./api/user/index.js";
import experienceRouter from "./api/experience/index.js";
import postRouter from "./api/post/index.js";
import commentRouter from "./api/post/comments/index.js";

import {
  badRequestErrorHandler,
  genericErrorHandler,
  notFoundErrorHandler,
} from "./errorHandlers.js";

const server = Express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(Express.json());

server.use("/users", userRouter);
server.use("/experiences", experienceRouter);
server.use("/posts", postRouter);
server.use("/posts", commentRouter);

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);

await pgConnect();

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
