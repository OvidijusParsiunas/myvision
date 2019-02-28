import fabric from 'fabric';
import { removeActiveObjectsOnButtonClick } from '../canvas/externalObjects/labelNamePopUp';

const fileStatus = { uploaded: false, name: null };
const canvasProperties = {};
let canvas = null;

function drawResizedImage(image, newImageDimensions) {
  canvas.setWidth(newImageDimensions.width);
  canvas.setHeight(newImageDimensions.height);
  fabric.Image.fromURL(image.src, (img) => {
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      scaleX: canvas.width / img.width,
      scaleY: canvas.height / img.height,
    });
  });
}

function drawOriginalImage(image) {
  canvas.setWidth(image.width);
  canvas.setHeight(image.height);
  canvas.setBackgroundColor({ source: image.src }, () => {
    canvas.renderAll();
  });
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
}

function onFileLoad(e) {
  const image = new Image();
  image.src = e.target.result;
  image.onload = onImageLoad;
}

function uploadImage(input) {
  removeActiveObjectsOnButtonClick();
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    fileStatus.name = input.files[0].name;
    reader.onload = onFileLoad;
    reader.readAsDataURL(input.files[0]);
  }
}

function setCanvasProperties() {
  canvasProperties.maximumCanvasHeight = window.innerHeight - 54;
  canvasProperties.maximumCanvasWidth = window.innerWidth - 110;
}

function assignCanvasForNewImageUpload(newCanvas) {
  canvas = newCanvas;
  setCanvasProperties();
}

export { fileStatus, uploadImage, assignCanvasForNewImageUpload };