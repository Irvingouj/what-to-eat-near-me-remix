import express from "express";
import { searchNearby } from "../../services/nearby.js";
import type { Request, Response } from "express";
import { serverGetImageUrl } from "../../utils/google.js";
import axios, { isAxiosError } from "axios";
import { nearbyQuerySchema, NearbyResponse } from "../../../common/type/nearby.js";
import { handler } from "../../utils/handler.js";
import { ApiError } from "../../../common/errors/error.js";
const router = express.Router();
router.get('/', handler(async (req: Request, res: Response) => {
  // Validate and parse query parameters
  const { latitude, longitude, radius, maxResults, types } = nearbyQuerySchema.parse(req.query);

  // Call the service with validated parameters
  const places = await searchNearby(
    latitude,
    longitude,
    radius,
    {
      maxResults,
      types: types as string[] | undefined
    }
  );

  // Send typed response
  const response: NearbyResponse = { places };

  res.json(response);
}));

router.get('/photo', handler(async (req: Request, res: Response) => {
  try {
    const { photoName, size } = req.query;

    if (!photoName || !size) {
      throw new ApiError('Missing photoName or size', 400);
    }

    const imageUrl = serverGetImageUrl(photoName as string, size as string);

    const response = await axios.get(imageUrl, {
      responseType: 'stream',
    });

    // Copy headers like content-type, etc.
    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');

    // Pipe image stream directly to client
    response.data.pipe(res);
  } catch (error) {
    console.error('Failed to fetch image:', error);
    if (isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data
      });
    }
    throw new ApiError('Failed to fetch image', 500);
  }
}));

export { router as nearbyRouter };