
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

function checkProperties(requiredProperties, subjectObject) {
  const nullProperties = requiredProperties.filter(
    property => subjectObject[property] === undefined,
  );
  if (nullProperties.length > 0) {
    return { error: true, message: `The following properties have not been found: ${nullProperties}` };
  }
  return { error: false, message: '' };
}

function checkAnnotationsProperties(parsedObj) {
  const requiredProperties = ['id', 'image_id', 'category_id', 'segmentation', 'area', 'bbox'];
  const { annotations } = parsedObj;
  if (!Array.isArray(annotations)) {
    return { error: true, message: 'annotations property is not an array' };
  }
  for (let i = 0; i < annotations.length; i += 1) {
    const result = checkProperties(requiredProperties, annotations[i]);
    if (result.error) {
      result.message += ' -> in annotations';
      return result;
    }
    if (!Array.isArray(annotations[i].bbox)
      || annotations[i].bbox.length !== 4
      || annotations[i].bbox.filter(entry => typeof entry !== 'number').length > 0) {
      return { error: true, message: 'bbox array is incorrect -> in annotations' };
    }
  }
  return { error: false, message: '' };
}

function checkCategoriesProperties(parsedObj) {
  const requiredProperties = ['id', 'name'];
  const { categories } = parsedObj;
  if (!Array.isArray(categories)) {
    return { error: true, message: 'categories property is not an array' };
  }
  for (let i = 0; i < categories.length; i += 1) {
    const result = checkProperties(requiredProperties, categories[i]);
    if (result.error) {
      result.message += ' -> in categories';
      return result;
    }
  }
  return { error: false, message: '' };
}

function checkParentProperties(parsedObj) {
  const requiredProperties = ['images', 'annotations', 'categories'];
  return checkProperties(requiredProperties, parsedObj);
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
    checkJONObject(parsedObj.body, [checkParentProperties, checkCategoriesProperties, checkAnnotationsProperties]);
  }
}

export { validateCOCOJSONFormat as default };
