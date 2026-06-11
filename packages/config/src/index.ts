export const PLANS = {
  FREE: { maxSavedContent: 10, maxDrawings: 3, hdVideo: false },
  PRO: { maxSavedContent: -1, maxDrawings: -1, hdVideo: true, price: { monthly: 9.99, yearly: 89.99 } },
  TEAM: { maxSavedContent: -1, maxDrawings: -1, hdVideo: true, maxMembers: 10, price: { monthly: 49.99, yearly: 499.99 } },
} as const

export const STRIPE_PRICES = {
  PRO: { monthly: 'price_pro_monthly', yearly: 'price_pro_yearly' },
  TEAM: { monthly: 'price_team_monthly', yearly: 'price_team_yearly' },
} as const

export const SET_PIECE_TYPES = [
  { id: 'FREE_KICK', labelAr: 'ركلة حرة', labelEn: 'Free Kick', icon: 'Fingerprint' },
  { id: 'CORNER', labelAr: 'ركلة ركنية', labelEn: 'Corner Kick', icon: 'CornerUpRight' },
  { id: 'PENALTY', labelAr: 'ركلة جزاء', labelEn: 'Penalty', icon: 'Crosshair' },
  { id: 'THROW_IN', labelAr: 'رمية جانبية', labelEn: 'Throw In', icon: 'ArrowUpFromLine' },
  { id: 'GOAL_KICK', labelAr: 'ركلة مرمى', labelEn: 'Goal Kick', icon: 'Goal' },
  { id: 'KICKOFF', labelAr: 'ضربة بداية', labelEn: 'Kickoff', icon: 'Play' },
  { id: 'DEFENSIVE', labelAr: 'دفاع', labelEn: 'Defensive', icon: 'Shield' },
  { id: 'ATTACKING', labelAr: 'هجوم', labelEn: 'Attacking', icon: 'Sword' },
] as const

export const LEVELS = [
  { id: 'BEGINNER', labelAr: 'مبتدئ', labelEn: 'Beginner' },
  { id: 'INTERMEDIATE', labelAr: 'متوسط', labelEn: 'Intermediate' },
  { id: 'ADVANCED', labelAr: 'متقدم', labelEn: 'Advanced' },
] as const

export const canAccess = (
  content: { isPremium: boolean },
  user: { subscription: string } | null
): boolean => {
  if (!content.isPremium) return true
  return user?.subscription === 'PRO' || user?.subscription === 'TEAM'
}
