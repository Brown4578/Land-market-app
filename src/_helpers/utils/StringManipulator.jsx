export const convertToLowerThenCapitalize = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word[0]?.toUpperCase() + word.slice(1);
    })
    .join(' ');
};

export function convertToUppercaseThenReplaceWhiteSpacesWithUnderScore(text) {
  if (!text) return;

  // Capitalize all characters and replace whitespaces with underscores
  // Trim the string, capitalize all characters, and replace consecutive whitespaces with a single underscore
  const formattedRole = text.trim().toUpperCase().replace(/\s+/g, '_');
  return formattedRole;
}

export function addSpacesToCamelCase(text) {
  if (!text) return;
  // Use a regular expression to add a space before each uppercase letter
  const spacedText = text.replace(/([A-Z])/g, ' $1');

  // Convert the first letter to uppercase

  const spacedTextFinal =
    spacedText.charAt(0).toUpperCase() + spacedText.slice(1);
  return formatText(spacedTextFinal);
}

function formatText(text) {
  if (!text) return;
  // Remove underscores and split the string into an array of words
  const words = text.split('_');

  // Capitalize the first letter of each word
  const formattedText = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return formattedText;
}

export function generateColor(type) {
  if (!type) return;
  let seed = djb2Hash(type);

  const random = () =>
    Math.floor(Math.abs(Math.sin(seed++) * 16777215)).toString(16);

  let color = `#${random()}`;

  // Ensure the color has a darker brightness than 200 (adjust as needed)
  while (colorBrightness(color) > 200) {
    color = `#${random()}`;
  }

  return color.padStart(6, '0'); // Ensure the color has 6 digits
}

// Function to calculate color brightness (YIQ formula)
function colorBrightness(hex) {
  if (!hex) return;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // YIQ brightness formula
  return (r * 299 + g * 587 + b * 114) / 1000;
}

function djb2Hash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0; // Ensure non-negative integer
}
export const CapitalizeFirstLetterAndEachAfterWhitespace = (data) => {
  let combined_string = data;
  if (data) {
    data = data.toLocaleLowerCase();
    combined_string = data
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return combined_string;
};