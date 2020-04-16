import { getAllImageData, updateCurrentImageIds, getCurrentImageId } from '../imageList';

let imageRemoveList = [];
let canvas = null;

function removeImage() {
  const index = getCurrentImageId();
  const allImageData = getAllImageData();
  const tempAllImageDataLength = allImageData.length;
  allImageData.splice(index, 1);
  document.getElementById(index).parentElement.remove();
  const imageNodes = document.getElementById('image-list-overflow-parent').childNodes;
  for (let i = 1; i < imageNodes.length; i += 1) {
    const imageElement = imageNodes[i].childNodes[0];
    imageElement.id = i - 1;
    imageNodes[i].onclick = window.switchImage.bind(this, i - 1);
  }
  const newCurrentImageId = getCurrentImageId() - (tempAllImageDataLength - allImageData.length);
  if (index === getCurrentImageId()) {
    const afterRemoving = true;
    if (index < allImageData.length) {
      updateCurrentImageIds(newCurrentImageId, allImageData.length);
      window.switchImage('next', afterRemoving);
    } else if (allImageData.length > 0) {
      updateCurrentImageIds(-1, allImageData.length);
      window.switchImage(allImageData.length - 1);
    } else {
      canvas.clear();
    }
  }
}

function removeImages() {
  const allImageData = getAllImageData();
  imageRemoveList.forEach((index) => {
    allImageData.splice(index, 1);
  });
  imageRemoveList = [];
}

function addImageIndexToRemoveList(index) {
  imageRemoveList.push(index);
}

function assignCanvasForRemovingImages(canvasArg) {
  canvas = canvasArg;
}

function initialiseRemoveImagesFunctionality() {
  window.removeImage = removeImage;
  window.removeImages = removeImages;
  window.addImageIndexToRemoveList = addImageIndexToRemoveList;
}

export { initialiseRemoveImagesFunctionality, assignCanvasForRemovingImages };
