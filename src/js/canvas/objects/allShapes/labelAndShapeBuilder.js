import fabric from 'fabric';
import { addLabelRef, setPolygonLabelOffsetProps } from '../label/label';
import labelProperties from '../label/properties';
import { addNewLabelToListFromPopUp, addExistingLabelToList } from '../../../tools/labelList/labelList';
import { resizeAllPassedObjectsDimensionsBySingleScale, resizeLabelDimensionsBySingleScale } from '../objectsProperties/changeProperties';
import { addToLabelOptions, getLabelColor } from '../../../tools/labelList/labelOptions';
import { getLabelsVisibilityState, getMovableObjectsState, getContinuousDrawingState } from '../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';
import { addShape, addExistingShape, addShapeForNotSelectedImage } from './allShapes';

let currentId = 0;
let canvas = null;

function findInitialLabelLocation(shape) {
  const locationObj = {};
  if (shape.shapeName === 'bndBox') {
    locationObj.left = shape.left + labelProperties.boundingBoxOffsetProperties().left;
    locationObj.top = shape.top;
  } else if (shape.shapeName === 'polygon') {
    const left = shape.points[0].x - labelProperties.pointOffsetProperties().left;
    const top = shape.points[0].y - labelProperties.pointOffsetProperties().top;
    locationObj.left = left;
    locationObj.top = top;
    setPolygonLabelOffsetProps(shape, shape.points[0]);
  }
  return locationObj;
}

function generateLabel(label) {
  label.visible = getLabelsVisibilityState();
  canvas.add(label);
  canvas.bringToFront(label);
}

function populateImageProperties(image, shapeRefObject, label, id) {
  image.shapes[id] = shapeRefObject;
  image.labels[id] = label;
}

function generateLabelShapeGroup(shape, text, image) {
  shape.set('id', currentId);
  shape.set('shapeLabelText', text);
  const initialLocation = findInitialLabelLocation(shape);
  const textShape = new fabric.Text(text,
    labelProperties.getLabelProps(initialLocation, shape.shapeName));
  addToLabelOptions(textShape.text);
  const shapeColor = getLabelColor(textShape.text);
  addLabelRef(textShape, currentId);
  // sending image reference when not current image
  if (image) {
    const shapeRefObject = addShapeForNotSelectedImage(shape, shapeColor);
    populateImageProperties(image, shapeRefObject, textShape, currentId);
  } else {
    generateLabel(textShape);
    addShape(shape, shapeColor, currentId);
    addNewLabelToListFromPopUp(textShape.text, currentId, shapeColor.label);
  }
  currentId += 1;
}

// a change will need to be made here
function repopulateLabelShapeGroup(shapeObj, label, id, newFileSizeRatio) {
  const shape = shapeObj.shapeRef;
  resizeAllPassedObjectsDimensionsBySingleScale(shape, newFileSizeRatio);
  canvas.add(shapeObj.shapeRef);
  resizeLabelDimensionsBySingleScale(label, newFileSizeRatio);
  generateLabel(label);
  addExistingShape(shapeObj, id);
  addLabelRef(label, id);
  const shapeColor = getLabelColor(shapeObj.shapeRef.shapeLabelText);
  addExistingLabelToList(shapeObj.shapeRef.shapeLabelText, id,
    shapeColor.label, shapeObj.visibility);
}

function calculateNewImageHeightRatio(previousDimensions) {
  return canvas.height / previousDimensions.originalHeight;
}

function repopulateHiddenImageObjects(newImageDimensions, existingShapes, existingLabels) {
  const newFileSizeRatio = canvas.height / newImageDimensions.height;
  const newPolygonOffsetProperties = { width: newFileSizeRatio, height: newFileSizeRatio };
  labelProperties.setPolygonOffsetProperties(newPolygonOffsetProperties);
  Object.keys(existingShapes).forEach((key) => {
    repopulateLabelShapeGroup(existingShapes[key], existingLabels[key], key, newFileSizeRatio);
  });
}

function repopulateVisibleImageObjects(previousDimensions, existingShapes, existingLabels) {
  const newFileSizeRatio = calculateNewImageHeightRatio(previousDimensions)
    / previousDimensions.oldImageHeightRatio;
  const newPolygonOffsetProperties = {
    width: newFileSizeRatio * previousDimensions.polygonOffsetLeft,
    height: newFileSizeRatio * previousDimensions.polygonOffsetTop,
  };
  labelProperties.setPolygonOffsetProperties(newPolygonOffsetProperties);
  Object.keys(existingShapes).forEach((key) => {
    repopulateLabelShapeGroup(existingShapes[key], existingLabels[key], key, newFileSizeRatio);
  });
  canvas.renderAll();
}

function repopulateLabelAndShapeObjects(existingShapes, existingLabels,
  previousDimensions, newImageDimensions) {
  if (previousDimensions && previousDimensions.originalHeight) {
    repopulateVisibleImageObjects(previousDimensions, existingShapes, existingLabels);
  } else if (Object.keys(existingShapes).length > 0) {
    repopulateHiddenImageObjects(newImageDimensions, existingShapes, existingLabels);
  }
}

function setShapeMovablePropertiesOnImageSelect(existingShapes) {
  if (!getContinuousDrawingState()) {
    if (getMovableObjectsState()) {
      Object.keys(existingShapes).forEach((key) => {
        const shape = existingShapes[key].shapeRef;
        shape.lockMovementX = false;
        shape.lockMovementY = false;
        shape.hoverCursor = 'move';
      });
    } else {
      Object.keys(existingShapes).forEach((key) => {
        const shape = existingShapes[key].shapeRef;
        shape.lockMovementX = true;
        shape.lockMovementY = true;
        shape.hoverCursor = 'default';
      });
    }
  }
}

function assignCanvasForLabelAndShapeBuilder(canvasObj) {
  canvas = canvasObj;
}

export {
  assignCanvasForLabelAndShapeBuilder, setShapeMovablePropertiesOnImageSelect,
  generateLabelShapeGroup, findInitialLabelLocation, repopulateLabelAndShapeObjects,
};
