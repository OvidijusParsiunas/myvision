import fabric from 'fabric';
 
const initialFileStatus = {};
const newFileStatus = { uploaded: false, name: null };
const canvasProperties = {};
let canvas = null;
let currentImage = null;

// timeout canvas zooms make it look bad, check zoom in and out to original

function drawResizedImage(currentImage, newImageDimensions) {
  canvas.setWidth(newImageDimensions.width);
  canvas.setHeight(newImageDimensions.height);
  fabric.Image.fromURL(currentImage.src, (img) => {
    newFileStatus.scaleX = canvas.width / img.width;
    newFileStatus.scaleY = canvas.height / img.height;
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      scaleX: newFileStatus.scaleX,
      scaleY: newFileStatus.scaleY,
    }, 
    canvas.setZoom(1));
  });
  newFileStatus.width = newImageDimensions.width;
  newFileStatus.height = newImageDimensions.height;
}

function drawOriginalImage(currentImage) {
  canvas.setWidth(currentImage.width);
  canvas.setHeight(currentImage.height);
  fabric.Image.fromURL(currentImage.src, (img) => {
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {}, canvas.setZoom(1));
  });
  newFileStatus.width = currentImage.width;
  newFileStatus.height = currentImage.height;
}

function drawImageOnCanvas(currentImage, newImageDimensions, defaultZoom) {
  if (newImageDimensions) {
    drawResizedImage(currentImage, newImageDimensions);
  } else {
    drawOriginalImage(currentImage);
  }
}

function resizeWhenImageExceedsMaxHeight(currentImage) {
  const newImageDimensions = {};
  const heightRatio = canvasProperties.maximumCanvasHeight / currentImage.height;
  newImageDimensions.height = canvasProperties.maximumCanvasHeight;
  newImageDimensions.width = currentImage.width * heightRatio;
  return newImageDimensions;
}

function resizeWhenImageExceedsMaxWidth(currentImage) {
  const newImageDimensions = {};
  const widthRatio = canvasProperties.maximumCanvasWidth / currentImage.width;
  newImageDimensions.width = canvasProperties.maximumCanvasWidth;
  newImageDimensions.height = currentImage.height * widthRatio;
  return newImageDimensions;
}

function setCanvasWrapperMaximumDimensions() {
  const canvasWrapper = document.getElementById('canvas-wrapper');
  canvasWrapper.style.maxWidth = `${canvasProperties.maximumCanvasWidth}px`;
  canvasWrapper.style.maxHeight = `${canvasProperties.maximumCanvasHeight}px`;
}

function draw() {
  setCanvasProperties();
    if (canvasProperties.maximumCanvasHeight < currentImage.height) {
        let newImageDimensions = resizeWhenImageExceedsMaxHeight(currentImage);
    if (canvasProperties.maximumCanvasWidth < newImageDimensions.width) {
        newImageDimensions = resizeWhenImageExceedsMaxWidth(newImageDimensions);
    }
        drawImageOnCanvas(currentImage, newImageDimensions);
    } else if (canvasProperties.maximumCanvasWidth < currentImage.width) {
        const newImageDimensions = resizeWhenImageExceedsMaxWidth(currentImage);
        drawImageOnCanvas(currentImage, newImageDimensions);
    } else {
        drawImageOnCanvas(currentImage);
    }
    setCanvasWrapperMaximumDimensions();
    initialFileStatus.width = newFileStatus.width;
    initialFileStatus.height = newFileStatus.height;
}

function drawImageFromList(selectedImage) {
  currentImage = selectedImage;
  draw();
}

function onImageLoad() {
  newFileStatus.uploaded = true;
  currentImage = this;
  draw();
}

function setCanvasProperties() {
  canvasProperties.maximumCanvasHeight = window.innerHeight - 50;
  canvasProperties.maximumCanvasWidth = window.innerWidth - 162;
}

function assignCanvasForDrawImageOnCanvas(newCanvas) {
  canvas = newCanvas;
  setCanvasProperties();
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
  if (canvasProperties.maximumCanvasHeight < currentImage.height) {
    let newImageDimensions = resizeWhenImageExceedsMaxHeight(currentImage);
    if (canvasProperties.maximumCanvasWidth < newImageDimensions.width) {
      newImageDimensions = resizeWhenImageExceedsMaxWidth(newImageDimensions);
    }
    drawImageOnCanvas(currentImage, newImageDimensions, true);
  } else if (canvasProperties.maximumCanvasWidth < currentImage.width) {
    const newImageDimensions = resizeWhenImageExceedsMaxWidth(currentImage);
    drawImageOnCanvas(currentImage, newImageDimensions, true);
  } else {
    drawImageOnCanvas(currentImage);
  }
  setCanvasWrapperMaximumDimensions();
  return calculateNewFileSizeRatio();
}

function resizeCanvas() {
  setCanvasProperties();
  if (canvasProperties.maximumCanvasHeight < currentImage.height) {
    let newImageDimensions = resizeWhenImageExceedsMaxHeight(currentImage);
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
