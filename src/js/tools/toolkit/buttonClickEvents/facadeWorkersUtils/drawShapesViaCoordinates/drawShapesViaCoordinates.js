import { getAllImageData, getCurrentlySelectedImageId } from '../../../../imageList/imageList';
import { getImageProperties } from '../uploadFile/drawImageOnCanvas';
import { prepareCanvasForNewBoundingBox, createNewBoundingBoxFromCoordinates } from '../../../../../canvas/objects/boundingBox/boundingBox';
// import { addExistingShape } from '../../../../../canvas/objects/allShapes/allShapes';

let canvas = null;

function captureCurrentImageData(allImageData) {
  const currentlySelectedImageId = getCurrentlySelectedImageId();
  const currentlySelectedImageProperties = getImageProperties();
  const imageDimensions = {};
  imageDimensions.scaleX = currentlySelectedImageProperties.scaleX;
  imageDimensions.scaleY = currentlySelectedImageProperties.scaleY;
  allImageData[currentlySelectedImageId].imageDimensions = imageDimensions;
}

function drawShapesViaCoordinates(predictedImageCoordinates) {
  const allImageData = getAllImageData();
  console.log(allImageData);
  captureCurrentImageData(allImageData);
  prepareCanvasForNewBoundingBox(canvas);
  Object.keys(predictedImageCoordinates).forEach((key) => {
    const { imageDimensions } = allImageData[key];
    const imageObjects = predictedImageCoordinates[key];
    imageObjects.forEach((shapeCoordinates) => {
      createNewBoundingBoxFromCoordinates(shapeCoordinates.bbox[0],
        shapeCoordinates.bbox[1],
        shapeCoordinates.bbox[2],
        shapeCoordinates.bbox[3],
        imageDimensions);
    });
  });
}

function assignCanvasForDrawingShapesViaCoordinates(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForDrawingShapesViaCoordinates, drawShapesViaCoordinates };
