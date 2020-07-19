function preprocessPastedText(text) {
  const noReturnChars = text.replace(/(\r\n|\n|\r)/gm, '');
  // code for converting spaces to hythons
  // const spacesToHythons = noReturnChars.replace(/\s/g, '-');
  return noReturnChars;
}

function preprocessLabelText(text) {
  return text.trim();
}

export { preprocessPastedText, preprocessLabelText };
