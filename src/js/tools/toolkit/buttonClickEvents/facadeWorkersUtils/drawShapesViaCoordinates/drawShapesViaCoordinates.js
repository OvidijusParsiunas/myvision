import { getAllImageData, getCurrentlySelectedImageId } from '../../../../imageList/imageList';
import { getImageProperties } from '../uploadFile/drawImageOnCanvas';
import { prepareCanvasForNewBoundingBoxesWithMachineLearning, createNewBoundingBoxFromCoordinates } from '../../../../../canvas/objects/boundingBox/boundingBox';
// import { addExistingShape } from '../../../../../canvas/objects/allShapes/allShapes';
import { generateLabelShapeGroup } from '../../../../../canvas/objects/allShapes/labelAndShapeBuilder';
import { resetCanvasEventsToDefault } from '../../facade';
import { setDefaultCursorMode } from '../../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import { resetPopUpLabelOptions } from '../../../../labellerPopUp/style';
import { setPopupLabelOptionsIndexToZero } from '../../../../labellerPopUp/buttonEventHandlers';

let canvas = null;

function captureCurrentImageData(allImageData, currentlySelectedImageId) {
  const currentlySelectedImageProperties = getImageProperties();
  const imageDimensions = {};
  imageDimensions.scaleX = currentlySelectedImageProperties.scaleX;
  imageDimensions.scaleY = currentlySelectedImageProperties.scaleY;
  allImageData[currentlySelectedImageId].imageDimensions = imageDimensions;
}

function getImageDimensions(image) {
  if (image && image.imageDimensions && Object.keys(image.imageDimensions).length > 0) {
    return image.imageDimensions;
  }
  return { scaleX: 1, scaleY: 1 };
}

function drawShapesViaCoordinates(predictedShapeCoordinatesForImages) {
  const currentlySelectedImageId = getCurrentlySelectedImageId();
  const allImageData = getAllImageData();
  captureCurrentImageData(allImageData, currentlySelectedImageId);
  prepareCanvasForNewBoundingBoxesWithMachineLearning(canvas);
  Object.keys(predictedShapeCoordinatesForImages).forEach((key) => {
    const image = allImageData[key];
    const imageDimensions = getImageDimensions(image);
    const predictedShapeCoordinates = predictedShapeCoordinatesForImages[key];
    predictedShapeCoordinates.forEach((shapeCoordinates) => {
      const boundingBoxShape = createNewBoundingBoxFromCoordinates(shapeCoordinates.bbox[0],
        shapeCoordinates.bbox[1],
        shapeCoordinates.bbox[2],
        shapeCoordinates.bbox[3],
        imageDimensions);
      if (currentlySelectedImageId === parseInt(key, 10)) {
        generateLabelShapeGroup(boundingBoxShape, shapeCoordinates.class);
        canvas.add(boundingBoxShape);
      } else {
        generateLabelShapeGroup(boundingBoxShape, shapeCoordinates.class, image);
      }
    });
  });
  // only execute these two if new shapes have been created
  resetPopUpLabelOptions();
  setPopupLabelOptionsIndexToZero();

  setDefaultCursorMode(canvas);
  resetCanvasEventsToDefault();

  // the JUST generated bounding boxes should not be movable when disabled
  // Check if the newImageDimensions are correct using height only
}

function assignCanvasForDrawingShapesViaCoordinates(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForDrawingShapesViaCoordinates, drawShapesViaCoordinates };
