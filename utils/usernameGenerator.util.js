import { v4 as uuidv4 } from "uuid";

export const generateUniqueUsername = (displayName) => {
  const baseName = displayName.toLowerCase().replace(/ /g, "_");

  const uniqueUsername = `${baseName}_${uuidv4()}`;

  return uniqueUsername;
};
