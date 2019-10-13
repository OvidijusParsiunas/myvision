import { drawImageFromList } from '../toolkit/buttonEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';
import { removeAndRetrieveAllShapeRefs } from '../../canvas/objects/allShapes/allShapes';
import { removeAndRetrieveAllLabelRefs } from '../../canvas/objects/label/label';
import { repopulateLabelAndShapeObjects, saveShapeMovablePropertiesOnImageSelect } from '../../canvas/objects/allShapes/labelAndShapeBuilder';
import { resetZoom, zoomOutObjectOnImageSelect, switchCanvasWrapperInnerElement } from '../toolkit/buttonEvents/facadeWorkers/zoomWorker';
import { removeLabelListItems } from '../labelList/labelList';
import { setDefaultState } from '../toolkit/buttonEvents/facadeWorkersUtils/stateManager';
import { switchCanvasElements } from '../../canvas/utils/canvasUtils';

let imageListElement = null;
const images = [];
let currentlySelectedImageId = 0;
let newImageId = 0;


function findImageListElement() {
  imageListElement = document.getElementById('image-list');
}

function initialiseImageListFunctionality() {
  findImageListElement();
}

function createImageElementMarkup(imageText, id) {
  return `
  <div id="imageId${id}" onClick="switchImage(${id})" class="image${id} imageListItem">
    <div id="imageText${id}" spellcheck="false" class="imageText" contentEditable="false" style="user-select: none; padding-right: 29px; border: 1px solid transparent; display: grid;">${imageText}</div>
    </div>
  </div>
  `;
}

function initialiseParentElement() {
  return document.createElement('div');
}

function addNewItemToImageList(imageText) {
  const imageParentElement = initialiseParentElement();
  imageParentElement.id = newImageId;
  imageParentElement.innerHTML = createImageElementMarkup(imageText, newImageId);
  const newRow = imageListElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.appendChild(imageParentElement);
  imageListElement.scrollLeft = 0;
  cell.scrollIntoView();
}

function addNewImageToList(imageText, imageData) {
  if (newImageId > 0) {
    images[currentlySelectedImageId].shapes = removeAndRetrieveAllShapeRefs();
    images[currentlySelectedImageId].labels = removeAndRetrieveAllLabelRefs();
  }
  const imageObject = { data: imageData };
  images.push(imageObject);
  removeLabelListItems();
  addNewItemToImageList(imageText);
  currentlySelectedImageId = newImageId;
  newImageId += 1;
}

function changeToExistingImage(id) {
  setDefaultState(false);
  window.cancel();
  images[currentlySelectedImageId].shapes = removeAndRetrieveAllShapeRefs();
  images[currentlySelectedImageId].labels = removeAndRetrieveAllLabelRefs();
  removeLabelListItems();
  const timesZoomedOut = resetZoom();
  repopulateLabelAndShapeObjects(images[id].shapes, images[id].labels);
  drawImageFromList(images[id].data);
  switchCanvasElements();
  saveShapeMovablePropertiesOnImageSelect(images[id].shapes);
  zoomOutObjectOnImageSelect(images[currentlySelectedImageId].shapes,
    images[currentlySelectedImageId].labels, timesZoomedOut);
  currentlySelectedImageId = id;
  switchCanvasWrapperInnerElement();
}

function switchImage(id) {
  if (id === 'previous') {
    if (currentlySelectedImageId !== 0) {
      changeToExistingImage(currentlySelectedImageId - 1);
    }
  } else if (id === 'next') {
    if (currentlySelectedImageId !== images.length - 1) {
      changeToExistingImage(currentlySelectedImageId + 1);
    }
  } else if (id !== currentlySelectedImageId) {
    changeToExistingImage(id);
  }
}

function isImageAlreadySelected(id) {
  if (id !== currentlySelectedImageId) {
    return false;
  }
  return true;
}

export {
  initialiseImageListFunctionality, addNewImageToList, switchImage, isImageAlreadySelected,
};
