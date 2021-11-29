// import fabric from 'fabric.js';
import { getLeftSideBarWidth, getRightSideBarWidth } from '../../globalStyling/style.js';
import IS_FIREFOX from '../../utils/browserType.js';
import { getScreenSizeDelta } from '../../globalStyling/screenSizeDelta.js';

const initialFileStatus = {};
const newFileStatus = { uploaded: false, name: null };
const canvasProperties = {};
let canvas = null;
let currentImage = null;
let canvasOuterMargin = true;

function drawResizedImage(newImageDimensions) {
  canvas.setWidth(Math.ceil(newImageDimensions.width));
  canvas.setHeight(Math.ceil(newImageDimensions.height));
  fabric.Image.fromURL(currentImage.src, (img) => {
    newFileStatus.scaleX = canvas.width / img.width;
    newFileStatus.scaleY = canvas.height / img.height;
    newFileStatus.originalWidth = img.width;
    newFileStatus.originalHeight = img.height;
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      scaleX: newFileStatus.scaleX,
      scaleY: newFileStatus.scaleY,
    });
  });
  newFileStatus.width = newImageDimensions.width;
  newFileStatus.height = newImageDimensions.height;
}

function drawOriginalImage() {
  canvas.setWidth(Math.ceil(currentImage.width));
  canvas.setHeight(Math.ceil(currentImage.height));
  fabric.Image.fromURL(currentImage.src, (img) => {
    newFileStatus.originalWidth = img.width;
    newFileStatus.originalHeight = img.height;
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {});
  });
  newFileStatus.scaleX = 1;
  newFileStatus.scaleY = 1;
  newFileStatus.width = currentImage.width;
  newFileStatus.height = currentImage.height;
}

function drawImageOnCanvas(newImageDimensions) {
  if (newImageDimensions) {
    drawResizedImage(newImageDimensions);
  } else {
    drawOriginalImage();
  }
}

function resizeWhenImageExceedsMaxHeight() {
  const newImageDimensions = {};
  const heightRatio = canvasProperties.maximumCanvasHeight / currentImage.height;
  newImageDimensions.height = canvasProperties.maximumCanvasHeight;
  newImageDimensions.width = currentImage.width * heightRatio;
  return newImageDimensions;
}

function resizeWhenImageExceedsMaxWidth(imageDimensions) {
  const newImageDimensions = {};
  const widthRatio = canvasProperties.maximumCanvasWidth / imageDimensions.width;
  /*
    code for not filling up the entire screen with the canvas
     newImageDimensions.width = canvasProperties.maximumCanvasWidth - 20;
     newImageDimensions.height = imageDimensions.height * widthRatio - 20;
  */
  newImageDimensions.width = canvasProperties.maximumCanvasWidth;
  newImageDimensions.height = imageDimensions.height * widthRatio;
  return newImageDimensions;
}

function setCanvasWrapperMaximumDimensions() {
  const canvasWrapper = document.getElementById('canvas-wrapper');
  canvasWrapper.style.maxWidth = `${canvasProperties.maximumCanvasWidth}px`;
  canvasWrapper.style.maxHeight = `${canvasProperties.maximumCanvasHeight}px`;
}

function setNewCanvasProperties() {
  const sideToolsTotalWidth = getLeftSideBarWidth() + getRightSideBarWidth();
  const innerHeight = window.innerHeight - Math.ceil(35 + (29 / getScreenSizeDelta()));
  const innerWidth = window.innerWidth - sideToolsTotalWidth;
  canvasProperties.maximumCanvasHeight = canvasOuterMargin
    ? innerHeight - (window.innerHeight * 0.0382263)
    : innerHeight;
  if (IS_FIREFOX) {
    canvasProperties.maximumCanvasWidth = canvasOuterMargin
      ? innerWidth - 0.5 - (window.innerWidth * 0.020237453)
      : innerWidth - 0.5;
  } else {
    canvasProperties.maximumCanvasWidth = canvasOuterMargin
      ? innerWidth - (window.innerWidth * 0.020237453)
      : innerWidth;
  }
}

// For 45px margin instead
// const sideToolsTotalWidth = getLeftSideBarWidth() + getRightSideBarWidth();
// const innerHeight = window.innerHeight - 64;
// const innerWidth = window.innerWidth - sideToolsTotalWidth;
// canvasProperties.maximumCanvasHeight = canvasOuterMargin
//   ? innerHeight - (window.innerHeight * 0.04587156)
//   : innerHeight;
// if (IS_FIREFOX) {
//   canvasProperties.maximumCanvasWidth = canvasOuterMargin
//     ? innerWidth - 0.5 - (window.innerWidth * 0.024284943)
//     : innerWidth - 0.5;
// } else {
//   canvasProperties.maximumCanvasWidth = canvasOuterMargin
//     ? innerWidth - (window.innerWidth * 0.024284943)
//     : innerWidth;
// }

function draw() {
  setNewCanvasProperties();
  if (canvasProperties.maximumCanvasHeight < currentImage.height) {
    let newImageDimensions = resizeWhenImageExceedsMaxHeight();
    if (canvasProperties.maximumCanvasWidth < newImageDimensions.width) {
      newImageDimensions = resizeWhenImageExceedsMaxWidth(newImageDimensions);
    }
    drawImageOnCanvas(newImageDimensions);
  } else if (canvasProperties.maximumCanvasWidth < currentImage.width) {
    const newImageDimensions = resizeWhenImageExceedsMaxWidth(currentImage);
    drawImageOnCanvas(newImageDimensions);
  } else {
    drawImageOnCanvas();
  }
  setCanvasWrapperMaximumDimensions();
  initialFileStatus.width = newFileStatus.width;
  initialFileStatus.height = newFileStatus.height;
}

function removeCanvasOuterMargin() {
  canvasOuterMargin = false;
  setNewCanvasProperties();
}

function enableCanvasOuterMargin() {
  canvasOuterMargin = true;
  setNewCanvasProperties();
}

// investigate quality

function drawImageFromList(selectedImage) {
  currentImage = selectedImage;
  draw();
}

function onImageLoad(arg) {
  newFileStatus.uploaded = true;
  currentImage = this ? this : arg;
  draw();
  canvas.setZoom(1);
}

function assignCanvasForDrawingImage(canvasObj) {
  canvas = canvasObj;
}

function getCanvasProperties() {
  return canvasProperties;
}

function getImageProperties() {
  return newFileStatus;
}

function calculateCurrentImageHeightRatio() {
  return newFileStatus.height / newFileStatus.originalHeight;
}

function calculateNewFileSizeRatio() {
  const newFileSizeRatio = {};
  newFileSizeRatio.width = newFileStatus.width / initialFileStatus.width;
  newFileSizeRatio.height = newFileStatus.height / initialFileStatus.height;
  initialFileStatus.width = newFileStatus.width;
  initialFileStatus.height = newFileStatus.height;
  return newFileSizeRatio;
}

function resizeCanvasAndImage() {
  setNewCanvasProperties();
  if (currentImage) {
    if (canvasProperties.maximumCanvasHeight < currentImage.height) {
      let newImageDimensions = resizeWhenImageExceedsMaxHeight();
      if (canvasProperties.maximumCanvasWidth < newImageDimensions.width) {
        newImageDimensions = resizeWhenImageExceedsMaxWidth(newImageDimensions);
      }
      drawImageOnCanvas(newImageDimensions);
    } else if (canvasProperties.maximumCanvasWidth < currentImage.width) {
      const newImageDimensions = resizeWhenImageExceedsMaxWidth(currentImage);
      drawImageOnCanvas(newImageDimensions);
    } else {
      drawImageOnCanvas();
    }
  }
  return calculateNewFileSizeRatio();
}

function setCurrentImage(image) {
  currentImage = image;
}

function getCurrentImage() {
  return currentImage;
}

function resizeCanvas() {
  setNewCanvasProperties();
  if (canvasProperties.maximumCanvasHeight < currentImage.height) {
    let newImageDimensions = resizeWhenImageExceedsMaxHeight();
    if (canvasProperties.maximumCanvasWidth < newImageDimensions.width) {
      newImageDimensions = resizeWhenImageExceedsMaxWidth(newImageDimensions);
    }
    canvas.setWidth(Math.ceil(newImageDimensions.width));
    canvas.setHeight(Math.ceil(newImageDimensions.height));
  } else if (canvasProperties.maximumCanvasWidth < currentImage.width) {
    const newImageDimensions = resizeWhenImageExceedsMaxWidth(currentImage);
    canvas.setWidth(Math.ceil(newImageDimensions.width));
    canvas.setHeight(Math.ceil(newImageDimensions.height));
  } else {
    canvas.setWidth(Math.ceil(currentImage.width));
    canvas.setHeight(Math.ceil(currentImage.height));
  }
  setCanvasWrapperMaximumDimensions();
}

export {
  removeCanvasOuterMargin, resizeCanvas, getCurrentImage,
  onImageLoad, getImageProperties, enableCanvasOuterMargin,
  calculateCurrentImageHeightRatio, setCurrentImage, resizeCanvasAndImage,
  assignCanvasForDrawingImage, getCanvasProperties, drawImageFromList,
};
