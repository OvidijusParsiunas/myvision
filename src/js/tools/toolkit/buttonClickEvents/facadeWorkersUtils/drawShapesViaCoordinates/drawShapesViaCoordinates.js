import { setDefaultImageThumbnailHighlightToMLSelected, getAllImageData, setDefaultImageThumbnailHighlightToML } from '../../../../imageList/imageList';
import { getImageProperties } from '../uploadFile/drawImageOnCanvas';
import { prepareCanvasForNewBoundingBoxesWithMachineLearning, createNewBoundingBoxFromCoordinates } from '../../../../../canvas/objects/boundingBox/boundingBox';
import { generateLabelShapeGroup } from '../../../../../canvas/objects/allShapes/labelAndShapeBuilder';
import { resetCanvasEventsToDefault } from '../../facade';
import { setDefaultCursorMode } from '../../../../../canvas/mouseInteractions/cursorModes/defaultMode';
import { resetPopUpLabelOptions } from '../../../../labellerPopUp/style';
import { setPopupLabelOptionsIndexToZero } from '../../../../labellerPopUp/buttonEventHandlers';
import { getCurrentImageId } from '../stateManager';
import { removeBoundingBox } from '../../facadeWorkers/removeActiveShapeWorker';
import { getAllExistingShapes } from '../../../../../canvas/objects/allShapes/allShapes';

let canvas = null;

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

function removeMLShapesOnImage(allImageData, id) {
  const currentImageShapes = getAllExistingShapes();
  Object.keys(currentImageShapes).forEach((key) => {
    const shape = currentImageShapes[key].shapeRef;
    if (shape.isGeneratedViaML) {
      removeBoundingBox(canvas, shape);
    }
  });
  canvas.renderAll();
  allImageData[id].numberOfMLGeneratedShapes = 0;
}

function generateNewShapesForImages(predictedShapeCoordinatesForImages, allImageData,
  currentlySelectedImageId, isUsingMachineLearning) {
  removeMLShapesOnImage(allImageData, currentlySelectedImageId);
  Object.keys(predictedShapeCoordinatesForImages).forEach((key) => {
    const image = allImageData[key];
    const imageDimensions = getImageDimensions(image);
    const isCurrentlySelectedImage = currentlySelectedImageId === parseInt(key, 10);
    const predictedShapeCoordinates = predictedShapeCoordinatesForImages[key];
    if (predictedShapeCoordinates.length > 0) {
      generateNewShapes(image, isCurrentlySelectedImage, predictedShapeCoordinates,
        imageDimensions, isUsingMachineLearning);
      updateImageThumbnailStyle(isCurrentlySelectedImage, image);
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

function drawShapesViaCoordinates(predictedShapeCoordinatesForImages, isUsingMachineLearning) {
  predictedShapeCoordinatesForImages = predictedShapeCoordinatesForImages = {"0":[{"bbox":[0.23196187615394592,1.3171005249023438,282.11527583003044,337.3044550418854],"class":"cat","score":0.8860134482383728}],"1":[{"bbox":[16.03703498840332,194.2115306854248,1113.8134002685547,482.022762298584],"class":"car","score":0.9936941266059875},{"bbox":[1233.7510585784912,1169.7566986083984,1080.3159713745117,385.3567123413086],"class":"car","score":0.9841077327728271},{"bbox":[96.5882420539856,1009.1146469116211,1040.1406645774841,506.1511993408203],"class":"truck","score":0.9241188764572144},{"bbox":[1270.0901985168457,110.06307601928711,1079.1927337646484,524.1976737976074],"class":"car","score":0.8551244735717773}]};
  isUsingMachineLearning = true;
  const currentlySelectedImageId = getCurrentImageId();
  const allImageData = getAllImageData();
  captureCurrentImageData(allImageData, currentlySelectedImageId);
  prepareCanvasForNewBoundingBoxesWithMachineLearning(canvas);
  generateNewShapesForImages(predictedShapeCoordinatesForImages, allImageData,
    currentlySelectedImageId, isUsingMachineLearning);
  // only execute these two if new shapes have been created
  resetPopUpLabelOptions();
  setPopupLabelOptionsIndexToZero();

  setDefaultCursorMode(canvas);
  resetCanvasEventsToDefault();

  // check bugs with label list options order after ML
  // check how fast the labelling is, what if the user cancels half way through,
  // do you undo the labels that
  // have been generated? You will have to. Have an option to continue.
  // Check if the newImageDimensions are correct using height only
}

function assignCanvasForDrawingShapesViaCoordinates(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForDrawingShapesViaCoordinates, drawShapesViaCoordinates };
