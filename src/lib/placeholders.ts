// ─────────────────────────────────────────────────
// Evida Category Placeholders Helper
// ─────────────────────────────────────────────────

export const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  academic: '/pexels-cottonbro-5989925.jpg',
  career: '/pexels-marwen-larafa-2159807713-37714941.jpg',
  sports: '/pexels-tima-miroshnichenko-5439368.jpg',
  creative: '/pexels-amine-1285347-9371719.jpg',
  food: '/pexels-markus-winkler-1430818-12199407.jpg',
  social: '/pexels-yaroslav-shuraev-8513385.jpg',
  greek: '/pexels-rdne-7648057.jpg',
  default: 'from-indigo-600 via-purple-600 to-pink-600',
};

/**
 * Returns a suitable fallback cover image or gradient for events/promotions
 */
export function getCategoryPlaceholder(category?: string, isPromo?: boolean): string {
  if (isPromo) {
    return CATEGORY_PLACEHOLDERS.food;
  }
  if (!category) return CATEGORY_PLACEHOLDERS.default;
  const cat = category.toLowerCase();

  if (cat.includes('academic') || cat.includes('tutor') || cat.includes('workshop')) {
    return CATEGORY_PLACEHOLDERS.academic;
  }
  if (cat.includes('career') || cat.includes('job') || cat.includes('fair')) {
    return CATEGORY_PLACEHOLDERS.career;
  }
  if (cat.includes('sport') || cat.includes('athlet') || cat.includes('fitness')) {
    return CATEGORY_PLACEHOLDERS.sports;
  }
  if (cat.includes('creative') || cat.includes('art') || cat.includes('music') || cat.includes('photo')) {
    return CATEGORY_PLACEHOLDERS.creative;
  }
  if (cat.includes('food') || cat.includes('bbq') || cat.includes('baking') || cat.includes('market')) {
    return CATEGORY_PLACEHOLDERS.food;
  }
  if (cat.includes('social') || cat.includes('party')) {
    return CATEGORY_PLACEHOLDERS.social;
  }
  if (cat.includes('greek')) {
    return CATEGORY_PLACEHOLDERS.greek;
  }

  return CATEGORY_PLACEHOLDERS.default;
}
