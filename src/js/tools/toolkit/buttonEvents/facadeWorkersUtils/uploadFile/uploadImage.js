import fabric from 'fabric';

const initialFileStatus = {};
const newFileStatus = { uploaded: false, name: null };
const canvasProperties = {};
let canvas = null;
let currentImage = null;

function drawResizedImage(image, newImageDimensions) {
  canvas.setWidth(newImageDimensions.width);
  canvas.setHeight(newImageDimensions.height);
  fabric.Image.fromURL(image.src, (img) => {
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

function drawOriginalImage(image) {
  canvas.setWidth(image.width);
  canvas.setHeight(image.height);
  fabric.Image.fromURL(image.src, (img) => {
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
  });
  newFileStatus.width = image.width;
  newFileStatus.height = image.height;
}

function drawImageOnCanvas(image, newImageDimensions, resize) {
  if (newImageDimensions) {
    drawResizedImage(image, newImageDimensions, resize);
  } else {
    drawOriginalImage(image);
  }
}

function resizeWhenImageExceedsMaxHeight(image) {
  const newImageDimensions = {};
  const heightRatio = canvasProperties.maximumCanvasHeight / image.height;
  newImageDimensions.height = canvasProperties.maximumCanvasHeight;
  newImageDimensions.width = image.width * heightRatio;
  return newImageDimensions;
}

function resizeWhenImageExceedsMaxWidth(image) {
  const newImageDimensions = {};
  const widthRatio = canvasProperties.maximumCanvasWidth / image.width;
  newImageDimensions.width = canvasProperties.maximumCanvasWidth;
  newImageDimensions.height = image.height * widthRatio;
  return newImageDimensions;
}

function setCanvasWrapperMaximumDimensions() {
  const canvasWrapper = document.getElementById('canvas-wrapper');
  canvasWrapper.style.maxWidth = `${canvasProperties.maximumCanvasWidth}px`;
  canvasWrapper.style.maxHeight = `${canvasProperties.maximumCanvasHeight}px`;
}

function onImageLoad() {
  newFileStatus.uploaded = true;
  const image = this;
  currentImage = image;
  if (canvasProperties.maximumCanvasHeight < image.height) {
    let newImageDimensions = resizeWhenImageExceedsMaxHeight(image);
    if (canvasProperties.maximumCanvasWidth < newImageDimensions.width) {
      newImageDimensions = resizeWhenImageExceedsMaxWidth(newImageDimensions);
    }
    drawImageOnCanvas(image, newImageDimensions);
  } else if (canvasProperties.maximumCanvasWidth < image.width) {
    const newImageDimensions = resizeWhenImageExceedsMaxWidth(image);
    drawImageOnCanvas(image, newImageDimensions);
  } else {
    drawImageOnCanvas(image);
  }
  setCanvasWrapperMaximumDimensions();
  initialFileStatus.width = newFileStatus.width;
  initialFileStatus.height = newFileStatus.height;
}

function onFileLoad(e) {
  const image = new Image();
  image.src = e.target.result;
  image.onload = onImageLoad;
}

function uploadImage(uploadData) {
  if (uploadData.files && uploadData.files[0]) {
    const reader = new FileReader();
    newFileStatus.name = uploadData.files[0].name;
    reader.onload = onFileLoad;
    reader.readAsDataURL(uploadData.files[0]);
  }
}

function setCanvasProperties() {
  canvasProperties.maximumCanvasHeight = window.innerHeight - 50;
  canvasProperties.maximumCanvasWidth = window.innerWidth - 162;
}

function assignCanvasForNewImageUpload(newCanvas) {
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
  uploadImage, getImageProperties, resizeCanvasAndImage, resizeCanvas,
  assignCanvasForNewImageUpload, getCanvasProperties,
};
