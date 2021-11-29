import datasetObjectManager from '../datasetObjectManagers/VOCXMLDatasetObjectManager.js';
import { IMAGE_FILES_OBJECT, VALID_ANNOTATION_FILES_ARRAY } from '../../../consts.js';

function assembleShape(object, shapes, imageName) {
  const shapeObj = { type: null, coordinates: {}, imageName };
  const bbox = [];
  bbox[0] = parseInt(object.bndbox.xmin['#text'], 10);
  bbox[1] = parseInt(object.bndbox.ymin['#text'], 10);
  bbox[2] = parseInt(object.bndbox.xmax['#text'], 10) - parseInt(object.bndbox.xmin['#text'], 10);
  bbox[3] = parseInt(object.bndbox.ymax['#text'], 10) - parseInt(object.bndbox.ymin['#text'], 10);
  shapeObj.coordinates.bbox = bbox;
  shapeObj.coordinates.class = object.name['#text'].toString();
  shapeObj.type = 'boundingBox';
  shapes.boundingBoxes.push(shapeObj);
}

function assembleShapes(objects, shapes, imageName) {
  if (Array.isArray(objects)) {
    for (let i = 0; i < objects.length; i += 1) {
      assembleShape(objects[i], shapes, imageName);
    }
  } else {
    assembleShape(objects, shapes, imageName);
  }
}

function getShapes(datasetObject, validImages) {
  const shapes = { boundingBoxes: [], polygons: [] };
  validImages.forEach((validImage) => {
    const imageName = validImage.body.fileMetaData.name;
    const parsedImageName = imageName.substring(0, imageName.indexOf('.'));
    for (let i = 0; i < datasetObject[VALID_ANNOTATION_FILES_ARRAY].length; i += 1) {
      const annotationName = datasetObject[VALID_ANNOTATION_FILES_ARRAY][i].body.fileMetaData.name;
      const parsedAnnotationName = annotationName.substring(0, annotationName.indexOf('.'));
      if (parsedImageName === parsedAnnotationName) {
        const { object } = datasetObject[VALID_ANNOTATION_FILES_ARRAY][i].body
          .annotationData.annotation;
        assembleShapes(object, shapes, imageName);
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

function assembleFinalObjectFromVOCXML() {
  const finalObject = { images: [], shapes: [] };
  const datasetObject = datasetObjectManager.getDatasetObject();
  finalObject.images = getImages(datasetObject[IMAGE_FILES_OBJECT]);
  finalObject.shapes = getShapes(datasetObject, finalObject.images);
  return finalObject;
}

export { assembleFinalObjectFromVOCXML as default };
