import { AppError } from "@/utils/AppError"
import { ErrorRequestHandler } from "express"
import { ZodError } from "zod"
import { MulterError } from "multer"

export const errorHandling: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message })
    return
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      message: "validation error",
      issues: error.format(),
    })
    return
  }

  if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
    response.status(400).json({ message: "Arquivo excede o tamanho máximo de 3MB." })
    return
  }

  response.status(500).json({ message: error.message })
  return
}
