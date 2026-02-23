import { NextFunction, Request, Response } from 'express';
import { Prisma } from '../../generated/prisma/client';

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';
  let errorDetails = err;

  // prisma validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = 'You provided invalid data!';
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // record not found
    if (err.code === 'P2025') {
      statusCode = 400;
      errorMessage = 'The requested resource was not found!';
    } else if (err.code === 'P2002') {
      statusCode = 400;
      errorMessage = 'Unique constraint failed!';
    } else if (err.code === 'P2003') {
      statusCode = 400;
      errorMessage = 'Foreign key constraint failed!';
    } else if (err.code === 'P2004') {
      statusCode = 400;
      errorMessage = 'A constraint failed on the database!';
    } else if (err.code === 'P2000') {
      statusCode = 400;
      errorMessage = 'Value too long for column!';
    } else if (err.code === 'P2001') {
      statusCode = 400;
      errorMessage =
        'The record searched for in the where condition does not exist!';
    } else if (err.code === 'P2009') {
      statusCode = 400;
      errorMessage = 'Generated value for a field is too long for the column!';
    } else if (err.code === 'P2011') {
      statusCode = 400;
      errorMessage = 'Null constraint violation!';
    } else if (err.code === 'P2012') {
      statusCode = 400;
      errorMessage = 'Missing a required value!';
    } else if (err.code === 'P2013') {
      statusCode = 400;
      errorMessage =
        'The change you are trying to make would violate the required relation constraint!';
    } else if (err.code === 'P2014') {
      statusCode = 400;
      errorMessage = 'A related record could not be found!';
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = 'An unknown error occurred!';
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === 'P1000') {
      statusCode = 401;
      errorMessage = 'Authentication failed against database server!';
    } else if (err.errorCode === 'P1001') {
      statusCode = 400;
      errorMessage = 'Cannot reach database server!';
    }
  }

  res.status(statusCode);
  res.json({
    error: errorDetails,
    message: errorMessage,
  });
}

export default errorHandler;
