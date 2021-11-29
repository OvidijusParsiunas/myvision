import datasetObjectManager from '../datasetObjectManagers/VGGJSONDatasetObjectManager.js';
import { IMAGE_FILES_OBJECT, ACTIVE_ANNOTATION_FILE } from '../../../consts.js';

function assembleShapes(regions, shapes, imageName) {
  for (let i = 0; i < regions.length; i += 1) {
    const shapeObj = {
      type: null, coordinates: {}, imageName,
    };
    const region = regions[i];
    shapeObj.coordinates.class = region.region_attributes.name.toString();
    if (region.shape_attributes.name === 'polygon') {
      const points = [];
      region.shape_attributes.all_points_x.forEach((x, index) => {
        points.push(x);
        points.push(region.shape_attributes.all_points_y[index]);
      });
      shapeObj.coordinates.points = points;
      shapeObj.type = 'polygon';
      shapes.polygons.push(shapeObj);
    } else {
      const bbox = [];
      bbox[0] = region.shape_attributes.x;
      bbox[1] = region.shape_attributes.y;
      bbox[2] = region.shape_attributes.width;
      bbox[3] = region.shape_attributes.height;
      shapeObj.coordinates.bbox = bbox;
      shapeObj.type = 'boundingBox';
      shapes.boundingBoxes.push(shapeObj);
    }
  }
}

function getShapes(datasetObject, validImages) {
  const shapes = { boundingBoxes: [], polygons: [] };
  const annotationObjects = datasetObject[ACTIVE_ANNOTATION_FILE].body.annotationData;
  validImages.forEach((validImage) => {
    for (let i = 0; i < Object.keys(annotationObjects).length; i += 1) {
      const imageName = validImage.body.fileMetaData.name;
      if (imageName === annotationObjects[Object.keys(annotationObjects)[i]].filename) {
        const { regions } = annotationObjects[Object.keys(annotationObjects)[i]];
        assembleShapes(regions, shapes, imageName);
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

function assembleFinalObjectFromVGGJSON() {
  const finalObject = { images: [], shapes: [] };
  const datasetObject = datasetObjectManager.getDatasetObject();
  finalObject.images = getImages(datasetObject[IMAGE_FILES_OBJECT]);
  finalObject.shapes = getShapes(datasetObject, finalObject.images);
  return finalObject;
}

export { assembleFinalObjectFromVGGJSON as default };
