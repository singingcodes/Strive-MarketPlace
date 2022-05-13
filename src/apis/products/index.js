import express from "express"
import {
  checkProductSchema,
  checkProductValidationResult,
  checkReviewSchema,
} from "./productValidation.js"
import createError from "http-errors"
import uniqid from "uniqid"
import multer from "multer"
import {
  getProducts,
  writeProducts,
  saveProductsImageUrl,
} from "../../lib/fs-tools.js"

const productsRouter = express.Router()
//get all products
productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getProducts()
    if (req.query && req.query.category) {
      const filteredProducts = products.filter((product) =>
        product.category
          .toLowerCase()
          .includes(req.query.category.toLowerCase())
      )
      res.send(filteredProducts)
    } else {
      res.send(products)
    }
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

//product's image upload (POST /product/:id/upload)
productsRouter.post(
  "/:productId/upload",
  multer({
    fileFilter: (req, file, multerNext) => {
      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
        multerNext(createError(400, "Only png/jpeg allowed!"))
      } else {
        multerNext(null, true)
      }
    },
    limits: { fileSize: 1024 * 1024 * 5 },
  }).single("imageUrl"),
  async (req, res, next) => {
    try {
      const products = await getProducts()
      const product = products.findIndex(
        (product) => product.id === req.params.productId
      )
      const url = await saveProductsImageUrl(
        req.file.originalname,
        req.file.buffer
      )
      if (product !== -1) {
        const oldProduct = products[product]
        const newProduct = {
          ...oldProduct,
          imageUrl: url,
          updatedAt: new Date(),
        }
        products[product] = newProduct
        await writeProducts(products)
        res.send(newProduct)
      } else {
        next(createError(404, "Post not found"))
      }
    } catch (error) {
      next(error)
    }
  }
)

//GET list of  Reviews /products/:productId/reviews/
productsRouter.get("/:productId/reviews", async (req, res, next) => {
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
      res.send(productFound.reviews)
    }
  } catch (err) {
    next(err)
  }
})
//GET single Review /products/:productId/reviews/:reviewId
productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
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
      const reviewFound = productFound.reviews.find(
        (review) => review.id === req.params.reviewId
      )
      if (!reviewFound) {
        next(
          createError(404, `review with id ${req.params.reviewId} not found`)
        )
      } else {
        res.send(reviewFound)
      }
    }
  } catch (err) {
    next(err)
  }
})

//POST create Review /products/:productId/reviews/
productsRouter.post(
  "/:productId/reviews",
  checkReviewSchema,
  checkProductValidationResult,
  async (req, res, next) => {
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
        const newReview = {
          ...req.body,
          id: uniqid(),
          createdAt: new Date(),
        }
        productFound.reviews.push(newReview)
        await writeProducts(products)
        res.send(newReview)
      }
    } catch (err) {
      next(err)
    }
  }
)
//PUT update Review /products/:productId/reviews/:reviewId
productsRouter.put(
  "/:productId/reviews/:reviewId",
  checkReviewSchema,
  checkProductValidationResult,
  async (req, res, next) => {
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
        const reviewIndex = productFound.reviews.findIndex(
          (review) => review.id === req.params.reviewId
        )
        if (reviewIndex === -1) {
          next(
            createError(404, `review with id ${req.params.reviewId} not found`)
          )
        } else {
          const updatedReview = {
            ...productFound.reviews[reviewIndex],
            ...req.body,
            updatedAt: new Date(),
          }
          productFound.reviews[reviewIndex] = updatedReview
          await writeProducts(products)
          res.send(updatedReview)
        }
      }
    } catch (err) {
      next(err)
    }
  }
)
//DELETE delete Review /products/:productId/reviews/:reviewId
productsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
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
        const reviewIndex = productFound.reviews.findIndex(
          (review) => review.id === req.params.reviewId
        )
        if (reviewIndex === -1) {
          next(
            createError(404, `review with id ${req.params.reviewId} not found`)
          )
        } else {
          productFound.reviews.splice(reviewIndex, 1)
          await writeProducts(products)
          res.send({
            status: "success",
            message: `review with id ${req.params.reviewId} deleted`,
            success: true,
          })
        }
      }
    } catch (err) {
      next(err)
    }
  }
)

export default productsRouter
