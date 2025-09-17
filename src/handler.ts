import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { calculateBusinessDate } from './services/date.service';
import { ErrorResponse, SuccessResponse } from './types';

const generateErrorResponse = (statusCode: number, error: string, message: string): APIGatewayProxyResult => {
  const errorResponse: ErrorResponse = { error, message };
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorResponse),
  };
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const params = event.queryStringParameters || {};
    const { days, hours, date } = params;

    const numDays = days ? parseInt(days, 10) : 0;
    const numHours = hours ? parseInt(hours, 10) : 0;

    if (!days && !hours) {
      return generateErrorResponse(400, 'InvalidParameters', 'At least one of "days" or "hours" must be provided.');
    }
    if (isNaN(numDays) || isNaN(numHours) || numDays < 0 || numHours < 0) {
      return generateErrorResponse(400, 'InvalidParameters', '"days" and "hours" must be positive integers.');
    }
    if (date && isNaN(Date.parse(date))) {
      return generateErrorResponse(400, 'InvalidParameters', '"date" must be a valid ISO 8601 string.');
    }

    const finalDateISO = await calculateBusinessDate(numDays, numHours, date);
    
    const successResponse: SuccessResponse = { date: finalDateISO };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(successResponse),
    };

  } catch (error) {
    console.error('Internal Server Error:', error);
    return generateErrorResponse(503, 'InternalServerError', 'An unexpected error occurred while calculating the date.');
  }
};