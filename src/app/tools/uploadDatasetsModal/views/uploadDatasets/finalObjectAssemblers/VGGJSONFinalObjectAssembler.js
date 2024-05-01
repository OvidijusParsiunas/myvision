import datasetObjectManager from '../datasetObjectManagers/VGGJSONDatasetObjectManager';

// assembleShapes function takes in regions, shapes, and imageName as parameters
// and loops through the regions to create shape objects with coordinates and type
function assembleShapes(regions, shapes, imageName) {
  for (let i = 0; i < regions.length; i += 1) {
    const shapeObj = {
      type: null, coordinates: {}, imageName, // Initialize shape object with type and coordinates properties
    };
    const region = regions[i];
    shapeObj.coordinates.class = region.region_attributes.name.toString(); // Set the class of the shape object
    if (region.shape_attributes.name === 'polygon') {
      const points = [];
      region.shape_attributes.all_points_x.forEach((x, index) => {
        points.push(x);
        points.push(region.shape_attributes.all_points_y[index]);
      });
      shapeObj.coordinates.points = points; // Set the points of the polygon shape object
      shapeObj.type = 'polygon'; // Set the type of the shape object to polygon
      shapes.polygons.push(shapeObj); // Add the polygon shape object to the polygons array
    } else {
      const bbox = [];
      bbox[0] = region.shape_attributes.x;
      bbox[1] = region.shape_attributes.y;
      bbox[2] = region.shape_attributes.width;
      bbox[3] = region.shape_attributes.height;
      shapeObj.coordinates.bbox = bbox; // Set the bounding box of the shape object
      shapeObj.type = 'boundingBox'; // Set the type of the shape object to bounding box
      shapes.boundingBoxes.push(shapeObj); // Add the bounding box shape object to the boundingBoxes array
    }
  }
}

// getShapes function takes in datasetObject and validImages as parameters
// and loops through the validImages to extract the shapes for each image
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

// getImages function takes in imageFiles as parameter
// and filters out the error-free image objects
function getImages(imageFiles) {
  const images = [];
  Object.keys(imageFiles).forEach((key) => {
    if (!imageFiles[key].error) {
      images.push(imageFiles[key]);
    }
  });
  return images;
}

// assembleFinalObjectFromVGGJSON function creates the final object by
// extracting images and shapes from the dataset object
function assembleFinalObjectFromVGGJSON() {
  const finalObject = { images: [], shapes: [] };
  const datasetObject = datasetObjectManager.getDatasetObject();
  finalObject.images = getImages(datasetObject[IMAGE_FILES_OBJECT]);
  finalObject.shapes = getShapes(datasetObject, finalObject.images);
  return finalObject;
}

// Export the assembleFinalObjectFromVGGJSON function as the default export
export { assembleFinalObjectFromVGGJSON as default };
