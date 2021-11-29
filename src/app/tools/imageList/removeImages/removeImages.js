import { updateCurrentImageIds, getAllImageData } from '../imageList.js';
import { setImageNameElementToDefault } from '../../imageSwitchPanel/style.js';
import { removeAllLabelListItems } from '../../labelList/labelList.js';
import { removeAllLabelRefs } from '../../../canvas/objects/label/label.js';
import { removeAllShapeRefs, getAllExistingShapes } from '../../../canvas/objects/allShapes/allShapes.js';
import { decrementShapeType } from '../../globalStatistics/globalStatistics.js';
import { setCurrentImage } from '../uploadImages/drawImageOnCanvas.js';
import { resetZoom } from '../../toolkit/buttonClickEvents/facadeWorkers/zoomWorker.js';
import { getDoNotShowRemoveImageModalAgainState } from './modal/state.js';
import { drawWatermarkOnCanvasAreaBackground } from '../../../canvas/utils/watermark.js';
import {
  setPolygonEditingButtonsToDisabled, setZoomInButtonToDisabled,
  setCreatePolygonButtonToDisabled, setEditShapesButtonToDisabled,
  setCreateBoundingBoxButtonToDisabled, setRemoveImagesButtonsDisabled,
} from '../../toolkit/styling/state.js';
import {
  getCurrentImageId, getContinuousDrawingState, getLastDrawingModeState, setDefaultState,
} from '../../state.js';
import { displayRemoveImagesModal } from './modal/style.js';

let canvas = null;

function resetEverything() {
  resetZoom(false);
  updateCurrentImageIds(0, 0);
  const lastDrawingModeState = getContinuousDrawingState() ? getLastDrawingModeState : false;
  window.editShapes();
  // the following is preparation to set an active drawing mode on a new image upload
  if (lastDrawingModeState) setDefaultState(false);
  setImageNameElementToDefault();
  removeAllLabelListItems();
  drawWatermarkOnCanvasAreaBackground();
  setCreateBoundingBoxButtonToDisabled();
  setCreatePolygonButtonToDisabled();
  setRemoveImagesButtonsDisabled();
  setEditShapesButtonToDisabled();
  setZoomInButtonToDisabled();
  canvas.clear();
  // the following deals with an overflow bug when resizing an empty canvas with previous dimensions
  canvas.setDimensions({ width: 1, height: 1 });
  setCurrentImage(null);
}

function switchImage(index, allImageData, previousImageDataLength) {
  if (index < allImageData.length) {
    const nextImageId = (index - (previousImageDataLength - allImageData.length)) + 1;
    updateCurrentImageIds(-1, allImageData.length);
    window.switchImage(nextImageId);
  } else if (allImageData.length > 0) {
    updateCurrentImageIds(-1, allImageData.length);
    window.switchImage(allImageData.length - 1);
  } else {
    resetEverything();
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
  const imageNodes = document.getElementById('image-list-image-container').childNodes;
  for (let i = 0; i < imageNodes.length; i += 1) {
    const imageElement = imageNodes[i].childNodes[0];
    imageElement.id = i;
    imageNodes[i].onclick = window.switchImage.bind(this, i);
  }
}

function removeImage(allImageDataArr) {
  const allImageData = allImageDataArr || getAllImageData();
  const index = getCurrentImageId();
  document.getElementById(index).parentElement.remove();
  resetRemainingImageElements();
  const previousImageDataLength = allImageData.length;
  allImageData.splice(index, 1);
  removeAllLabelRefs();
  removeAllShapes();
  setPolygonEditingButtonsToDisabled();
  switchImage(index, allImageData, previousImageDataLength);
}

function triggerRemoveImage() {
  const allImageData = getAllImageData();
  if (allImageData.length > 0) {
    if (getDoNotShowRemoveImageModalAgainState()) {
      removeImage(allImageData);
    } else {
      displayRemoveImagesModal();
    }
  }
}

function assignCanvasForRemovingImages(canvasArg) {
  canvas = canvasArg;
}

export { assignCanvasForRemovingImages, triggerRemoveImage, removeImage };

// initial code to get started on the multi-image removal functionality

// let imageRemoveList = [];

// function removeImage() {
//   const allImageData = getAllImageData();
//   if (allImageData.length > 0) {
//     const index = getCurrentImageId();
//     const tempAllImageDataLength = allImageData.length;
//     allImageData.splice(index, 1);
//     document.getElementById(index).parentElement.remove();
//     const imageNodes = document.getElementById('image-list-image-container').childNodes;
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
