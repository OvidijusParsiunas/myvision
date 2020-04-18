import { getAllImageData, updateCurrentImageIds, getCurrentImageId } from '../imageList';
import { setImageNameElementToDefault } from '../../imageSwitchPanel/style';
import { removeAllLabelListItems } from '../../labelList/labelList';
import { removeAllLabelRefs } from '../../../canvas/objects/label/label';
import { removeAllShapeRefs, getAllExistingShapes } from '../../../canvas/objects/allShapes/allShapes';
import { decrementShapeType } from '../../globalStatistics/globalStatistics';
import { setCurrentImage } from '../../toolkit/buttonClickEvents/facadeWorkersUtils/uploadImage/drawImageOnCanvas';

let canvas = null;

function switchImage(index, allImageData, previousImageDataLength) {
  if (index < allImageData.length) {
    const nextImageId = (index - (previousImageDataLength - allImageData.length)) + 1;
    updateCurrentImageIds(-1, allImageData.length);
    window.switchImage(nextImageId);
  } else if (allImageData.length > 0) {
    updateCurrentImageIds(-1, allImageData.length);
    window.switchImage(allImageData.length - 1);
  } else {
    updateCurrentImageIds(0, 0);
    removeAllLabelListItems();
    setImageNameElementToDefault();
    canvas.clear();
    setCurrentImage(null);
  }
}

function removeAllShapes() {
  const allShapes = getAllExistingShapes();
  Object.keys(allShapes).forEach((key) => {
    decrementShapeType(allShapes[key].shapeRef);
  });
  removeAllShapeRefs();
}

function resetRemainingImageElements() {
  const imageNodes = document.getElementById('image-list-overflow-parent').childNodes;
  for (let i = 1; i < imageNodes.length; i += 1) {
    const imageElement = imageNodes[i].childNodes[0];
    imageElement.id = i - 1;
    imageNodes[i].onclick = window.switchImage.bind(this, i - 1);
  }
}

function removeImage() {
  const allImageData = getAllImageData();
  if (allImageData.length > 0) {
    const index = getCurrentImageId();
    document.getElementById(index).parentElement.remove();
    resetRemainingImageElements();
    const previousImageDataLength = allImageData.length;
    allImageData.splice(index, 1);
    removeAllLabelRefs();
    removeAllShapes();
    switchImage(index, allImageData, previousImageDataLength);
  }
}

function assignCanvasForRemovingImages(canvasArg) {
  canvas = canvasArg;
}

function initialiseRemoveImagesFunctionality() {
  window.removeImage = removeImage;
}

export { initialiseRemoveImagesFunctionality, assignCanvasForRemovingImages };

// initial code to get started on the multi-image removal functionality

// let imageRemoveList = [];

// function removeImage() {
//   const allImageData = getAllImageData();
//   if (allImageData.length > 0) {
//     const index = getCurrentImageId();
//     const tempAllImageDataLength = allImageData.length;
//     allImageData.splice(index, 1);
//     document.getElementById(index).parentElement.remove();
//     const imageNodes = document.getElementById('image-list-overflow-parent').childNodes;
//     for (let i = 1; i < imageNodes.length; i += 1) {
//       const imageElement = imageNodes[i].childNodes[0];
//       imageElement.id = i - 1;
//       imageNodes[i].onclick = window.switchImage.bind(this, i - 1);
//     }
//     const newCurrentImageId = getCurrentImageId()
//       - (tempAllImageDataLength - allImageData.length);
//     if (index === getCurrentImageId()) {
//       const afterRemoving = true;
//       if (index < allImageData.length) {
//         updateCurrentImageIds(newCurrentImageId, allImageData.length);
//         window.switchImage('next', afterRemoving);
//       } else if (allImageData.length > 0) {
//         updateCurrentImageIds(-1, allImageData.length);
//         window.switchImage(allImageData.length - 1);
//       } else {
//         updateCurrentImageIds(0, 0);
//         canvas.clear();
//       }
//       removeAllLabelRefs();
//       removeAllShapeRefs();
//     }
//   }
// }

// function removeImages() {
//   const allImageData = getAllImageData();
//   imageRemoveList.forEach((index) => {
//     allImageData.splice(index, 1);
//   });
//   imageRemoveList = [];
// }

// function addImageIndexToRemoveList(index) {
//   imageRemoveList.push(index);
// }

// function initialiseRemoveImagesFunctionality() {
//   window.removeImage = removeImage;
//   window.removeImages = removeImages;
//   window.addImageIndexToRemoveList = addImageIndexToRemoveList;
// }
