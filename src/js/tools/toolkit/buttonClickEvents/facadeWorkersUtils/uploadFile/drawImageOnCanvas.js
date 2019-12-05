import fabric from 'fabric';
import { getLeftSideBarWidth, getRightSideBarWidth } from '../../../../styling/styling';

const initialFileStatus = {};
const newFileStatus = { uploaded: false, name: null };
const canvasProperties = {};
let canvas = null;
let currentImage = null;

function drawResizedImage(newImageDimensions) {
  canvas.setWidth(newImageDimensions.width);
  canvas.setHeight(newImageDimensions.height);
  fabric.Image.fromURL(currentImage.src, (img) => {
    newFileStatus.scaleX = canvas.width / img.width;
    newFileStatus.scaleY = canvas.height / img.height;
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      scaleX: newFileStatus.scaleX,
      scaleY: newFileStatus.scaleY,
    });
  });

  newFileStatus.width = newImageDimensions.width;
  newFileStatus.height = newImageDimensions.height;
}

function drawOriginalImage() {
  canvas.setWidth(currentImage.width);
  canvas.setHeight(currentImage.height);
  fabric.Image.fromURL(currentImage.src, (img) => {
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

function setCanvasProperties() {
  canvasProperties.maximumCanvasHeight = window.innerHeight - 60;
  const sideToolsTotalWidth = getLeftSideBarWidth() + getRightSideBarWidth();
  canvasProperties.maximumCanvasWidth = window.innerWidth - sideToolsTotalWidth;
}

function draw() {
  setCanvasProperties();
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

// investigate quality
// check the divs are wrapped around for all pcs

function drawImageFromList(selectedImage) {
  currentImage = selectedImage;
  draw();
}

function onImageLoad() {
  newFileStatus.uploaded = true;
  currentImage = this;
  draw();
  canvas.setZoom(1);
}

function assignCanvasForDrawImageOnCanvas(canvasObj) {
  canvas = canvasObj;
}

function getCanvasProperties() {
  return canvasProperties;
}

function getImageProperties() {
  return newFileStatus;
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
  setCanvasProperties();
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

function resizeCanvas() {
  setCanvasProperties();
  if (canvasProperties.maximumCanvasHeight < currentImage.height) {
    let newImageDimensions = resizeWhenImageExceedsMaxHeight();
    if (canvasProperties.maximumCanvasWidth < newImageDimensions.width) {
      newImageDimensions = resizeWhenImageExceedsMaxWidth(newImageDimensions);
    }
    canvas.setWidth(newImageDimensions.width);
    canvas.setHeight(newImageDimensions.height);
  } else if (canvasProperties.maximumCanvasWidth < currentImage.width) {
    const newImageDimensions = resizeWhenImageExceedsMaxWidth(currentImage);
    canvas.setWidth(newImageDimensions.width);
    canvas.setHeight(newImageDimensions.height);
  } else {
    canvas.setWidth(currentImage.width);
    canvas.setHeight(currentImage.height);
  }
  setCanvasWrapperMaximumDimensions();
}

export {
  onImageLoad, getImageProperties, resizeCanvasAndImage, resizeCanvas,
  assignCanvasForDrawImageOnCanvas, getCanvasProperties, drawImageFromList,
};
