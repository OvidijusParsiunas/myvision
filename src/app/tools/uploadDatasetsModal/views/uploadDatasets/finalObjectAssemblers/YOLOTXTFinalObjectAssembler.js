import datasetObjectManager from '../datasetObjectManagers/YOLOTXTDatasetObjectManager.js';
import {
  IMAGE_FILES_OBJECT, ACTIVE_CLASSES_FILE, VALID_ANNOTATION_FILES_ARRAY,
} from '../../../consts.js';

function assembleShape(object, shapes, imageName, classes, imageElement) {
  const shapeObj = { type: null, coordinates: {}, imageName };
  const bbox = [];
  const { width, height } = imageElement;
  bbox[0] = (object[1] - object[3] / 2) * width;
  bbox[1] = (object[2] - object[4] / 2) * height;
  bbox[2] = object[3] * width;
  bbox[3] = object[4] * height;
  shapeObj.coordinates.bbox = bbox;
  shapeObj.coordinates.class = classes[object[0]][0].toString();
  shapeObj.type = 'boundingBox';
  shapes.boundingBoxes.push(shapeObj);
}

function assembleShapes(objects, shapes, imageName, classes, imageElement) {
  for (let i = 0; i < objects.length; i += 1) {
    assembleShape(objects[i], shapes, imageName, classes, imageElement);
  }
}

function getShapes(datasetObject, validImages) {
  const shapes = { boundingBoxes: [], polygons: [] };
  const classes = datasetObject[ACTIVE_CLASSES_FILE].body.annotationData;
  validImages.forEach((validImage) => {
    const imageName = validImage.body.fileMetaData.name;
    const { imageElement } = validImage.body;
    const parsedImageName = imageName.substring(0, imageName.indexOf('.'));
    for (let i = 0; i < datasetObject[VALID_ANNOTATION_FILES_ARRAY].length; i += 1) {
      const annotationName = datasetObject[VALID_ANNOTATION_FILES_ARRAY][i].body.fileMetaData.name;
      const parsedAnnotationName = annotationName.substring(0, annotationName.indexOf('.'));
      if (parsedImageName === parsedAnnotationName) {
        const objects = datasetObject[VALID_ANNOTATION_FILES_ARRAY][i].body.annotationData;
        assembleShapes(objects, shapes, imageName, classes, imageElement);
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

function assembleFinalObjectFromYOLOTXT() {
  const finalObject = { images: [], shapes: [] };
  const datasetObject = datasetObjectManager.getDatasetObject();
  finalObject.images = getImages(datasetObject[IMAGE_FILES_OBJECT]);
  finalObject.shapes = getShapes(datasetObject, finalObject.images);
  return finalObject;
}

export { assembleFinalObjectFromYOLOTXT as default };
