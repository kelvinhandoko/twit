export const getFallbackName = (name?: string) => {
  if (!name) return "AB";

  const nameParts = name.split(" ");

  if (nameParts.length && nameParts.length >= 2) {
    // If there are two or more words, take the first character of the first two words
    return `${nameParts[0]?.[0]}${nameParts[1]?.[0]}`.toUpperCase();
  } else {
    // If there's only one word, take the first two characters
    return nameParts[0]?.substring(0, 2).toUpperCase();
  }
};
