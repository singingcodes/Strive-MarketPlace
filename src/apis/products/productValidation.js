import { checkSchema, validationResult } from "express-validator"
import createError from "http-errors"

const productSchema = {
  name: {
    in: ["body"],
    isString: { errorMessage: "name is required" },
  },
  description: {
    in: ["body"],
    isString: { errorMessage: "description is required" },
  },

  "reviews.rate": {
    in: ["body"],
  },
  "reviews.comment": {
    in: ["body"],
  },

  brand: {
    in: ["body"],
    isString: { errorMessage: "Brand is required" },
  },
  category: {
    in: ["body"],
    isString: { errorMessage: "category is required" },
  },

  price: {
    in: ["body"],
    isInt: { errorMessage: "Price is required" },
  },
}

const reviewSchema = {
  comment: {
    in: ["body"],
    isString: { errorMessage: "comment is required" },
  },
  rate: {
    in: ["body"],
    isInt: { errorMessage: "rating is required" },
  },
}

export const checkReviewSchema = checkSchema(reviewSchema)

export const checkProductSchema = checkSchema(productSchema)
export const checkProductValidationResult = (req, res, next) => {
  const errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    next(createError(400, "validation errors", { errorsList: errors.array() }))
  } else {
    next()
  }
}
