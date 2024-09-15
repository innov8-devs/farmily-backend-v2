import { Http } from '../Constants';

export const handleHttpErrorResponse = (error: any) => {
  console.log('the handleHttpErrorResponse called!');
  if (error.extensions && error.extensions.errorName) {
    const { errorName, statusCode, statusMessage } = error.extensions;
    if (
      [
        'ValidationError',
        'ForbiddenError',
        'UnAuthorizedError',
        'NotFoundError',
        'BadRequestError',
        'InternalServerError',
      ].includes(errorName)
    ) {
      return {
        success: false,
        name: errorName,
        status: statusCode,
        code: statusMessage,
        message: error.message.split(', '),
      };
    }
  }

  if (error.toString().includes('E11000')) {
    return {
      success: false,
      name: 'DuplicateError',
      status: Http.httpStatusCodes.CONFLICT,
      code: Http.httpStatusMessages.CONFLICT,
      message: 'The given data is already taken!',
    };
  }

  return {
    success: false,
    name: 'CustomError',
    status: Http.httpStatusCodes.INTERNAL_SERVER_ERROR,
    code: Http.httpStatusMessages.INTERNAL_SERVER_ERROR,
    message: 'An error occurred. Please try again later.',
  };
};
