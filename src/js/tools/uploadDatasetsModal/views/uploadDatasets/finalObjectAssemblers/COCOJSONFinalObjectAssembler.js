import { getDatasetObject } from '../datasetObjectManagers/COCOJSONDatasetObjectManager';
import { getNamesOfImagesWithNoErrors } from '../style';

function assembleNewFinalShape(annotationData, datasetObject, imageName, shapes) {
  const shapeObj = {
    type: null, labelName: null, coordinates: {}, imageName,
  };
  const { categories } = datasetObject.activeAnnotationFile.body.annotationData;
  for (let i = 0; i < categories.length; i += 1) {
    if (annotationData.category_id === categories[i].id) {
      shapeObj.labelName = categories[i].name;
      break;
    }
  }
  if (annotationData.segmentation.length === 1) {
    shapeObj.coordinates.class = 'polygon';
    shapeObj.coordinates.points = annotationData.segmentation[0];
    shapes.polygons.push(shapeObj);
  } else {
    shapeObj.coordinates.class = 'bbox';
    shapeObj.coordinates.bbox = annotationData.bbox;
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
  const { annotations, images } = datasetObject.activeAnnotationFile.body.annotationData;
  validImages.forEach((validImage) => {
    for (let i = 0; i < images.length; i += 1) {
      const imageName = validImage.fileMetaData.name;
      if (imageName === images[i].file_name) {
        addShapeToShapesArray(images[i].id, annotations, shapes, datasetObject, imageName);
      }
    }
  });
  return shapes;
}

function getImages(datasetObject) {
  const images = [];
  const validImageNames = getNamesOfImagesWithNoErrors();
  validImageNames.forEach((validImageName) => {
    for (let i = 0; i < datasetObject.imageFiles.length; i += 1) {
      const imageFileName = datasetObject.imageFiles[i].body.fileMetaData.name;
      if (imageFileName === validImageName) {
        images.push(datasetObject.imageFiles[i].body);
        break;
      }
    }
  });
  return images;
}

function assembleFinalObjectFromCOCOJSON() {
  const finalObject = { images: [], shapes: [] };
  const COCOJSONDatasetObject = getDatasetObject();
  finalObject.images = getImages(COCOJSONDatasetObject);
  finalObject.shapes = getShapes(COCOJSONDatasetObject, finalObject.images);
  return finalObject;
}

export { assembleFinalObjectFromCOCOJSON as default };
