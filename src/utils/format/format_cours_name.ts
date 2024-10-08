const lesson_formats = require("../data/lesson_formats.json");

String.prototype.uppercaseFirst = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function removeSpaces (text) {
  return text.replace(/\s+/g, "");
}

function findObjectByPronoteString (pronoteString = "") {
  // Process the input string: replace dots and underscores with spaces, trim, and convert to lowercase
  let processedString = pronoteString
    .replace(/[,._]/g, " ")
    .trim()
    .toLowerCase();

  // remove everything after > (included)
  processedString = processedString.split(">")[0].trim();

  // remove LV1, LV2, etc.
  processedString = processedString.replace(/lv\d/g, "").trim();

  // remove everything in parentheses
  processedString = processedString.replace(/\(.*\)/g, "").trim();

  // normalize accents
  processedString = processedString
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // remove special characters
  processedString = processedString.replace(/[^a-zA-Z0-9 ]/g, " ").trim();

  // remove multiple spaces into one
  processedString = processedString.replace(/\s+/g, " ");

  // Search for the object in the data
  for (let item of lesson_formats) {
    for (let format of item.formats.default) {
      if (format.toLowerCase() === processedString) {
        return item;
      }
    }
  }

  // Return null if no match is found
  return {
    label: removeSpaces(processedString),
    pretty: processedString.uppercaseFirst(),
    formats: {}
  };
}

function getCourseSpeciality (pronoteString = "") {
  let speciality = "";
  if (!pronoteString.includes(">")) {
    return null;
  }

  let newPrnString = pronoteString.split(">").pop().trim().toLowerCase();
  newPrnString = newPrnString.replace("expression", "expr.");
  newPrnString = newPrnString.replace("compréhension", "comp.");
  newPrnString = newPrnString.replace("ecrit", "écrit");
  newPrnString = newPrnString.uppercaseFirst();

  return newPrnString;
}

export default findObjectByPronoteString;
export { getCourseSpeciality };