import { getDatasetObject } from '../datasetObjectManagers/COCOJSONDatasetObjectManager';
import { getNamesOfImagesWithNoErrors } from '../style';

function assembleNewFinalShape(annotationData, datasetObject) {
  const shapeObj = { type: null, labelName: null, coordinates: {} };
  if (annotationData.segmentation.length === 1) {
    shapeObj.type = 'polygon';
    shapeObj.coordinates.points = annotationData.segmentation[0];
  } else {
    shapeObj.type = 'bbox';
    shapeObj.coordinates = annotationData.bbox;
  }
  const { categories } = datasetObject.activeAnnotationFile.body.annotationData;
  for (let i = 0; i < categories.length; i += 1) {
    if (annotationData.category_id === categories[i].id) {
      shapeObj.labelName = categories[i].name;
      break;
    }
  }
  return shapeObj;
}

function getShapes(datasetObject, validImages) {
  const shapes = [];
  const { annotations, images } = datasetObject.activeAnnotationFile.body.annotationData;
  validImages.forEach((validImage) => {
    for (let i = 0; i < images.length; i += 1) {
      if (validImage.fileMetaData.name === images[i].file_name) {
        const imageId = images[i].id;
        annotations.forEach((annotation) => {
          if (imageId === annotation.image_id) {
            shapes.push(assembleNewFinalShape(annotation, datasetObject));
          }
        });
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
