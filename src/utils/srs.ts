// src/utils/srs.ts

type Rating = 'forgot' | 'hard' | 'good' | 'easy';

export function calculateNextReview(
  rating: Rating,
  currentEase: number,
  currentInterval: number,
  currentReviewCount: number
): {
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: Date;
  reviewCount: number;
} {
  let ease = currentEase;
  let interval = currentInterval;
  let reviewCount = currentReviewCount;

  if (rating === 'forgot') {
    ease = Math.max(1.3, ease - 0.20);
    interval = 1;
    reviewCount = 0;
  } else if (rating === 'hard') {
    ease = Math.max(1.3, ease - 0.15);
    interval = Math.max(1, Math.round(interval * 1.2));
    reviewCount += 1;
  } else if (rating === 'good') {
    interval = Math.max(1, Math.round(interval === 0 ? 1 : interval * ease));
    reviewCount += 1;
  } else if (rating === 'easy') {
    ease = Math.min(5.0, ease + 0.15);
    interval = Math.max(1, Math.round(interval === 0 ? 1 : interval * ease * 1.3));
    reviewCount += 1;
  }

  ease = Math.min(5.0, Math.max(1.3, ease));

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);
  nextDate.setHours(7, 0, 0, 0); // always 7:00 AM

  return {
    easeFactor: ease,
    intervalDays: interval,
    nextReviewAt: nextDate,
    reviewCount,
  };
}
