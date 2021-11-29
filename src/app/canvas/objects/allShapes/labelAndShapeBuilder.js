// import fabric from 'fabric.js';
import { addLabelRef, setPolygonLabelOffsetProps } from '../label/label.js';
import labelProperties from '../label/properties.js';
import { addNewLabelToListFromPopup, addExistingLabelToList } from '../../../tools/labelList/labelList.js';
import { resizeAllPassedObjectsDimensionsBySingleScale, resizeLabelDimensionsBySingleScale } from '../objectsProperties/changeProperties.js';
import { addToLabelOptions, getLabelColor } from '../../../tools/labelList/labelOptions.js';
import { getLabelsVisibilityState } from '../../../tools/state.js';
import { addShape, addExistingShape, addShapeForInvisibleImage } from './allShapes.js';
import { preventOutOfBoundsOnNewObject } from '../sharedUtils/newObjectBlockers.js';
import { preprocessLabelText } from '../../../tools/utils/textProcessingUtils.js';
import { setPolygonEditingButtonsToDefault, setRemoveLabelsButtonToDisabled } from '../../../tools/toolkit/styling/state.js';

let currentId = 0;
let canvas = null;

function setShapeEditingIcons(shape) {
  if (shape.shapeName === 'polygon') {
    setPolygonEditingButtonsToDefault();
    setRemoveLabelsButtonToDisabled();
  }
}

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

function generateLabel(label, objectVisibility) {
  label.visible = (objectVisibility === undefined || objectVisibility)
    && getLabelsVisibilityState();
  label.setVisibilityButtonActiveFlagById = false;
  canvas.add(label);
  canvas.bringToFront(label);
}

function populateImageProperties(image, shapeRefObject, label, id) {
  image.shapes[id] = shapeRefObject;
  image.labels[id] = label;
}

function replaceCurrentShapeColourPropertiesWithMLPallette(shape) {
  shape.set('isGeneratedViaML', true);
  shape.set('MLPallette', true);
  shape.set('trueFill', shape.fill);
  shape.set('trueStroke', shape.stroke);
  shape.set('fill', 'rgb(88, 202, 75, 0.3)');
  shape.set('stroke', 'rgb(88, 202, 75)');
}

function generateLabelShapeGroup(shape, text, image, isUsingMachineLearning) {
  const preprocessedText = preprocessLabelText(text);
  shape.set('id', currentId);
  shape.set('shapeLabelText', preprocessedText);
  const initialLocation = findInitialLabelLocation(shape);
  const textShape = new fabric.Text(preprocessedText,
    labelProperties.getLabelProps(initialLocation, shape.shapeName));
  addToLabelOptions(textShape.text);
  const shapeColor = getLabelColor(textShape.text);
  addLabelRef(textShape, currentId);
  // sending image reference when not current image
  if (image) {
    const shapeRefObject = addShapeForInvisibleImage(shape, shapeColor);
    populateImageProperties(image, shapeRefObject, textShape, currentId);
  } else {
    generateLabel(textShape);
    addShape(shape, shapeColor, currentId);
    addNewLabelToListFromPopup(textShape.text, currentId, shapeColor.label);
  }
  setShapeEditingIcons(shape);
  if (isUsingMachineLearning) {
    replaceCurrentShapeColourPropertiesWithMLPallette(shape);
  }
  currentId += 1;
}

function repopulateLabelShapeGroup(shapeObj, label, id, newFileSizeRatio) {
  canvas.add(shapeObj.shapeRef);
  resizeLabelDimensionsBySingleScale(label, newFileSizeRatio);
  generateLabel(label, shapeObj.visibility);
  addExistingShape(shapeObj, id);
  addLabelRef(label, id);
  const shapeColor = getLabelColor(shapeObj.shapeRef.shapeLabelText);
  addExistingLabelToList(shapeObj.shapeRef.shapeLabelText, id,
    shapeColor.label, shapeObj.visibility);
}

function repopulateVisibleLabelShapeGroup(shapeObj, label, id, newFileSizeRatio) {
  resizeAllPassedObjectsDimensionsBySingleScale(shapeObj.shapeRef, newFileSizeRatio);
  repopulateLabelShapeGroup(shapeObj, label, id, newFileSizeRatio);
}

function repopoulateHiddenLabelShapeGroup(shapeObj, label, id,
  imageDimensions, newFileSizeRatio) {
  resizeAllPassedObjectsDimensionsBySingleScale(shapeObj.shapeRef, newFileSizeRatio);
  const imageScalingDimensions = { scaleX: newFileSizeRatio, scaleY: newFileSizeRatio };
  const imageLengthDimensions = {
    height: imageDimensions.originalHeight, width: imageDimensions.originalWidth,
  };
  preventOutOfBoundsOnNewObject(shapeObj.shapeRef, imageScalingDimensions, imageLengthDimensions);
  repopulateLabelShapeGroup(shapeObj, label, id, newFileSizeRatio);
}

function calculateNewImageHeightRatio(imageDimensions) {
  return canvas.height / imageDimensions.originalHeight;
}

function repopulateHiddenImageObjects(newImageDimensions, existingShapes, existingLabels) {
  const imageDimensions = {
    originalHeight: newImageDimensions.height,
    originalWidth: newImageDimensions.width,
  };
  const newFileSizeRatio = calculateNewImageHeightRatio(imageDimensions);
  const newPolygonOffsetProperties = { width: newFileSizeRatio, height: newFileSizeRatio };
  labelProperties.setPolygonOffsetProperties(newPolygonOffsetProperties);
  Object.keys(existingShapes).forEach((key) => {
    repopoulateHiddenLabelShapeGroup(existingShapes[key], existingLabels[key], key,
      imageDimensions, newFileSizeRatio);
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
    repopulateVisibleLabelShapeGroup(existingShapes[key], existingLabels[key], key,
      newFileSizeRatio);
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

function assignCanvasForLabelAndShapeBuilder(canvasObj) {
  canvas = canvasObj;
}

export {
  assignCanvasForLabelAndShapeBuilder, generateLabelShapeGroup,
  findInitialLabelLocation, repopulateLabelAndShapeObjects,
};
