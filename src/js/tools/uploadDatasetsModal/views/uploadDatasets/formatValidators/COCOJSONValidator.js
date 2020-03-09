
function showError(fileName, errorMessage) {
  console.error(`${fileName} validation failure. Reason: ${errorMessage}`);
}

function nextFunction() {
  return true;
}

function checkParentProperties(parsedObj) {
  const requiredProperties = ['images', 'annotations', 'categories'];
  const nullProperties = requiredProperties.filter(property => !parsedObj[property]);
  if (nullProperties.length === 0) {
    return { error: false, message: '' };
  }
  return { error: true, message: `The following properties have not been found: ${nullProperties}` };
}

function checkJONObject(JSONObject, validators) {
  for (let i = 0; i < validators.length; i += 1) {
    const result = validators[i](JSONObject.annotationData);
    if (result.error) {
      showError(JSONObject.fileMetaData.name, result.message);
      break;
    }
  }
}

function validateCOCOJSONFormat(parsedObj) {
  if (parsedObj.fileFormat === 'annotations') {
    checkJONObject(parsedObj.body, [checkParentProperties, nextFunction]);
  }
}

export { validateCOCOJSONFormat as default };
