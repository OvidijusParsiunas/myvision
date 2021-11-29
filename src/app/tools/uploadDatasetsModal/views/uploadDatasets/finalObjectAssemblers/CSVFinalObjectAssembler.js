import datasetObjectManager from '../datasetObjectManagers/CSVDatasetObjectManager.js';
import { IMAGE_FILES_OBJECT, ACTIVE_ANNOTATION_FILE } from '../../../consts.js';

function addNewShapeToArray(annotationData, imageName, shapes) {
  const shapeObj = { type: null, coordinates: {}, imageName };
  const bbox = [];
  bbox[0] = annotationData[4];
  bbox[1] = annotationData[5];
  bbox[2] = annotationData[6] - annotationData[4];
  bbox[3] = annotationData[7] - annotationData[5];
  shapeObj.coordinates.bbox = bbox;
  shapeObj.coordinates.class = annotationData[3].toString();
  shapeObj.type = 'boundingBox';
  shapes.boundingBoxes.push(shapeObj);
}

function getShapes(datasetObject, validImages) {
  const shapes = { boundingBoxes: [], polygons: [] };
  const { annotationData } = datasetObject[ACTIVE_ANNOTATION_FILE].body;
  validImages.forEach((validImage) => {
    for (let i = 0; i < annotationData.length; i += 1) {
      const imageName = validImage.body.fileMetaData.name;
      if (imageName === annotationData[i][0]) {
        addNewShapeToArray(annotationData[i], imageName, shapes);
      }
    }
  });
  return shapes;
}

function getImages(imageFiles) {
  const images = [];
  Object.keys(imageFiles).forEach((key) => {
    if (!imageFiles[key].error) {
      images.push(imageFiles[key]);
    }
  });
  return images;
}

function assembleFinalObjectFromCSV() {
  const finalObject = { images: [], shapes: [] };
  const datasetObject = datasetObjectManager.getDatasetObject();
  finalObject.images = getImages(datasetObject[IMAGE_FILES_OBJECT]);
  finalObject.shapes = getShapes(datasetObject, finalObject.images);
  return finalObject;
}

export { assembleFinalObjectFromCSV as default };
