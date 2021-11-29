import {
  JSON_POSTFIX, PROPERTIES_STRING, ACTIVE_ANNOTATION_FILE,
  ANNOTATION_FILE_INDICATOR, IMAGE_FILE_INDICATOR, VALID_ANNOTATION_FILES_ARRAY,
} from '../../../consts.js';
import datasetObjectManager from '../datasetObjectManagers/VGGJSONDatasetObjectManager.js';
import { getAllImageData } from '../../../../imageList/imageList.js';
import { getReuseAlreadyUploadedImagesState } from '../../../state.js';
import { checkObjectProperties, checkArrayElements } from './sharedUtils.js';

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
    return { error: true, message: 'This image is not specified in the annotations file(s)', alreadyUploaded };
  }
  return { error: false, message: '', alreadyUploaded };
}

function checkObjectHasProperties(object, objectName) {
  if (Object.keys(object).length > 0) {
    return { error: false, message: '' };
  }
  return { error: true, message: `The ${objectName} object does not contain any properties` };
}

function checkRegionAttributesProperty(parsedObj) {
  const objectKeyNames = Object.keys(parsedObj);
  for (let i = 0; i < objectKeyNames.length; i += 1) {
    const { regions } = parsedObj[objectKeyNames[i]];
    for (let y = 0; y < regions.length; y += 1) {
      const requiredProperties = { name: 'number|string' };
      const result = checkObjectProperties(requiredProperties, regions[y].region_attributes,
        JSON_POSTFIX, PROPERTIES_STRING);
      if (result.error) {
        result.message += ' -> in region_attributes';
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
    JSON_POSTFIX, PROPERTIES_STRING);
  if (result.error) { return result; }
  if (region.shape_attributes.all_points_x.length
      !== region.shape_attributes.all_points_y.length) {
    return { error: true, message: 'all_points_x and all_points_y arrays must have equal size' };
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
    JSON_POSTFIX, PROPERTIES_STRING);
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
        JSON_POSTFIX, PROPERTIES_STRING);
      if (result.error) {
        result.message += ' -> in shape_attributes';
        return result;
      }
      if (region.shape_attributes.name === 'rect') {
        result = checkShapeAttributesRectProperty(region);
        if (result.error) {
          result.message += ' -> in shape_attributes';
          return result;
        }
      } else if (region.shape_attributes.name === 'polygon') {
        result = checkShapeAttributesPolygonProperty(region);
        if (result.error) {
          result.message += ' -> in shape_attributes';
          return result;
        }
      } else {
        return { error: true, message: `The following shape type is not supported: ${region.shape_attributes.name} -> in shape_attributes` };
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
        JSON_POSTFIX, PROPERTIES_STRING);
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
    const result = checkObjectProperties(requiredProperties, parsedObj[objectKeyNames[i]],
      JSON_POSTFIX, PROPERTIES_STRING);
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
