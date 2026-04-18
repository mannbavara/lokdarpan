import { FeaturedRepresentative, FeaturedRepresentativesResponse } from '../types/representative';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

/**
 * Fetch featured politicians for the landing page.
 * This is a public endpoint — no authentication required.
 */
export async function fetchFeaturedRepresentatives(): Promise<FeaturedRepresentative[]> {
  const url = `${API_BASE_URL}/landing/featured-representatives`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch featured representatives: ${response.status} ${response.statusText}`);
  }

  const json: FeaturedRepresentativesResponse = await response.json();
  return json.data;
}
