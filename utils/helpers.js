/* including min, not including max */
export function randomInRange(min, max, round = false) {
  const rand = Math.random() * (max - min) + min
  return round ? Math.floor(rand) : rand
}
