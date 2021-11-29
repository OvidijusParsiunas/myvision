import {
  JSON_POSTFIX, PROPERTIES_STRING, ACTIVE_ANNOTATION_FILE,
  ANNOTATION_FILE_INDICATOR, IMAGE_FILE_INDICATOR, VALID_ANNOTATION_FILES_ARRAY,
} from '../../../consts.js';
import datasetObjectManager from '../datasetObjectManagers/COCOJSONDatasetObjectManager.js';
import { getAllImageData } from '../../../../imageList/imageList.js';
import { getReuseAlreadyUploadedImagesState } from '../../../state.js';
import { checkObjectProperties, checkArrayElements } from './sharedUtils.js';

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

function checkImagesProperty(parsedObj) {
  const requiredProperties = { id: 'number|string', file_name: 'string' };
  const { images } = parsedObj;
  for (let i = 0; i < images.length; i += 1) {
    const result = checkObjectProperties(requiredProperties, images[i],
      JSON_POSTFIX, PROPERTIES_STRING);
    if (result.error) {
      result.message += ' -> in images';
      return result;
    }
  }
  return { error: false, message: '' };
}

function checkSegmentationArray(segmentationArray) {
  const arrayName = 'Segmentation';
  const elementsType = 'array:number';
  if (segmentationArray.length > 1) {
    const result = checkArrayElements(segmentationArray, arrayName,
      JSON_POSTFIX, { elementsType, length: 8 });
    if (result.error) { return result; }
  } else if (segmentationArray.length === 1) {
    const polygonCoordinatesArray = segmentationArray[0];
    let result = {};
    result = checkArrayElements(polygonCoordinatesArray, arrayName,
      JSON_POSTFIX, { elementsType: 'array' });
    if (result.error) { return result; }
    result = checkArrayElements(polygonCoordinatesArray, arrayName,
      JSON_POSTFIX, { elementsType, minLength: 6, evenOdd: 'even' });
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
    let result = checkObjectProperties(requiredProperties, annotation,
      JSON_POSTFIX, PROPERTIES_STRING);
    if (result.error) {
      result.message += ' -> in annotations';
      return result;
    }
    result = checkSegmentationArray(annotation.segmentation);
    if (result.error) {
      result.message += ' -> in annotations';
      return result;
    }
    result = checkArrayElements(annotation.bbox, 'bbox', JSON_POSTFIX, { length: 4 });
    if (result.error) {
      result.message += ' -> in annotations';
      return result;
    }
  }
  return { error: false, message: '' };
}

function checkCategoriesProperty(parsedObj) {
  const requiredProperties = { id: 'number|string', name: 'number|string' };
  const { categories } = parsedObj;
  for (let i = 0; i < categories.length; i += 1) {
    const result = checkObjectProperties(requiredProperties, categories[i],
      JSON_POSTFIX, PROPERTIES_STRING);
    if (result.error) {
      result.message += ' -> in categories';
      return result;
    }
  }
  return { error: false, message: '' };
}

function checkParentProperties(parsedObj) {
  const requiredProperties = { images: 'array:object', annotations: 'array:object', categories: 'array:object' };
  let result = {};
  result = checkObjectProperties(requiredProperties, parsedObj,
    JSON_POSTFIX, PROPERTIES_STRING);
  if (result.error) { return result; }
  result = checkArrayElements(parsedObj.images, 'images', JSON_POSTFIX, { minLength: 1 });
  if (result.error) { return result; }
  result = checkArrayElements(parsedObj.annotations, 'annotations', JSON_POSTFIX, { minLength: 1 });
  if (result.error) { return result; }
  result = checkArrayElements(parsedObj.categories, 'categories', JSON_POSTFIX, { minLength: 1 });
  if (result.error) { return result; }
  return { error: false, message: '' };
}

function checkObject(JSONObject, validators) {
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
    checkCategoriesProperty,
    checkAnnotationsProperty,
    checkImagesProperty,
    checkAnnotationsMapToImages,
    checkAnnotationsMapToCategories,
  ];
  const validationResult = checkObject(parsedObj.body, validators);
  if (!validationResult.error) {
    setCurrentAnnotationFilesToInactive(validAnnotationFiles);
    parsedObj.active = true;
  }
  return validationResult;
}

function validateCOCOJSONFormat(parsedObj, errorObj) {
  if (!errorObj) {
    const datasetObject = datasetObjectManager.getDatasetObject();
    const activeAnnotationFile = datasetObject[ACTIVE_ANNOTATION_FILE];
    const validAnnotationFiles = datasetObject[VALID_ANNOTATION_FILES_ARRAY];
    if (parsedObj.fileFormat === ANNOTATION_FILE_INDICATOR) {
      return validateAnnotationsFile(parsedObj, validAnnotationFiles);
    }
    if (parsedObj.fileFormat === IMAGE_FILE_INDICATOR) {
      return validateImageFile(parsedObj, validAnnotationFiles, activeAnnotationFile);
    }
  }
  if (getReuseAlreadyUploadedImagesState()
    && parsedObj.fileFormat === IMAGE_FILE_INDICATOR) {
    const imageName = parsedObj.body.fileMetaData.name;
    if (isImageAlreadyUploaded(imageName)) {
      return { error: false, message: '', alreadyUploaded: true };
    }
  }
  return errorObj;
}

export { validateCOCOJSONFormat as default };
