import express from "express"
import productsRouter from "./apis/products/index.js"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import {
  handleBadRequest,
  handleNotFound,
  handleUnauthorized,
  handleServer,
} from "./errorHandlers.js"

const PORT = 3001
const server = express()
server.use(express.json())
server.use(cors())

server.use("/products", productsRouter)

// error handlers
server.use(handleBadRequest)
server.use(handleNotFound)
server.use(handleUnauthorized)
server.use(handleServer)

server.listen(PORT, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${PORT}`)
})
