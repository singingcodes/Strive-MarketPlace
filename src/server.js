import express from "express";
import productsRouter from "./apis/products/index.js";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import {
  handleBadRequest,
  handleNotFound,
  handleUnauthorized,
  handleServer,
} from "./errorHandlers.js";
import { join } from "path";

const server = express();

const publicFolderPath = join(process.cwd(), "./public");
console.log(publicFolderPath);

const PORT = 3001;
server.use(express.json());
server.use(express.static(publicFolderPath));

server.use(cors());

server.use("/products", productsRouter);

// error handlers
server.use(handleBadRequest);
server.use(handleNotFound);
server.use(handleUnauthorized);
server.use(handleServer);

server.listen(PORT, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${PORT}`);
});
