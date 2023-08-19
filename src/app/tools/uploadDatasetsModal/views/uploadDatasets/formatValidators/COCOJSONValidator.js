import {
  ACTIVE_ANNOTATION_FILE, VALID_ANNOTATION_FILES_ARRAY,
  JSON_POSTFIX, ANNOTATION_FILE_INDICATOR, IMAGE_FILE_INDICATOR,
} from '../../../consts';
import datasetObjectManager from '../datasetObjectManagers/COCOJSONDatasetObjectManager';
import { getTextFromDictionary } from '../../../../text/languages/language';
import { checkObjectProperties, checkArrayElements } from './sharedUtils';
import { getReuseAlreadyUploadedImagesState } from '../../../state';
import { getAllImageData } from '../../../../imageList/imageList';

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
      return { error: true, message: `${getTextFromDictionary('THE_FOLLOWING_HAS_NOT_BEEN_FOUND')}category_id${getTextFromDictionary('HAS_NOT_FOUND')}: ${annotation.category_id} -> ${getTextFromDictionary('IN_1')}categories${getTextFromDictionary('IN_2')}` };
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
      return { error: true, message: `${getTextFromDictionary('THE_FOLLOWING_HAS_NOT_BEEN_FOUND')}image_id${getTextFromDictionary('HAS_NOT_FOUND')}: ${annotation.image_id} -> ${getTextFromDictionary('IN_1')}annotations${getTextFromDictionary('IN_2')}` };
    }
  }
  return { error: false, message: '' };
}

function checkImagesProperty(parsedObj) {
  const requiredProperties = { id: 'number|string', file_name: 'string' };
  const { images } = parsedObj;
  for (let i = 0; i < images.length; i += 1) {
    const result = checkObjectProperties(requiredProperties, images[i],
      JSON_POSTFIX, getTextFromDictionary('PROPERTIES'));
    if (result.error) {
      result.message += ` -> ${getTextFromDictionary('IN_1')}images${getTextFromDictionary('IN_2')}`;
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
    return { error: true, message: `${arrayName}${getTextFromDictionary('ARRAY_EMPTY')}` };
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
      JSON_POSTFIX, getTextFromDictionary('PROPERTIES'));
    if (result.error) {
      result.message += ` -> ${getTextFromDictionary('IN_1')}annotations${getTextFromDictionary('IN_2')}`;
      return result;
    }
    result = checkSegmentationArray(annotation.segmentation);
    if (result.error) {
      result.message += ` -> ${getTextFromDictionary('IN_1')}annotations${getTextFromDictionary('IN_2')}`;
      return result;
    }
    result = checkArrayElements(annotation.bbox, 'bbox', JSON_POSTFIX, { length: 4 });
    if (result.error) {
      result.message += ` -> ${getTextFromDictionary('IN_1')}annotations${getTextFromDictionary('IN_2')}`;
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
      JSON_POSTFIX, getTextFromDictionary('PROPERTIES'));
    if (result.error) {
      result.message += ` -> ${getTextFromDictionary('IN_1')}categories${getTextFromDictionary('IN_2')}`;
      return result;
    }
  }
  return { error: false, message: '' };
}

function checkParentProperties(parsedObj) {
  const requiredProperties = { images: 'array:object', annotations: 'array:object', categories: 'array:object' };
  let result = {};
  result = checkObjectProperties(requiredProperties, parsedObj,
    JSON_POSTFIX, getTextFromDictionary('PROPERTIES'));
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
    return { error: true, message: getTextFromDictionary('UPLOAD_DATASETS_FORMAT_VALIDATAOR_IMAGE_NOT_SPECIFIED'), alreadyUploaded };
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
