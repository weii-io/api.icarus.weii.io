export const tokenIsExpired = (exp: number) => {
  if (exp > Date.now() / 1000) {
    return false;
  }
  return true;
};
