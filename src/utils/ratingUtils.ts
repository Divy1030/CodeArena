// Rating tier calculation and utilities (matching backend logic)

export interface RatingTier {
  name: string;
  color: string;
  minRating: number;
  maxRating?: number;
  stars?: number;
}

export const RATING_TIERS: RatingTier[] = [
  { name: 'Unrated', color: '#808080', minRating: 0, maxRating: 1199 },
  { name: '1★', color: '#6C757D', minRating: 1200, maxRating: 1399, stars: 1 },
  { name: '2★', color: '#28A745', minRating: 1400, maxRating: 1599, stars: 2 },
  { name: '3★', color: '#17A2B8', minRating: 1600, maxRating: 1799, stars: 3 },
  { name: '4★', color: '#007BFF', minRating: 1800, maxRating: 1999, stars: 4 },
  { name: '5★', color: '#FFC107', minRating: 2000, maxRating: 2199, stars: 5 },
  { name: '6★', color: '#FD7E14', minRating: 2200, maxRating: 2499, stars: 6 },
  { name: '7★ Grandmaster', color: '#DC3545', minRating: 2500, stars: 7 },
];

export function getRatingTier(rating: number = 0): RatingTier {
  for (let i = RATING_TIERS.length - 1; i >= 0; i--) {
    const tier = RATING_TIERS[i];
    if (rating >= tier.minRating) {
      if (tier.maxRating === undefined || rating <= tier.maxRating) {
        return tier;
      }
    }
  }
  return RATING_TIERS[0]; // Default to Unrated
}

export function formatRatingChange(change: number): string {
  if (change > 0) return `+${change}`;
  return change.toString();
}

export function getRatingColor(rating: number): string {
  return getRatingTier(rating).color;
}
