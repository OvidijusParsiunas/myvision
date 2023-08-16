import {
  JSON_POSTFIX, ANNOTATION_FILE_INDICATOR,
  ACTIVE_ANNOTATION_FILE, IMAGE_FILE_INDICATOR, VALID_ANNOTATION_FILES_ARRAY,
} from '../../../consts';
import datasetObjectManager from '../datasetObjectManagers/VGGJSONDatasetObjectManager';
import { getTextFromDictionary } from '../../../../text/languages/language';
import { checkObjectProperties, checkArrayElements } from './sharedUtils';
import { getReuseAlreadyUploadedImagesState } from '../../../state';
import { getAllImageData } from '../../../../imageList/imageList';

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
    const annotationDataKeys = Object.keys(annotationData);
    for (let i = 0; i < annotationDataKeys.length; i += 1) {
      const { filename } = annotationData[annotationDataKeys[i]];
      if (imageName === filename) {
        return {
          error: false, message: '', alreadyUploaded, valid: true,
        };
      }
    }
    return { error: true, message: getTextFromDictionary('UPLOAD_DATASETS_FORMAT_VALIDATAOR_IMAGE_NOT_SPECIFIED'), alreadyUploaded };
  }
  return { error: false, message: '', alreadyUploaded };
}

function checkObjectHasProperties(object, objectName) {
  if (Object.keys(object).length > 0) {
    return { error: false, message: '' };
  }
  return { error: true, message: `${getTextFromDictionary('THE')}${objectName} ${getTextFromDictionary('OBJECT_NO_PROPERTIES')}` };
}

function checkRegionAttributesProperty(parsedObj) {
  const objectKeyNames = Object.keys(parsedObj);
  for (let i = 0; i < objectKeyNames.length; i += 1) {
    const { regions } = parsedObj[objectKeyNames[i]];
    for (let y = 0; y < regions.length; y += 1) {
      const requiredProperties = { name: 'number|string' };
      const result = checkObjectProperties(requiredProperties, regions[y].region_attributes,
        JSON_POSTFIX, getTextFromDictionary('PROPERTIES'));
      if (result.error) {
        result.message += ` -> ${getTextFromDictionary('IN_1')}region_attributes${getTextFromDictionary('IN_2')}`;
        return result;
      }
    }
  }
  return { error: false, message: '' };
}

function checkShapeAttributesPolygonProperty(region) {
  const elementsType = 'array:number';
  const requiredProperties = {
    all_points_x: elementsType, all_points_y: elementsType,
  };
  let result = checkObjectProperties(requiredProperties, region.shape_attributes,
    JSON_POSTFIX, getTextFromDictionary('PROPERTIES'));
  if (result.error) { return result; }
  if (region.shape_attributes.all_points_x.length
      !== region.shape_attributes.all_points_y.length) {
    return { error: true, message: getTextFromDictionary('VGG_EQUAL_SIZE_ARRAYS') };
  }
  result = checkArrayElements(region.shape_attributes.all_points_x, 'all_points_x', JSON_POSTFIX,
    { elementsType, minLength: 3 });
  if (result.error) { return result; }
  result = checkArrayElements(region.shape_attributes.all_points_y, 'all_points_y', JSON_POSTFIX,
    { elementsType, minLength: 3 });
  if (result.error) { return result; }
  return { error: false, message: '' };
}

function checkShapeAttributesRectProperty(region) {
  const requiredProperties = {
    x: 'number', y: 'number', width: 'number', height: 'number',
  };
  const result = checkObjectProperties(requiredProperties, region.shape_attributes,
    JSON_POSTFIX, getTextFromDictionary('PROPERTIES'));
  if (result.error) { return result; }
  return { error: false, message: '' };
}

function checkShapeAttributesProperty(parsedObj) {
  const objectKeyNames = Object.keys(parsedObj);
  for (let i = 0; i < objectKeyNames.length; i += 1) {
    const { regions } = parsedObj[objectKeyNames[i]];
    for (let y = 0; y < regions.length; y += 1) {
      const region = regions[y];
      const requiredProperties = { name: 'string' };
      let result = checkObjectProperties(requiredProperties, region.shape_attributes,
        JSON_POSTFIX, getTextFromDictionary('PROPERTIES'));
      if (result.error) {
        result.message += ` -> ${getTextFromDictionary('IN_1')}shape_attributes${getTextFromDictionary('IN_2')}`;
        return result;
      }
      if (region.shape_attributes.name === 'rect') {
        result = checkShapeAttributesRectProperty(region);
        if (result.error) {
          result.message += ` -> ${getTextFromDictionary('IN_1')}shape_attributes${getTextFromDictionary('IN_2')}`;
          return result;
        }
      } else if (region.shape_attributes.name === 'polygon') {
        result = checkShapeAttributesPolygonProperty(region);
        if (result.error) {
          result.message += ` -> ${getTextFromDictionary('IN_1')}shape_attributes${getTextFromDictionary('IN_2')}`;
          return result;
        }
      } else {
        return { error: true, message: `${getTextFromDictionary('SHAPE_NOT_SUPPORTED')}: ${region.shape_attributes.name} -> ${getTextFromDictionary('IN_1')}shape_attributes${getTextFromDictionary('IN_2')}` };
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
      const result = checkObjectProperties(requiredProperties, regions[y],
        JSON_POSTFIX, getTextFromDictionary('PROPERTIES'));
      if (result.error) {
        result.message += ` -> ${getTextFromDictionary('IN_1')}regions${getTextFromDictionary('IN_2')}`;
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
    const result = checkObjectProperties(requiredProperties, parsedObj[objectKeyNames[i]],
      JSON_POSTFIX, getTextFromDictionary('PROPERTIES'));
    if (result.error) {
      result.message += ` -> ${getTextFromDictionary('IN_1')}${getTextFromDictionary('ANNOTATION_OBJECT')}${getTextFromDictionary('IN_2')}`;
      return result;
    }
  }
  return { error: false, message: '' };
}

function checkParentProperties(parsedObj) {
  return checkObjectHasProperties(parsedObj, 'parent');
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

function validateAnnotationsFile(parsedObj, validAnnotationFiles) {
  const validators = [
    checkParentProperties,
    checkAnnotationObjectsProperties,
    checkRegionsProperty,
    checkShapeAttributesProperty,
    checkRegionAttributesProperty,
  ];
  const validationResult = checkObject(parsedObj.body, validators);
  if (!validationResult.error) {
    setCurrentAnnotationFilesToInactive(validAnnotationFiles);
    parsedObj.active = true;
  }
  return validationResult;
}

function validateVGGJSONFormat(parsedObj, errorObj) {
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

export { validateVGGJSONFormat as default };
