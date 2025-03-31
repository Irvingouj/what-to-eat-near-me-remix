import { Photo } from "../../common/type/nearby.js";

const placesUrl = new URL('https://places.googleapis.com');



export const clientGetImageUrl = (photo: Photo, size: { height: number, width: number } = { height: 400, width: 400 }): string => {
    const url = new URL(import.meta.env.VITE_PUBLIC_APPLICATION_URL);
    url.pathname = '/api/nearby/photo';
    url.searchParams.set('photoName', photo.name);
    url.searchParams.set('size', `${size.height}x${size.width}`);
    return url.toString();
};


export const serverGetImageUrl = (photoName: string, size: string): string => {
    // https://places.googleapis.com/v1/NAME/media?key=API_KEY&maxHeightPx=MAX_HEIGHT&maxWidthPx=MAX_WIDTH
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_MAPS_API_KEY is not set');
    }
    const url = new URL(placesUrl);
    url.pathname = `/v1/${photoName}/media`;
    url.searchParams.set('key', apiKey);
    const [height, width] = size.split('x');
    url.searchParams.set('maxHeightPx', height);
    url.searchParams.set('maxWidthPx', width);
    return url.toString();
};