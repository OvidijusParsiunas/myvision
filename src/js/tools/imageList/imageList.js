import { drawImageFromList } from '../toolkit/buttonClickEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';
import { removeAndRetrieveAllShapeRefs } from '../../canvas/objects/allShapes/allShapes';
import { removeAndRetrieveAllLabelRefs } from '../../canvas/objects/label/label';
import { repopulateLabelAndShapeObjects, setShapeMovablePropertiesOnImageSelect } from '../../canvas/objects/allShapes/labelAndShapeBuilder';
import { resetZoom, zoomOutObjectOnImageSelect, switchCanvasWrapperInnerElement } from '../toolkit/buttonClickEvents/facadeWorkers/zoomWorker';
import { removeAllLabelListItems } from '../labelList/labelList';
import { setDefaultState } from '../toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';
import { switchCanvasWrapperInnerElementsDisplay } from '../../canvas/utils/canvasUtils';

let imageListElement = null;
let currentImageNameElement = null;
const images = [];
let currentlySelectedImageId = 0;
let newImageId = 0;
let firstImage = true;

function findImageListElement() {
  imageListElement = document.getElementById('image-list');
  currentImageNameElement = document.getElementById('currentImageName');
}

function initialiseImageListFunctionality() {
  findImageListElement();
}

function createImageElementMarkup(imageName, id) {
  return `
  <div id="imageId${id}" onClick="switchImage(${id})" class="image${id} imageListItem">
    <div id="imageName${id}" spellcheck="false" class="imageName" contentEditable="false" style="user-select: none; padding-right: 29px; border: 1px solid transparent; display: grid;">${imageName}</div>
    </div>
  </div>
  `;
}

function addNewDiv() {
  return '<img src="sample-img.jpg" style="float: left; width: calc(50% - 4px); border-bottom: 1px solid white">';
}

function initialiseParentElement() {
  return document.createElement('img');
}

function addNewItemToImageList(imageName) {
  // use nth child to render a border in the middle
  const imageListOverflowParent = document.getElementById('image-list-overflow-parent');
  const imageParentElement = initialiseParentElement();
  imageParentElement.id = newImageId;
  imageParentElement.style = 'float: left; width: calc(50% - 0.5px); border-bottom: 1px solid white';
  imageParentElement.src = 'sample-img.jpg';
  // imageParentElement.innerHTML = addNewDiv();
  // const newRow = imageListElement.insertRow(-1);
  // const cell = newRow.insertCell(0);
  imageListOverflowParent.appendChild(imageParentElement);
  // imageListElement.scrollLeft = 0;
  // cell.scrollIntoView();
}

function addNewImage(imageName, imageData) {
  const imageObject = {
    data: imageData, name: imageName, shapes: {}, labels: {},
  };
  images.push(imageObject);
  addNewItemToImageList(imageName);
}

function saveAndRemoveCurrentImageDetails() {
  if (!firstImage) {
    images[currentlySelectedImageId].shapes = removeAndRetrieveAllShapeRefs();
    images[currentlySelectedImageId].labels = removeAndRetrieveAllLabelRefs();
  }
  removeAllLabelListItems();
  const timesZoomedOut = resetZoom(false);
  zoomOutObjectOnImageSelect(images[currentlySelectedImageId].shapes,
    images[currentlySelectedImageId].labels, timesZoomedOut);
  currentlySelectedImageId = newImageId;
  firstImage = false;
}

function addSingleImageToList(imageName, imageData) {
  addNewImage(imageName, imageData);
  saveAndRemoveCurrentImageDetails();
  currentImageNameElement.innerHTML = imageName;
  newImageId += 1;
}

function addImageFromMultiUploadToList(imageName, imageData, firstFromMany) {
  addNewImage(imageName, imageData);
  if (firstFromMany) {
    saveAndRemoveCurrentImageDetails();
    currentImageNameElement.innerHTML = imageName;
  }
  newImageId += 1;
}

function changeCurrentImageElementText(id) {
  currentImageNameElement.innerHTML = images[id].name;
}

function changeToExistingImage(id) {
  setDefaultState(false);
  images[currentlySelectedImageId].shapes = removeAndRetrieveAllShapeRefs();
  images[currentlySelectedImageId].labels = removeAndRetrieveAllLabelRefs();
  removeAllLabelListItems();
  const timesZoomedOut = resetZoom(true);
  repopulateLabelAndShapeObjects(images[id].shapes, images[id].labels);
  drawImageFromList(images[id].data);
  switchCanvasWrapperInnerElementsDisplay();
  setShapeMovablePropertiesOnImageSelect(images[id].shapes);
  zoomOutObjectOnImageSelect(images[currentlySelectedImageId].shapes,
    images[currentlySelectedImageId].labels, timesZoomedOut);
  currentlySelectedImageId = id;
  switchCanvasWrapperInnerElement();
  changeCurrentImageElementText(id);
}

function switchImage(direction) {
  if (direction === 'previous') {
    if (currentlySelectedImageId !== 0) {
      changeToExistingImage(currentlySelectedImageId - 1);
    }
  } else if (direction === 'next') {
    if (currentlySelectedImageId !== images.length - 1) {
      changeToExistingImage(currentlySelectedImageId + 1);
    }
  } else if (direction !== currentlySelectedImageId) {
    changeToExistingImage(direction);
  }
}

function canSwitchImage(direction) {
  if (direction === 'previous') {
    return currentlySelectedImageId > 0;
  }
  if (direction === 'next') {
    return currentlySelectedImageId < (images.length - 1);
  }
  return direction !== currentlySelectedImageId;
}

export {
  initialiseImageListFunctionality, addSingleImageToList,
  switchImage, canSwitchImage, addImageFromMultiUploadToList,
};
