import fabric from 'fabric';

let fileStatus = { uploaded: false, name: null };
const canvasProperties = {};
let canvas = null;

function drawResizedImage(image, newImageDimensions) {
  canvas.setWidth(newImageDimensions.width);
  canvas.setHeight(newImageDimensions.height);
  fabric.Image.fromURL(image.src, (img) => {
    fileStatus.scaleX = canvas.width / img.width;
    fileStatus.scaleY = canvas.height / img.height;
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      scaleX: fileStatus.scaleX,
      scaleY: fileStatus.scaleY,
    });
  });
  fileStatus.width = newImageDimensions.width;
  fileStatus.height = newImageDimensions.height;
}

function drawOriginalImage(image) {
  canvas.setWidth(image.width);
  canvas.setHeight(image.height);
  fabric.Image.fromURL(image.src, (img) => {
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
  });
  fileStatus.width = image.width;
  fileStatus.height = image.height;
}

function drawImageOnCanvas(image, newImageDimensions) {
  if (newImageDimensions) {
    drawResizedImage(image, newImageDimensions);
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
  fileStatus.uploaded = true;
  const image = this;
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
}

function onFileLoad(e) {
  const image = new Image();
  image.src = e.target.result;
  image.onload = onImageLoad;
}

function uploadImage(uploadData) {
  if (uploadData.files && uploadData.files[0]) {
    const reader = new FileReader();
    fileStatus.name = uploadData.files[0].name;
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
  return fileStatus;
}

function setImageProperties(newFileStatus) {
  fileStatus = newFileStatus;
}

export {
  uploadImage, getImageProperties, setImageProperties,
  assignCanvasForNewImageUpload, getCanvasProperties,
};
