import express from "express"
import productsRouter from "./apis/products/index.js"
import {
  handleBadRequest,
  handleNotFound,
  handleUnauthorized,
  handleServer,
} from "./errorHandlers.js"

const PORT = 3001
const server = express()
server.use(express.json())

server.use("/products", productsRouter)

// error handlers
server.use(handleBadRequest)
server.use(handleNotFound)
server.use(handleUnauthorized)
server.use(handleServer)

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
