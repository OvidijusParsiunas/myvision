import { setDefaultImageThumbnailHighlightToMLSelected, getAllImageData, setDefaultImageThumbnailHighlightToML } from '../../../../imageList/imageList';
import { getImageProperties } from '../uploadFile/drawImageOnCanvas';
import { prepareCanvasForNewBoundingBoxesWithMachineLearning, createNewBoundingBoxFromCoordinates } from '../../../../../canvas/objects/boundingBox/boundingBox';
import { generateLabelShapeGroup } from '../../../../../canvas/objects/allShapes/labelAndShapeBuilder';
import initiateResetCanvasEventsToDefaultEvent from '../../facadeWorkers/resetCanvasEventsToDefaultWorker';
import { setDefaultCursorMode } from '../../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import { resetShapeLabellerModalOptions } from '../../../../shapeLabellerModal/style';
import { getCurrentImageId } from '../stateManager';
import { removeBoundingBox } from '../../facadeWorkers/removeActiveShapeWorker';
import { getAllExistingShapes } from '../../../../../canvas/objects/allShapes/allShapes';
import { getNumberOfShapeTypes } from '../../../../globalStatistics/globalStatistics';
import { getCanvasReferences } from '../../../../../canvas/utils/fabricUtils';
import assignDefaultEvents from '../../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import { repopulateDropdown } from '../../../../labelList/labelList';

let canvas = null;
const tempShapes = [];

function updateImageThumbnailStyle(isCurrentlySelectedImage, image) {
  if (!isCurrentlySelectedImage) {
    setDefaultImageThumbnailHighlightToML(image.thumbnailElementRef);
  } else {
    setDefaultImageThumbnailHighlightToMLSelected(image.thumbnailElementRef);
  }
}

function newLabelShapeGroup(boundingBoxShape, shapeCoordinates,
  isCurrentlySelectedImage, isUsingMachineLearning, image) {
  if (isCurrentlySelectedImage) {
    generateLabelShapeGroup(boundingBoxShape, shapeCoordinates.class,
      null, isUsingMachineLearning);
    canvas.add(boundingBoxShape);
  } else {
    generateLabelShapeGroup(boundingBoxShape, shapeCoordinates.class,
      image, isUsingMachineLearning);
  }
}

function generateNewBoundingBox(shapeCoordinates, imageDimensions) {
  const boundingBoxShape = createNewBoundingBoxFromCoordinates(
    shapeCoordinates.bbox[0],
    shapeCoordinates.bbox[1],
    shapeCoordinates.bbox[2],
    shapeCoordinates.bbox[3],
    imageDimensions,
  );
  return boundingBoxShape;
}

function generateNewShapes(image, isCurrentlySelectedImage, predictedShapeCoordinates,
  imageDimensions, isUsingMachineLearning) {
  predictedShapeCoordinates.forEach((shapeCoordinates) => {
    const boundingBox = generateNewBoundingBox(shapeCoordinates, imageDimensions, image,
      isCurrentlySelectedImage, isUsingMachineLearning);
    newLabelShapeGroup(boundingBox, shapeCoordinates, isCurrentlySelectedImage,
      isUsingMachineLearning, image);
  });
  image.numberOfMLGeneratedShapes = predictedShapeCoordinates.length;
}

function getImageDimensions(image) {
  if (image && image.imageDimensions && Object.keys(image.imageDimensions).length > 0) {
    return image.imageDimensions;
  }
  return { scaleX: 1, scaleY: 1 };
}

function removeMLShapesOnImage(imageData, currentImage) {
  const shapes = currentImage ? getAllExistingShapes() : imageData.shapes;
  Object.keys(shapes).forEach((key) => {
    const shape = shapes[key].shapeRef;
    if (shape.isGeneratedViaML) {
      if (currentImage) {
        removeBoundingBox(canvas, shape);
      } else {
        delete shapes[key];
      }
    }
  });
  canvas.renderAll();
  imageData.numberOfMLGeneratedShapes = 0;
}

function generateNewShapesForImages(predictedShapeCoordinatesForImages, allImageData,
  currentlySelectedImageId, isUsingMachineLearning) {
  removeMLShapesOnImage(allImageData[currentlySelectedImageId], true);
  Object.keys(predictedShapeCoordinatesForImages).forEach((key) => {
    removeMLShapesOnImage(allImageData[key]);
    const image = allImageData[key];
    const imageDimensions = getImageDimensions(image);
    const isCurrentlySelectedImage = currentlySelectedImageId === parseInt(key, 10);
    const predictedShapeCoordinates = predictedShapeCoordinatesForImages[key];
    if (predictedShapeCoordinates.length > 0) {
      generateNewShapes(image, isCurrentlySelectedImage, predictedShapeCoordinates,
        imageDimensions, isUsingMachineLearning);
    }
  });
}

function captureCurrentImageData(allImageData, currentlySelectedImageId) {
  const currentlySelectedImageProperties = getImageProperties();
  const imageDimensions = {};
  imageDimensions.scaleX = currentlySelectedImageProperties.scaleX;
  imageDimensions.scaleY = currentlySelectedImageProperties.scaleY;
  allImageData[currentlySelectedImageId].imageDimensions = imageDimensions;
}

function getImageData() {
  const allImageData = getAllImageData();
  const currentlySelectedImageId = getCurrentImageId();
  return { allImageData, currentlySelectedImageId };
}

function updateImageThumbnails(predictedShapeCoordinatesForImages) {
  const { allImageData, currentlySelectedImageId } = getImageData();
  Object.keys(predictedShapeCoordinatesForImages).forEach((key) => {
    const predictedShapeCoordinates = predictedShapeCoordinatesForImages[key];
    if (predictedShapeCoordinates.length > 0) {
      const isCurrentlySelectedImage = currentlySelectedImageId === parseInt(key, 10);
      const image = allImageData[key];
      updateImageThumbnailStyle(isCurrentlySelectedImage, image);
    }
  });
}

function generateTempShapes(predictedShapeCoordinates,
  imageDimensions) {
  predictedShapeCoordinates.forEach((shapeCoordinates) => {
    const boundingBox = generateNewBoundingBox(shapeCoordinates, imageDimensions);
    tempShapes.push(boundingBox);
    canvas.add(boundingBox);
  });
}

function removeTempShapes() {
  tempShapes.forEach((shape) => {
    canvas.remove(shape);
  });
  canvas.renderAll();
}

function prepareToDrawShapes(allImageData, currentlySelectedImageId) {
  captureCurrentImageData(allImageData, currentlySelectedImageId);
  prepareCanvasForNewBoundingBoxesWithMachineLearning(canvas);
}

function drawTempShapesToShowCaseMLResults(predictedShapeCoordinatesForImages) {
  const { allImageData, currentlySelectedImageId } = getImageData();
  prepareToDrawShapes(allImageData, currentlySelectedImageId);
  const currentlySelectedImageShapes = predictedShapeCoordinatesForImages[currentlySelectedImageId];
  const dimensions = getImageDimensions(allImageData[currentlySelectedImageId]);
  generateTempShapes(currentlySelectedImageShapes, dimensions);
}

// fix for a bug where the newly generated shapes would not adhere to
// the boundaries when scaling
function assignCanvasEvents() {
  if (getNumberOfShapeTypes().boundingBoxes === 0) {
    const { canvas1 } = getCanvasReferences();
    assignDefaultEvents(canvas1, null, false);
  }
}

function drawShapesViaCoordinates(predictedShapeCoordinatesForImages, isUsingMachineLearning) {
  const { allImageData, currentlySelectedImageId } = getImageData();
  assignCanvasEvents();
  prepareToDrawShapes(allImageData, currentlySelectedImageId);
  generateNewShapesForImages(predictedShapeCoordinatesForImages, allImageData,
    currentlySelectedImageId, isUsingMachineLearning);
  repopulateDropdown();
  removeTempShapes();
  // only execute this if new shapes have been created (not for the ML PopUp)
  resetShapeLabellerModalOptions();

  setDefaultCursorMode(canvas);
  initiateResetCanvasEventsToDefaultEvent(canvas);

  // check bugs with label list options order after ML
  // check how fast the labelling is, what if the user cancels half way through,
  // do you undo the labels that
  // have been generated? You will have to. Have an option to continue.
  // Check if the newImageDimensions are correct using height only
}

function assignCanvasForDrawingShapesViaCoordinates(canvasObj) {
  canvas = canvasObj;
}

export {
  assignCanvasForDrawingShapesViaCoordinates, drawShapesViaCoordinates,
  drawTempShapesToShowCaseMLResults, updateImageThumbnails,
};
