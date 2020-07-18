const numberOfShapeTypes = { polygons: 0, boundingBoxes: 0 };

function incrementShapeType(shapeObj) {
  if (shapeObj.shapeName === 'polygon') {
    numberOfShapeTypes.polygons += 1;
  } else if (shapeObj.shapeName === 'bndBox') {
    numberOfShapeTypes.boundingBoxes += 1;
  }
}

function decrementShapeType(shapeObj) {
  if (shapeObj.shapeName === 'polygon') {
    numberOfShapeTypes.polygons -= 1;
  } else if (shapeObj.shapeName === 'bndBox') {
    numberOfShapeTypes.boundingBoxes -= 1;
  }
}

function getNumberOfShapeTypes() {
  return numberOfShapeTypes;
}

export { incrementShapeType, decrementShapeType, getNumberOfShapeTypes };
