function showError(fileName, errorMessage) {
  console.error(`${fileName} validation failure. Reason: ${errorMessage}`);
}

function checkAnnotationsMapToCategories(parsedObj) {
  const { annotations, categories } = parsedObj;
  for (let i = 0; i < annotations.length; i += 1) {
    const annotation = annotations[i];
    let categoryIdValid = false;
    for (let y = 0; y < categories.length; y += 1) {
      const category = categories[y];
      if (annotation.category_id === category.id) {
        categoryIdValid = true;
        break;
      }
    }
    if (!categoryIdValid) {
      return { error: true, message: `The following category_id has not been found: ${annotation.category_id} -> in categories` };
    }
  }
  return { error: false, message: '' };
}

function checkAnnotationsMapToImages(parsedObj) {
  const { annotations, images } = parsedObj;
  for (let i = 0; i < annotations.length; i += 1) {
    const annotation = annotations[i];
    let imageIdValid = false;
    for (let y = 0; y < images.length; y += 1) {
      const image = images[y];
      if (annotation.image_id === image.id) {
        imageIdValid = true;
        break;
      }
    }
    if (!imageIdValid) {
      return { error: true, message: `The following image_id has not been found: ${annotation.image_id} -> in annotations` };
    }
  }
  return { error: false, message: '' };
}

function isObject(variable) {
  return typeof variable === 'object';
}

function isArray(variable) {
  return Array.isArray(variable);
}

function isStringOrNumber(variable) {
  const variableType = typeof variable;
  return typeof variableType === 'string' || variableType === 'number';
}

function typeCheck(expectedType, subjectVariable) {
}

function checkProperties(requiredProperties, subjectObject) {
  const undefinedProperties = [];
  Object.keys(requiredProperties).forEach((property) => {
    if (subjectObject[property] === undefined) {
      undefinedProperties.push(property);
    }
  });
  if (undefinedProperties.length > 0) {
    return { error: true, message: `The following properties have not been found: ${undefinedProperties}` };
  }
  const nullProperties = [];
  Object.keys(requiredProperties).forEach((property) => {
    if (subjectObject[property] === null) {
      nullProperties.push(property);
    }
  });
  if (nullProperties.length > 0) {
    return { error: true, message: `The following properties are null: ${nullProperties}` };
  }
  // const incorrectType = [];
  // Object.keys(requiredProperties).forEach((property) => {
  //   if (!typeCheck(requiredProperties[property], subjectObject[property])) {
  //     incorrectType.push(property);
  //   }
  // });
  // if (nullProperties.length > 0) {
  //   return { error: true, message: `The following properties are null: ${nullProperties}` };
  // }
  return { error: false, message: '' };
}

function checkImagesProperty(parsedObj) {
  const requiredProperties = { id: 'number|string', file_name: 'string' };
  const { images } = parsedObj;
  for (let i = 0; i < images.length; i += 1) {
    const result = checkProperties(requiredProperties, images[i]);
    if (result.error) {
      result.message += ' -> in images';
      return result;
    }
  }
  return { error: false, message: '' };
}

function checkAnnotationsProperty(parsedObj) {
  const requiredProperties = {
    id: 'number|string', image_id: 'number|string', category_id: 'number|string', bbox: 'array',
  };
  const { annotations } = parsedObj;
  for (let i = 0; i < annotations.length; i += 1) {
    const result = checkProperties(requiredProperties, annotations[i]);
    if (result.error) {
      result.message += ' -> in annotations';
      return result;
    }
    if (!isArray(annotations[i].bbox)
      || annotations[i].bbox.length !== 4
      || annotations[i].bbox.filter(entry => typeof entry !== 'number').length > 0) {
      return { error: true, message: 'bbox array is incorrect -> in annotations' };
    }
  }
  return { error: false, message: '' };
}

function checkCategoriesProperty(parsedObj) {
  const requiredProperties = { id: 'number', name: 'string' };
  const { categories } = parsedObj;
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
  const requiredProperties = { images: 'array', annotations: 'array', categories: 'array' };
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
    const validators = [
      checkParentProperties,
      checkCategoriesProperty,
      checkAnnotationsProperty,
      checkImagesProperty,
      checkAnnotationsMapToImages,
      checkAnnotationsMapToCategories,
    ];
    checkJONObject(parsedObj.body, validators);
  }
}

export { validateCOCOJSONFormat as default };
