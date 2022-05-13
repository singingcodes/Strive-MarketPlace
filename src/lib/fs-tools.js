import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const productsJSONPath = join(dataFolderPath, "products.json")

// const productsPublicFolderPath = join(process.cwd(), "./public/img/posts")

export const getProducts = () => readJSON(productsJSONPath)
export const writeProducts = (productsArray) =>
  writeJSON(productsJSONPath, productsArray)

// export const savePostsCovers = (fileName, contentAsBuffer) => {
//   const filePath = join(postsPublicFolderPath, fileName)
//   const savedPath = `/img/posts/${fileName}`
//   console.log(savedPath)
//   writeFile(filePath, contentAsBuffer)
//   const url = `http://localhost:3000${savedPath}`
//   return url
// }
