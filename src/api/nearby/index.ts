import express from "express";
import { searchNearby } from "../../services/nearby.js";
import type { Request, Response } from "express";
import { serverGetImageUrl } from "../../utils/google.js";
import axios, { isAxiosError } from "axios";
import { getAuthUser } from "../../utils/remix.js";
import { nearbyQuerySchema, NearbyResponse } from "../../../common/type/nearby.js";

const router = express.Router();
router.get('/', async (req: Request, res: Response) => {
  try {

    const authenticated = await getAuthUser(req); 

    if (!authenticated) {
      return res.status(401).json({ error: 'Unauthorized' });
    }


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
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.get('/photo', async (req: Request, res: Response) => {
  try {
    const { photoName, size } = req.query;

    if (!photoName || !size) {
      return res.status(400).json({ error: 'Missing photoName or size' });
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
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

export { router as nearbyRouter };