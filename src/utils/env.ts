export const getEnv = (variable: string): string => {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Environment variable ${variable} is not set`);
  }
  return value;
};
