import datasetObjectManager from '../datasetObjectManagers/COCOJSONDatasetObjectManager';
import { IMAGE_FILES_OBJECT, ACTIVE_ANNOTATION_FILE } from '../../../consts';

function assembleNewFinalShape(annotationData, datasetObject, imageName, shapes) {
  const shapeObj = {
    type: null, coordinates: {}, imageName,
  };
  const { categories } = datasetObject[ACTIVE_ANNOTATION_FILE].body.annotationData;
  for (let i = 0; i < categories.length; i += 1) {
    if (annotationData.category_id === categories[i].id) {
      shapeObj.coordinates.class = categories[i].name.toString();
      break;
    }
  }
  if (annotationData.segmentation.length === 1) {
    shapeObj.coordinates.points = annotationData.segmentation[0];
    shapeObj.type = 'polygon';
    shapes.polygons.push(shapeObj);
  } else {
    shapeObj.coordinates.bbox = annotationData.bbox;
    shapeObj.type = 'boundingBox';
    shapes.boundingBoxes.push(shapeObj);
  }
}

function addShapeToShapesArray(imageId, annotations, shapes, datasetObject, imageName) {
  for (let i = 0; i < annotations.length; i += 1) {
    if (imageId === annotations[i].image_id) {
      assembleNewFinalShape(annotations[i], datasetObject, imageName, shapes);
    }
  }
}

function getShapes(datasetObject, validImages) {
  const shapes = { boundingBoxes: [], polygons: [] };
  const { annotations, images } = datasetObject[ACTIVE_ANNOTATION_FILE].body.annotationData;
  validImages.forEach((validImage) => {
    for (let i = 0; i < images.length; i += 1) {
      const imageName = validImage.body.fileMetaData.name;
      if (imageName === images[i].file_name) {
        addShapeToShapesArray(images[i].id, annotations, shapes, datasetObject, imageName);
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

function assembleFinalObjectFromCOCOJSON() {
  const finalObject = { images: [], shapes: [] };
  const datasetObject = datasetObjectManager.getDatasetObject();
  finalObject.images = getImages(datasetObject[IMAGE_FILES_OBJECT]);
  finalObject.shapes = getShapes(datasetObject, finalObject.images);
  return finalObject;
}

export { assembleFinalObjectFromCOCOJSON as default };
