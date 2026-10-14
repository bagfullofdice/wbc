export function abilityModifier(score) { return score <= 6 ? -1 : score >= 15 ? 1 : 0; }
export function ascendingAC(descending) { return 19 - descending; }
export function carriedWeight(items) { return items.reduce((total, item) => total + (['weapon','armor','equipment'].includes(item.type) ? item.system.quantity * item.system.weight : 0), 0); }
