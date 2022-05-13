import express from "express"
import {
  checkProductSchema,
  checkProductValidationResult,
} from "./productValidation.js"
import createError from "http-errors"
import uniqid from "uniqid"
import { getProducts, writeProducts } from "../../lib/fs-tools.js"

const productsRouter = express.Router()
//get all products
productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getProducts()
    res.send(products)
  } catch (err) {
    next(err)
  }
})

//get one product
productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts()
    const productFound = products.find(
      (product) => product.id === req.params.productId
    )
    if (!productFound) {
      next(
        createError(404, `product with id ${req.params.productId} not found`)
      )
    } else {
      res.send(productFound)
    }
  } catch (err) {
    next(err)
  }
})

//create product
productsRouter.post(
  "/",
  checkProductSchema,
  checkProductValidationResult,
  async (req, res, next) => {
    try {
      const products = await getProducts()
      const newProduct = {
        ...req.body,
        id: uniqid(),
        createdAt: new Date(),
      }
      products.push(newProduct)
      await writeProducts(products)
      res.send(newProduct)
    } catch (err) {
      next(err)
    }
  }
)

//update product
productsRouter.put(
  "/:productId",
  checkProductSchema,
  checkProductValidationResult,
  async (req, res, next) => {
    try {
      const products = await getProducts()
      const productIndex = products.findIndex(
        (product) => product.id === req.params.productId
      )
      if (productIndex === -1) {
        next(
          createError(404, `product with id ${req.params.productId} not found`)
        )
      } else {
        const updatedProduct = {
          ...products[productIndex],
          ...req.body,
          updatedAt: new Date(),
        }
        products[productIndex] = updatedProduct
        await writeProducts(products)
        res.send(updatedProduct)
      }
    } catch (err) {
      next(err)
    }
  }
)

//delete product
productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts()
    const remainingProducts = products.filter(
      (product) => product.id !== req.params.productId
    )
    await writeProducts(remainingProducts)
    res.send({
      status: "success",
      message: `product with id ${req.params.productId} deleted`,
      success: true,
    })
  } catch (err) {
    next(err)
  }
})
export default productsRouter
