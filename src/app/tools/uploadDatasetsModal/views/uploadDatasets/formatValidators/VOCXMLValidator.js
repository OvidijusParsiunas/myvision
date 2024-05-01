import datasetObjectManager from '../datasetObjectManagers/VOCXMLDatasetObjectManager';
import { getTextFromDictionary } from '../../../../text/languages/language';
import { getReuseAlreadyUploadedImagesState } from '../../../state';
import { getAllImageData } from '../../../../imageList/imageList';
import { checkObjectProperties } from './sharedUtils';
import {
  IMAGE_FILE_INDICATOR, VALID_ANNOTATION_FILES_ARRAY, XML_POSTFIX, ANNOTATION_FILE_INDICATOR,
} from '../../../consts';

/**
 * Sets the `active` property of all the given `annotationFiles` to `false`.
 * @param {Array<Object>} annotationFiles - The array of annotation files to be marked as inactive.
 */
function setCurrentAnnotationFilesToInactive(annotationFiles) {
  annotationFiles.forEach((annotationFile) => {
    annotationFile.active = false;
  });
}

/**
 * Checks if the given `newImageName` is already uploaded or not.
 * @param {string} newImageName - The name of the image to check for.
 * @returns {boolean} `true` if the image is already uploaded, `false` otherwise.
 */
function isImageAlreadyUploaded(newImageName) {
  const images = getAllImageData();
  for (let i = 0; i < images.length; i += 1) {
    if (newImageName === images[i].name) {
      return true;
    }
  }
  return false;
}

/**
 * Validates the given `parsedObj` image file against the valid annotation files.
 * @param {Object} parsedObj - The parsed image file object.
 * @param {Array<Object>} validAnnotationFiles - The array of valid annotation files.
 * @returns {Object} An object containing the validation result with properties: `error`, `message`, `alreadyUploaded`, and `valid`.
 */
function validateImageFile(parsedObj, validAnnotationFiles) {
  // ... (rest of the function)
}

/**
 * Checks if the required properties for the `bndbox` tag are present and valid.
 * @param {Object} object - The object containing the `bndbox` tag.
 * @returns {Object} An object containing the validation result with properties: `error` and `message`.
 */
function checkbndBoxTag(object) {
  // ... (rest of the function)
}

/**
 * Checks if the required properties for the `object` tag and its child tags are present and valid.
 * @param {Object} parsedObj - The parsed object containing the `object` tag.
 * @returns {Object} An object containing the validation result with properties: `error` and `message`.
 */
function checkObjectTagChildTags(parsedObj) {
  // ... (rest of the function)
}

/**
 * Checks if the required properties for the `object` tag are present and valid.
 * @param {Object} parsedObj - The parsed object containing the `object` tag.
 * @returns {Object} An object containing the validation result with properties: `error` and `message`.
 */
function checkObjectTag(parsedObj) {
  // ... (rest of the function)
}

/**
 * Checks if the required properties for the parent tag are present and valid.
 * @param {Object} parsedObj - The parsed object containing the parent tag.
 * @returns {Object} An object containing the validation result with properties: `error` and `message`.
 */
function checkParentTag(parsedObj) {
  // ... (rest of the function)
}

/**
 * Validates the given `parsedObj` object against the required properties and child tags.
 * @param {Object} parsedObj - The parsed object to validate.
 * @returns {Object} An object containing the validation result with properties: `error` and `message`.
 */
function checkObject(object, validators) {
  // ... (rest of the function)
}

/**
 * Validates the given `parsedObj` annotation file against the valid annotation files.
 * @param {Object} parsedObj - The parsed annotation file object.
 * @param {Array<Object>} validAnnotationFiles - The array of valid annotation files.
 * @returns {Object} An object containing the validation result with properties: `error`, `message`, and `alreadyUploaded`.
 */
function validateAnnotationsFile(parsedObj, validAnnotationFiles) {
  // ... (rest of the function)
}

/**
 * Validates the given `parsedObj` against the VOCXML format and returns the validation result.
 * @param {Object} parsedObj - The parsed object to validate.
 * @param {Object} errorObj - The error object to return if the validation fails.
 * @returns {Object} An object containing the validation result with properties: `error`, `message`, `alreadyUploaded`, and `valid`.
 */
function validateVOCXMLFormat(parsedObj, errorObj) {
  // ... (rest of the function)
}

// Exporting the `validateVOCXMLFormat` function as the default export.
export { validateVOCXMLFormat as default };
