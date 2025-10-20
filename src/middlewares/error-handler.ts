import { Prisma } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import JsonResponse from '../utils/json-response'
import logger from '../utils/logger'

interface ErrorType extends Error {
  statusCode?: number
  code?: string
  details?: { message: string }[]
}

const getErrorResponse = (err: ErrorType) => {
  const types: Record<string, { statusCode: number; message: string }> = {
    JsonWebTokenError: {
      statusCode: 403,
      message: 'invalid token',
    },
    TokenExpiredError: {
      statusCode: 403,
      message: 'token expired',
    },
    HttpError: {
      statusCode: err.statusCode || 400,
      message: err.message,
    },
    default: {
      statusCode: err.statusCode || 500,
      message: 'internal server error',
    },
  }

  return types[err.name] || types['default']
}

const getZodErrorMessage = (error: ZodError): string => {
  const errors = error.issues.map(issue => {
    return `${issue.path.join('.')}: ${issue.message}`
  })

  return errors.join(', ')
}

const getZodErrorResponse = (err: ZodError) => {
  return {
    statusCode: 400,
    message: getZodErrorMessage(err),
  }
}

const getPrismaErrorResponse = (err: Prisma.PrismaClientKnownRequestError) => {
  switch (err.code) {
    case 'P2002':
      return {
        statusCode: 409,
        message: 'A record with this value already exists',
      }
    case 'P2025':
      return {
        statusCode: 404,
        message: 'Record not found',
      }
    case 'P2003':
      return {
        statusCode: 400,
        message: 'Related record not found',
      }
    case 'P2014':
      return {
        statusCode: 400,
        message: 'Invalid ID provided',
      }
    default:
      return {
        statusCode: 500,
        message: 'Database error occurred',
      }
  }
}

const errorHandler = (
  err:
    | ErrorType
    | ZodError
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientValidationError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Logging
  if (err instanceof ZodError) {
    logger.error('Validation Error ->', getZodErrorMessage(err))
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error('Prisma Error ->', err.message)
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error('Prisma Validation Error ->', err.message)
  } else {
    logger.error('Error ->', err.message)
  }

  let statusCode: number
  let message: string

  // Handle different error types
  if (err instanceof ZodError) {
    const response = getZodErrorResponse(err)
    statusCode = response.statusCode
    message = response.message
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const response = getPrismaErrorResponse(err)
    statusCode = response.statusCode
    message = response.message
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400
    message = 'Validation error occurred'
  } else {
    const response = getErrorResponse(err as ErrorType)
    statusCode = response.statusCode
    message = response.message
  }

  res.status(statusCode).json(new JsonResponse({ status: 'error', message }))
}

export default errorHandler
