import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const productsJSONPath = join(dataFolderPath, "products.json")

const productsPublicFolderPath = join(process.cwd(), "./public/img/products")

export const getProducts = () => readJSON(productsJSONPath)
export const writeProducts = (productsArray) =>
  writeJSON(productsJSONPath, productsArray)

export const saveProductsImageUrl = (fileName, contentAsBuffer) => {
  const filePath = join(productsPublicFolderPath, fileName)
  const savedPath = `/img/products/${fileName}`
  console.log(savedPath)
  writeFile(filePath, contentAsBuffer)
  const url = `http://localhost:3001${savedPath}`
  return url
}
