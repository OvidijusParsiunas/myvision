
function showError(fileName, errorMessage) {
  console.error(`${fileName} validation failure. Reason: ${errorMessage}`);
}

function nextFunction() {
  return true;
}

function checkAnnotationsMapToCategories() {
    
}

function checkAnnotationsMapToImages() {
    
}

function checkImagesProperties() {
    
}

function checkAnnotationsProperties() {

}

function checkCategoriesProperties(parsedObj) {
  const requiredProperties = ['id', 'name'];
  const { categories } = parsedObj;
  for (let i = 0; i < categories.length; i += 1) {
    const nullProperties = requiredProperties.filter(
      property => categories[i][property] === undefined,
    );
    if (nullProperties.length > 0) {
      return { error: true, message: '' };
    }
  }
  return { error: false, message: '' };
}

function checkParentProperties(parsedObj) {
  const requiredProperties = ['images', 'annotations', 'categories'];
  const nullProperties = requiredProperties.filter(property => parsedObj[property] === undefined);
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
    console.log(parsedObj);
    checkJONObject(parsedObj.body, [checkParentProperties, checkCategoriesProperties]);
  }
}

export { validateCOCOJSONFormat as default };
