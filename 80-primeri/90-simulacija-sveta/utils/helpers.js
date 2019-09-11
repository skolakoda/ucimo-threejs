Array.max = function(array) {
  return Math.max.apply(Math, array)
}

Array.min = function(array) {
  return Math.min.apply(Math, array)
}

/**
 * roll a random positive integer <= n
 * @param n
 * @returns {number}
 */
export function roll(n) {
  return Math.random() * n | 0
}

/**
 * roll a random integer between -n and n
 * @param n
 * @returns {number}
 */
export function rndInt(n) {
  return (Math.random() * n | 0) - n / 2
}