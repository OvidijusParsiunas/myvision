import { removeBndBxIfLabelNamePending } from './labelNamePopUp';

const fileStatus = { uploaded: false, name: null };
const canvasProperties = {};
let canvas = null;

function onImageLoad() {
  fileStatus.uploaded = true;
  const tempCanvasObj = document.createElement('canvas');
  if (canvasProperties.maximumCanvasHeight < this.height) {
    const heightRatio = canvasProperties.maximumCanvasHeight / this.height;
    tempCanvasObj.height = canvasProperties.maximumCanvasHeight;
    tempCanvasObj.width = this.width * heightRatio;
    if (canvasProperties.maximumCanvasWidth < tempCanvasObj.width) {
      const widthRatio = canvasProperties.maximumCanvasWidth / this.width;
      tempCanvasObj.width = canvasProperties.maximumCanvasWidth;
      tempCanvasObj.height *= widthRatio;
    }
    tempCanvasObj.getContext('2d').drawImage(this, 0, 0, tempCanvasObj.width, tempCanvasObj.height);
    canvas.setWidth(tempCanvasObj.width);
    canvas.setHeight(tempCanvasObj.height);
    canvas.setBackgroundColor({ source: tempCanvasObj.toDataURL() }, () => {
      canvas.renderAll();
    });
  } else if (canvasProperties.maximumCanvasWidth < this.width) {
    const widthRatio = canvasProperties.maximumCanvasWidth / this.width;
    tempCanvasObj.width = canvasProperties.maximumCanvasWidth;
    tempCanvasObj.height *= widthRatio;
    tempCanvasObj.getContext('2d').drawImage(this, 0, 0, tempCanvasObj.width, tempCanvasObj.height);
    canvas.setWidth(tempCanvasObj.width);
    canvas.setHeight(tempCanvasObj.height);
    canvas.setBackgroundColor({ source: tempCanvasObj.toDataURL() }, () => {
      canvas.renderAll();
    });
  } else {
    canvas.setWidth(this.width);
    canvas.setHeight(this.height);
    canvas.setBackgroundColor({ source: this.src }, () => {
      canvas.renderAll();
    });
  }
}

function onFileLoad(e) {
  const image = new Image();
  image.src = e.target.result;
  image.onload = onImageLoad;
}

function readURL(input) {
  removeBndBxIfLabelNamePending();
  if (input.files && input.files[0]) {
    canvasProperties.maximumCanvasHeight = window.innerHeight - 54;
    canvasProperties.maximumCanvasWidth = window.innerWidth - 110;
    const reader = new FileReader();
    fileStatus.name = input.files[0].name;
    reader.onload = onFileLoad;
    reader.readAsDataURL(input.files[0]);
  }
}

function setCanvas(canvasObj) {
  canvas = canvasObj;
}

window.readURL = readURL;

export { fileStatus, setCanvas };
