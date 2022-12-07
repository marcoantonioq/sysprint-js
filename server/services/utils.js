/**
 * Pause
 * @param {Int} ms Ms
 * @returns Promise
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
