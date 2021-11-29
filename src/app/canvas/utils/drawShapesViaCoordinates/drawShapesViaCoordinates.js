import { getImageProperties } from '../../../tools/imageList/uploadImages/drawImageOnCanvas.js';
import { prepareCanvasForNewBoundingBoxesFromExternalSources, createNewBoundingBoxFromCoordinates } from '../../objects/boundingBox/boundingBox.js';
import { prepareCanvasForNewPolygonsFromExternalSources, createNewPolygonFromCoordinates } from '../../objects/polygon/polygon.js';
import { generateLabelShapeGroup } from '../../objects/allShapes/labelAndShapeBuilder.js';
import initiateResetCanvasEventsToDefaultEvent from '../../../tools/toolkit/buttonClickEvents/facadeWorkers/resetCanvasEventsToDefaultWorker.js';
import { setDefaultCursorMode } from '../../mouseInteractions/cursorModes/defaultMode.js';
import { resetLabellerModalOptions } from '../../../tools/labellerModal/style.js';
import { getCurrentImageId } from '../../../tools/state.js';
import { removeBoundingBox } from '../../../tools/labelList/removeLabels/removeLabels.js';
import { getAllExistingShapes } from '../../objects/allShapes/allShapes.js';
import { getNumberOfShapeTypes } from '../../../tools/globalStatistics/globalStatistics.js';
import { getCanvasReferences } from '../fabricUtils.js';
import assignDefaultEvents from '../../mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers.js';
import { repopulateDropdown } from '../../../tools/labelList/labelList.js';
import purgeCanvasMouseEvents from '../../mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers.js';
import {
  getAllImageData,
  getLastImageIdByName,
  removeMLThumbnailHighlight,
  removeTickSVGOverImageThumbnail,
  displayTickSVGOverImageThumbnail,
  removeSelectedMLThumbnailHighlight,
  setDefaultImageThumbnailHighlightToML,
  setDefaultImageThumbnailHighlightToMLSelected,
} from '../../../tools/imageList/imageList.js';

let canvas = null;
const tempShapes = [];

function newLabelShapeGroup(shape, shapeCoordinates, isCurrentlySelectedImage,
  isUsingMachineLearning, image) {
  if (isCurrentlySelectedImage) {
    generateLabelShapeGroup(shape, shapeCoordinates.class,
      null, isUsingMachineLearning);
    canvas.add(shape);
  } else {
    generateLabelShapeGroup(shape, shapeCoordinates.class,
      image, isUsingMachineLearning);
  }
}

function generateNewBoundingBox(shapeCoordinates, imageScalingDimensions,
  imageLengthDimensions) {
  const boundingBoxShape = createNewBoundingBoxFromCoordinates(
    shapeCoordinates.bbox[0],
    shapeCoordinates.bbox[1],
    shapeCoordinates.bbox[2],
    shapeCoordinates.bbox[3],
    imageScalingDimensions,
    imageLengthDimensions,
  );
  return boundingBoxShape;
}

function generateNewPolygon(shapeCoordinates, imageScalingDimensions, imageLengthDimensions) {
  const points = [];
  for (let i = 0; i < shapeCoordinates.points.length; i += 2) {
    points.push({
      x: shapeCoordinates.points[i] * imageScalingDimensions.scaleX,
      y: shapeCoordinates.points[i + 1] * imageScalingDimensions.scaleY,
    });
  }
  return createNewPolygonFromCoordinates(points, imageScalingDimensions, imageLengthDimensions);
}

function generateImageShapesForML(image, isCurrentlySelectedImage, predictedShapeCoordinates,
  imageScalingDimensions, imageLengthDimensions, isUsingMachineLearning) {
  predictedShapeCoordinates.forEach((shapeCoordinates) => {
    const boundingBox = generateNewBoundingBox(shapeCoordinates, imageScalingDimensions,
      imageLengthDimensions);
    newLabelShapeGroup(boundingBox, shapeCoordinates, isCurrentlySelectedImage,
      isUsingMachineLearning, image);
  });
  image.numberOfMLGeneratedShapes = predictedShapeCoordinates.length;
}

function getImageScalingDimensions(image) {
  if (image && image.imageDimensions && Object.keys(image.imageDimensions).length > 0) {
    return image.imageDimensions;
  }
  return { scaleX: 1, scaleY: 1 };
}

function getImageLengthDimensions(image) {
  if (image && image.data) {
    return { height: image.data.height, width: image.data.width };
  }
  return { height: 1, width: 1 };
}

function removeMLShapesOnImage(imageData, currentImage) {
  const shapes = currentImage ? getAllExistingShapes() : imageData.shapes;
  Object.keys(shapes).forEach((key) => {
    const shape = shapes[key].shapeRef;
    if (shape.isGeneratedViaML) {
      if (currentImage) {
        removeBoundingBox(shape);
      } else {
        delete shapes[key];
      }
    }
  });
  canvas.renderAll();
  imageData.numberOfMLGeneratedShapes = 0;
}

function generateNewShapesForML(predictedShapeCoordinatesForImages, allImageData,
  currentlySelectedImageId, isUsingMachineLearning) {
  removeMLShapesOnImage(allImageData[currentlySelectedImageId], true);
  Object.keys(predictedShapeCoordinatesForImages).forEach((key) => {
    removeMLShapesOnImage(allImageData[key]);
    const image = allImageData[key];
    const imageScalingDimensions = getImageScalingDimensions(image);
    const isCurrentlySelectedImage = currentlySelectedImageId === parseInt(key, 10);
    const imageLengthDimensions = getImageLengthDimensions(allImageData[key]);
    const predictedShapeCoordinates = predictedShapeCoordinatesForImages[key];
    if (predictedShapeCoordinates.length > 0) {
      generateImageShapesForML(image, isCurrentlySelectedImage, predictedShapeCoordinates,
        imageScalingDimensions, imageLengthDimensions, isUsingMachineLearning);
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

function updateImageThumbnailStyle(isCurrentlySelectedImage, image) {
  if (!isCurrentlySelectedImage) {
    setDefaultImageThumbnailHighlightToML(image.thumbnailElementRef);
  } else {
    setDefaultImageThumbnailHighlightToMLSelected(image.thumbnailElementRef);
  }
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

function removeImageThumbnails() {
  const { allImageData, currentlySelectedImageId } = getImageData();
  allImageData.forEach((image, index) => {
    if (currentlySelectedImageId === index) {
      removeSelectedMLThumbnailHighlight(image.thumbnailElementRef);
    } else {
      removeMLThumbnailHighlight(image.thumbnailElementRef);
    }
    if (Object.keys(image.shapes).length === 0) removeTickSVGOverImageThumbnail(index);
  });
}

function generateTempShapes(predictedShapeCoordinates, imageScalingDimensions,
  imageLengthDimensions) {
  predictedShapeCoordinates.forEach((shapeCoordinates) => {
    const boundingBox = generateNewBoundingBox(shapeCoordinates, imageScalingDimensions,
      imageLengthDimensions);
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

function drawTempShapesToShowCaseMLResults(predictedShapeCoordinatesForImages) {
  const { allImageData, currentlySelectedImageId } = getImageData();
  captureCurrentImageData(allImageData, currentlySelectedImageId);
  prepareCanvasForNewBoundingBoxesFromExternalSources(canvas);
  const currentlySelectedImageShapes = predictedShapeCoordinatesForImages[currentlySelectedImageId];
  const imageScalingDimensions = getImageScalingDimensions(allImageData[currentlySelectedImageId]);
  const imageLengthDimensions = getImageLengthDimensions(allImageData[currentlySelectedImageId]);
  generateTempShapes(currentlySelectedImageShapes, imageScalingDimensions, imageLengthDimensions);
}

function generateShapeForFileUpload(shapeData, imageData, isCurrentlySelectedImage) {
  const imageScalingDimensions = getImageScalingDimensions(imageData);
  const imageLengthDimensions = getImageLengthDimensions(imageData);
  if (shapeData.type === 'boundingBox') {
    const shape = generateNewBoundingBox(shapeData.coordinates, imageScalingDimensions,
      imageLengthDimensions);
    newLabelShapeGroup(shape, shapeData.coordinates, isCurrentlySelectedImage,
      false, imageData);
  } else if (shapeData.type === 'polygon') {
    const shape = generateNewPolygon(shapeData.coordinates, imageScalingDimensions,
      imageLengthDimensions);
    newLabelShapeGroup(shape, shapeData.coordinates, isCurrentlySelectedImage,
      false, imageData);
  }
}

function generateNewShapesForFileUpload(shapes, allImageData, currentlySelectedImageId,
  reuseAlreadyUploadedImages) {
  for (let i = 0; i < shapes.length; i += 1) {
    for (let y = allImageData.length - 1; y >= 0; y -= 1) {
      if (shapes[i].imageName === allImageData[y].name) {
        const isCurrentlySelectedImage = currentlySelectedImageId === y;
        generateShapeForFileUpload(shapes[i], allImageData[y], isCurrentlySelectedImage);
        displayTickSVGOverImageThumbnail(getLastImageIdByName(allImageData[y].name));
        if (!reuseAlreadyUploadedImages) { break; }
      }
    }
  }
}

function drawShapesForFileUpload(shapesData, allImageData, currentlySelectedImageId,
  reuseAlreadyUploadedImages) {
  if (shapesData.boundingBoxes.length > 0) {
    prepareCanvasForNewBoundingBoxesFromExternalSources(canvas);
    generateNewShapesForFileUpload(shapesData.boundingBoxes, allImageData,
      currentlySelectedImageId, reuseAlreadyUploadedImages);
  }
  if (shapesData.polygons.length > 0) {
    prepareCanvasForNewPolygonsFromExternalSources(canvas);
    generateNewShapesForFileUpload(shapesData.polygons, allImageData,
      currentlySelectedImageId, reuseAlreadyUploadedImages);
  }
}

function drawShapesForML(shapesData, allImageData, currentlySelectedImageId,
  isUsingMachineLearning) {
  // check bugs with label list options order after ML
  // check how fast the labelling is, what if the user cancels half way through,
  // do you undo the labels that
  prepareCanvasForNewBoundingBoxesFromExternalSources(canvas);
  generateNewShapesForML(shapesData, allImageData,
    currentlySelectedImageId, isUsingMachineLearning);
  removeTempShapes();
}


function assignCanvasEvents() {
  if (getNumberOfShapeTypes().boundingBoxes === 0) {
    const { canvas1 } = getCanvasReferences();
    // fix for bug where upon generating ML shapes, clicking finish would have two event listeners
    purgeCanvasMouseEvents(canvas1);
    // fix for a bug where the newly generated shapes would not adhere to
    // the boundaries when scaling
    assignDefaultEvents(canvas1, null, false);
  }
}

function resetCursor() {
  setDefaultCursorMode(canvas);
}

function drawShapesViaCoordinates(shapesData, isUsingMachineLearning, reuseAlreadyUploadedImages) {
  const { allImageData, currentlySelectedImageId } = getImageData();
  assignCanvasEvents();
  captureCurrentImageData(allImageData, currentlySelectedImageId);
  if (!isUsingMachineLearning) {
    drawShapesForFileUpload(shapesData, allImageData, currentlySelectedImageId,
      reuseAlreadyUploadedImages);
  } else {
    drawShapesForML(shapesData, allImageData, currentlySelectedImageId, isUsingMachineLearning);
  }
  repopulateDropdown();
  resetLabellerModalOptions();
  resetCursor();
  initiateResetCanvasEventsToDefaultEvent(canvas);
}

function assignCanvasForDrawingShapesViaCoordinates(canvasObj) {
  canvas = canvasObj;
}

export {
  drawTempShapesToShowCaseMLResults, updateImageThumbnails, removeTempShapes, resetCursor,
  assignCanvasForDrawingShapesViaCoordinates, drawShapesViaCoordinates, removeImageThumbnails,
};
