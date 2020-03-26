import { VALID_ANNOTATION_FILES_ARRAY, ACTIVE_ANNOTATION_FILE } from '../../../consts';
import { getDatasetObject } from '../datasetObjectManagers/VGGJSONDatasetObjectManager';
import { getAllImageData } from '../../../../imageList/imageList';
import { getReuseAlreadyUploadedImagesState } from '../stateManager';

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
    case 'object':
      return typeof subjectVariable === 'object';
    case 'array':
      return Array.isArray(subjectVariable);
    case 'array:number':
      return Array.isArray(subjectVariable) && subjectVariable.filter(entry => typeof entry !== 'number').length === 0;
    case 'array:object':
      return Array.isArray(subjectVariable) && subjectVariable.filter(entry => typeof entry !== 'object').length === 0;
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

function checkObjectHasProperties(object, objectName) {
  if (Object.keys(object).length > 1) {
    return { error: false, message: '' };
  }
  return { error: true, message: `The ${objectName} object does not contain any properties` };
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
  if (length && array.length !== length) {
    return { error: true, message: `${name} array must contain ${length} elements but instead found ${array.length}` };
  }
  if (maxLength && array.length > maxLength) {
    return { error: true, message: `${name} array must contain ${maxLength} elements at most but instead found ${array.length}` };
  }
  if (minLength && array.length < minLength) {
    return { error: true, message: `${name} array must contain at least ${minLength} elements but instead found ${array.length}` };
  }
  if (evenOdd && ((evenOdd === 'even' && array.length % 2 === 1) || (evenOdd === 'odd' && array.length % 2 === 0))) {
    return { error: true, message: `${name} array must contain an even number of elements but instead found ${array.length}` };
  }
  if (!assertType(type, array)) {
    return { error: true, message: `${name} array contains elements of incorrect type` };
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
    if (result.error) { return result; }
    result = checkArrayElements(polygonCoordinatesArray, arrayName, arrayElementsType,
      { minLength: 6, evenOdd: 'even' });
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
    if (result.error) {
      result.message += ' -> in annotations';
      return result;
    }
    result = checkArrayElements(annotation.bbox, 'bbox', null, { length: 4 });
    if (result.error) {
      result.message += ' -> in annotations';
      return result;
    }
  }
  return { error: false, message: '' };
}

function checkCategoriesProperty(parsedObj) {
  const requiredProperties = { shape_attributes: 'number|string', name: 'number|string' };
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

function checkShapeAttributesPolygonProperty(region) {
  const arrayType = 'array:number';
  const requiredProperties = {
    all_points_x: arrayType, all_points_y: arrayType,
  };
  let result = checkObjectProperties(requiredProperties, region.shape_attributes);
  if (result.error) {
    result.message += ' -> in regions';
    return result;
  }
  if (region.shape_attributes.all_points_x.length
      !== region.shape_attributes.all_points_y.length) {
    return { error: true, message: 'all_points_x and all_points_y arrays must have equal size -> in regions' };
  }
  result = checkArrayElements(region.shape_attributes.all_points_x, 'all_points_x', arrayType,
    { minLength: 3 });
  if (result.error) { return result; }
  result = checkArrayElements(region.shape_attributes.all_points_y, 'all_points_y', arrayType,
    { minLength: 3 });
  if (result.error) { return result; }
  return { error: false, message: '' };
}

function checkShapeAttributesRectProperty(region) {
  const requiredProperties = {
    x: 'number', y: 'number', width: 'number', height: 'number',
  };
  const result = checkObjectProperties(requiredProperties, region.shape_attributes);
  if (result.error) {
    result.message += ' -> in regions';
    return result;
  }
  return { error: false, message: '' };
}

function checkShapeAttributesProperty(parsedObj) {
  const objectKeyNames = Object.keys(parsedObj);
  for (let i = 0; i < objectKeyNames.length; i += 1) {
    const { regions } = parsedObj[objectKeyNames[i]];
    for (let y = 0; y < regions.length; y += 1) {
      const region = regions[y];
      const requiredProperties = { name: 'string' };
      const result = checkObjectProperties(requiredProperties, region.shape_attributes);
      if (result.error) {
        result.message += ' -> in regions';
        return result;
      }
      if (region.shape_attributes.name === 'rect') {
        return checkShapeAttributesRectProperty(region);
      }
      if (region.shape_attributes.name === 'polygon') {
        return checkShapeAttributesPolygonProperty(region);
      }
    }
  }
  return { error: false, message: '' };
}

function checkRegionsProperty(parsedObj) {
  const requiredProperties = { shape_attributes: 'object', region_attributes: 'object' };
  const objectKeyNames = Object.keys(parsedObj);
  for (let i = 0; i < objectKeyNames.length; i += 1) {
    const { regions } = parsedObj[objectKeyNames[i]];
    for (let y = 0; y < regions.length; y += 1) {
      const result = checkObjectProperties(requiredProperties, regions[y]);
      if (result.error) {
        result.message += ' -> in regions';
        return result;
      }
    }
  }
  return { error: false, message: '' };
}

function checkAnnotationObjectsProperties(parsedObj) {
  const requiredProperties = { filename: 'string', regions: 'array:object' };
  const objectKeyNames = Object.keys(parsedObj);
  for (let i = 0; i < objectKeyNames.length; i += 1) {
    const result = checkObjectProperties(requiredProperties, parsedObj[objectKeyNames[i]]);
    if (result.error) {
      result.message += ' -> in annotation object';
      return result;
    }
  }
  return { error: false, message: '' };
}

function checkParentProperties(parsedObj) {
  return checkObjectHasProperties(parsedObj, 'parent');
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

function isImageAlreadyUploaded(newImageName) {
  const images = getAllImageData();
  for (let i = 0; i < images.length; i += 1) {
    if (newImageName === images[i].name) {
      return true;
    }
  }
  return false;
}

function validateImageFile(parsedObj, validAnnotationFiles, activeAnnotationFile) {
  const imageName = parsedObj.body.fileMetaData.name;
  const alreadyUploaded = getReuseAlreadyUploadedImagesState()
    ? isImageAlreadyUploaded(imageName) : false;
  if (validAnnotationFiles.length > 0) {
    const { annotationData } = activeAnnotationFile.body;
    for (let i = 0; i < annotationData.images.length; i += 1) {
      if (imageName === annotationData.images[i].file_name) {
        return {
          error: false, message: '', alreadyUploaded, valid: true,
        };
      }
    }
    return { error: true, message: 'This image is not specified in the annotations file(s)', alreadyUploaded };
  }
  return { error: false, message: '', alreadyUploaded };
}

function validateAnnotationsFile(parsedObj, validAnnotationFiles) {
  const validators = [
    checkParentProperties,
    checkAnnotationObjectsProperties,
    checkRegionsProperty,
    checkShapeAttributesProperty,
    // checkCategoriesProperty,
    // checkAnnotationsProperty,
    // checkImagesProperty,
    // checkAnnotationsMapToImages,
    // checkAnnotationsMapToCategories,
  ];
  const validationResult = checkJONObject(parsedObj.body, validators);
  if (!validationResult.error) {
    setCurrentAnnotationFilesToInactive(validAnnotationFiles);
    parsedObj.active = true;
  }
  return validationResult;
}

function validateVGGJSONFormat(parsedObj, errorObj) {
  if (!errorObj) {
    const datasetObject = getDatasetObject();
    const activeAnnotationFile = datasetObject[ACTIVE_ANNOTATION_FILE];
    const validAnnotationFiles = datasetObject[VALID_ANNOTATION_FILES_ARRAY];
    if (parsedObj.fileFormat === 'annotation') {
      return validateAnnotationsFile(parsedObj, validAnnotationFiles);
    }
    if (parsedObj.fileFormat === 'image') {
      return validateImageFile(parsedObj, validAnnotationFiles, activeAnnotationFile);
    }
  }
  if (getReuseAlreadyUploadedImagesState() && parsedObj.fileFormat === 'image') {
    const imageName = parsedObj.body.fileMetaData.name;
    if (isImageAlreadyUploaded(imageName)) {
      return { error: false, message: '', alreadyUploaded: true };
    }
  }
  return errorObj;
}

export { validateVGGJSONFormat as default };
