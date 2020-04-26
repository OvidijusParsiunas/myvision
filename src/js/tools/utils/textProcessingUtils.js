function preprocessPastedText(text) {
  const noReturnChars = text.replace(/(\r\n|\n|\r)/gm, '');
  // code for converting spaces to hythons
  // const spacesToHythons = noReturnChars.replace(/\s/g, '-');
  return noReturnChars;
}

export { preprocessPastedText as default };
