import DatasetObjectManager from '../datasetObjectManagers/CSVDatasetObjectManager';
import { IMAGE_FILES_OBJECT, ACTIVE_ANNOTATION_FILE } from '../../../consts';

/**
 * Adds a new shape to the given shapes array
 * @param {object} annotationData - The annotation data for the shape
 * @param {string} imageName - The name of the image associated with the shape
 * @param {object} shapes - The shapes array to add the new shape to
 */
function addNewShapeToArray(annotationData, imageName, shapes) {
  const shapeObj = {
    type: 'boundingBox',
    coordinates: {
      bbox: [
        annotationData[4],
        annotationData[5],
        annotationData[6] - annotationData[4],
        annotationData[7] - annotationData[5],
      ],
      class: annotationData[3].toString(),
    },
    imageName,
  };

  shapes.boundingBoxes.push(shapeObj);
}

/**
 * Gets the shapes associated with the given valid images
 * @param {object} datasetObject - The dataset object
 * @param {Array<object>} validImages - The valid images to get shapes for
 * @returns {object} The shapes object with bounding boxes and polygons
 */
function getShapes(datasetObject, validImages) {
  const shapes = { boundingBoxes: [], polygons: [] };
  const { annotationData } = datasetObject[ACTIVE_ANNOTATION_FILE].body;

  if (!Array.isArray(annotationData)) {
    throw new Error('annotationData is not an array');
  }

  validImages.forEach((validImage) => {
    const imageName = validImage.body.fileMetaData.name;

    for (let i = 0; i < annotationData.length; i += 1) {
      if (imageName === annotationData[i][0]) {
        addNewShapeToArray(annotationData[i], imageName, shapes);
      }
    }
  });

  return shapes;
}

/**
 * Gets the valid images from the given image files object
 * @param {object} imageFiles - The image files object
 * @returns {Array<object>} The valid images array
 */
function getImages(imageFiles) {
  const images = [];

  Object.keys(imageFiles).forEach((key) => {
    const imageFile = imageFiles[key];

    if (!imageFile.error) {
      images.push(imageFile);
    }
  });

  return images;
}

/**
 * Assembles the final object from the CSV dataset object
 * @returns {object} The final object with images and shapes
 */
function assembleFinalObjectFromCSV() {
  const finalObject = { images: [], shapes: [] };
  const datasetObject = DatasetObjectManager.getDatasetObject();

  if (!datasetObject) {
    throw new Error('datasetObject is undefined');
  }

  const imageFiles = datasetObject[IMAGE_FILES_OBJECT];

  if (!Array.isArray(imageFiles)) {
    throw new Error('imageFiles is not an array');
  }

  finalObject.images = getImages(imageFiles);
  finalObject.shapes = getShapes(datasetObject, finalObject.images);

  return finalObject;
}

export default assembleFinalObjectFromCSV;
