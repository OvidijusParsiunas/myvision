import { VALID_ANNOTATION_FILES_ARRAY, ACTIVE_ANNOTATION_FILE } from '../sharedConsts/consts';
import { getDatasetObject } from '../datasetObjectManagers/COCOJSONDatasetObjectManager';

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

function assertType(expectedType, subjectVariable) {
  switch (expectedType) {
    case 'number':
      return typeof subjectVariable === 'number';
    case 'string':
      return typeof subjectVariable === 'string';
    case 'number|string':
      return typeof subjectVariable === 'string' || typeof subjectVariable === 'number';
    case 'array':
      return Array.isArray(subjectVariable);
    case 'array:number':
      return Array.isArray(subjectVariable) && subjectVariable.filter(entry => typeof entry !== 'number').length === 0;
      // check the following type
    case 'array:object':
      return Array.isArray(subjectVariable) && typeof subjectVariable === 'object';
    default:
      return true;
  }
}

function checkObjectProperties(requiredProperties, subjectObject) {
  const undefinedProperties = [];
  Object.keys(requiredProperties).forEach((property) => {
    if (subjectObject[property] === undefined) {
      undefinedProperties.push(property);
    }
  });
  if (undefinedProperties.length > 0) {
    return { error: true, message: `The following properties have not been found: ${undefinedProperties.join(', ')}` };
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
  const incorrectTypeProperties = [];
  Object.keys(requiredProperties).forEach((property) => {
    if (!assertType(requiredProperties[property], subjectObject[property])) {
      incorrectTypeProperties.push(property);
    }
  });
  if (incorrectTypeProperties.length > 0) {
    return { error: true, message: `The following properties contain an incorrect type: ${incorrectTypeProperties}` };
  }
  return { error: false, message: '' };
}

function checkImagesProperty(parsedObj) {
  const requiredProperties = { id: 'number|string', file_name: 'string' };
  const { images } = parsedObj;
  for (let i = 0; i < images.length; i += 1) {
    const result = checkObjectProperties(requiredProperties, images[i]);
    if (result.error) {
      result.message += ' -> in images';
      return result;
    }
  }
  return { error: false, message: '' };
}

function checkArrayElements(array, name, type, {
  length, maxLength, minLength, evenOdd,
}) {
  console.log(array);
  if (length && array.length !== length) {
    return { error: true, message: `${name} array must contain ${length} or more elements but instead has: ${array.length}` };
  }
  if (maxLength && array.length > maxLength) {
    return { error: true, message: `${name} array must contain ${maxLength} elements at most but instead has: ${array.length}` };
  }
  if (minLength && array.length < minLength) {
    return { error: true, message: `${name} array must contain at least ${minLength} elements but instead has: ${array.length}` };
  }
  if (evenOdd && ((evenOdd === 'even' && array.length % 2 === 1) || (evenOdd === 'odd' && array.length % 2 === 0))) {
    return { error: true, message: `${name} array must contain an even number of elements but instead has: ${array.length}` };
  }
  const result = assertType(array, type);
  if (result.error) {
    result.message += ` -> in ${name.toLowerCase()} array`;
    return result;
  }
  return { error: false, message: '' };
}

function checkSegmentationArray(segmentationArray) {
  const arrayName = 'Segmentation';
  const arrayElementsType = 'array:number';
  if (segmentationArray.length > 1) {
    const result = checkArrayElements(segmentationArray, arrayName, arrayElementsType,
      { length: 8 });
    if (result.error) { return result; }
  } else if (segmentationArray.length === 1) {
    const polygonCoordinatesArray = segmentationArray[0];
    let result = {};
    result = checkArrayElements(polygonCoordinatesArray, arrayName, 'array', {});
    console.log(result.error);
    if (result.error) { return result; }
    result = checkArrayElements(polygonCoordinatesArray, arrayName, arrayElementsType,
      { minLength: 6, evenOdd: 'even' });
    console.log(result.error);
    if (result.error) { return result; }
  }
  if (segmentationArray.length < 1) {
    return { error: true, message: `${arrayName} array is empty` };
  }
  return { error: false, message: '' };
}

function checkAnnotationsProperty(parsedObj) {
  const requiredProperties = {
    id: 'number|string', image_id: 'number|string', category_id: 'number|string', segmentation: 'array', bbox: 'array:number',
  };
  const { annotations } = parsedObj;
  for (let i = 0; i < annotations.length; i += 1) {
    const annotation = annotations[i];
    let result = checkObjectProperties(requiredProperties, annotation);
    if (result.error) {
      result.message += ' -> in annotations';
      return result;
    }
    result = checkSegmentationArray(annotation.segmentation);
    if (result.error) { return result; }
    // work needs here
    if (annotation.bbox.length !== 4) {
      return { error: true, message: 'bbox array should contain four numbers -> in annotations' };
    }
  }
  return { error: false, message: '' };
}

function checkCategoriesProperty(parsedObj) {
  const requiredProperties = { id: 'number|string', name: 'number|string' };
  const { categories } = parsedObj;
  for (let i = 0; i < categories.length; i += 1) {
    const result = checkObjectProperties(requiredProperties, categories[i]);
    if (result.error) {
      result.message += ' -> in categories';
      return result;
    }
  }
  return { error: false, message: '' };
}

function checkParentProperties(parsedObj) {
  const requiredProperties = { images: 'array:object', annotations: 'array:object', categories: 'array:object' };
  return checkObjectProperties(requiredProperties, parsedObj);
}

function checkJONObject(JSONObject, validators) {
  for (let i = 0; i < validators.length; i += 1) {
    const result = validators[i](JSONObject.annotationData);
    if (result.error) {
      return result;
    }
  }
  return { error: false, message: '' };
}

function setCurrentAnnotationFilesToInactive(annotationFiles) {
  annotationFiles.forEach((annotationFile) => {
    annotationFile.active = false;
  });
}

function validateCOCOJSONFormat(parsedObj) {
  const datasetObject = getDatasetObject();
  const activeAnnotationFile = datasetObject[ACTIVE_ANNOTATION_FILE];
  const validAnnotationFiles = datasetObject[VALID_ANNOTATION_FILES_ARRAY];
  if (parsedObj.fileFormat === 'annotation') {
    const validators = [
      checkParentProperties,
      checkCategoriesProperty,
      checkAnnotationsProperty,
      checkImagesProperty,
      checkAnnotationsMapToImages,
      checkAnnotationsMapToCategories,
    ];
    const validationResult = checkJONObject(parsedObj.body, validators);
    if (!validationResult.error) {
      setCurrentAnnotationFilesToInactive(validAnnotationFiles);
      parsedObj.active = true;
    }
    return validationResult;
  }
  if (parsedObj.fileFormat === 'image' && validAnnotationFiles.length > 0) {
    const { annotationData } = activeAnnotationFile.body;
    for (let i = 0; i < annotationData.images.length; i += 1) {
      if (parsedObj.body.fileMetaData.name === annotationData.images[i].file_name) {
        return { error: false, message: '' };
      }
    }
    return { error: true, message: 'This image is not specified in the annotations file(s)' };
  }
  return { error: false, message: '' };
}

export { validateCOCOJSONFormat as default };
