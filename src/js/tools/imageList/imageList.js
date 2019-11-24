import { drawImageFromList } from '../toolkit/buttonClickEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';
import { removeAndRetrieveAllShapeRefs, getNumberOfShapes } from '../../canvas/objects/allShapes/allShapes';
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
let imageListOverflowParent = null;

function findImageListElement() {
  imageListElement = document.getElementById('image-list');
  currentImageNameElement = document.getElementById('currentImageName');
  imageListOverflowParent = document.getElementById('image-list-overflow-parent');
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

function initiateDiv() {
  return document.createElement('div');
}

function addNewItemToImageList(imageName, imageData) {
  // use nth child to render a border in the middle
  const imageParentElement = initialiseParentElement();
  imageParentElement.id = newImageId;
  imageParentElement.style = 'position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;';
  imageParentElement.style.maxWidth = '100%';
  imageParentElement.style.maxHeight = '100%';
  const overlayDivElement = initiateDiv();
  imageParentElement.src = imageData.src;
  const divElement = initiateDiv();
  divElement.style = 'float: left; width: calc(50% - 0.5px); height: 60px; border-bottom: 1px solid #4e4b4b26; cursor: pointer; text-align: center; position: relative';
  divElement.classList.add('image-list-thumbnail');
  divElement.appendChild(imageParentElement);
  overlayDivElement.style = 'position: absolute; width: calc(100% - 4px); height: 56px; border: 2px solid #0dc7ff; display: none';
  divElement.appendChild(overlayDivElement);
  const tickSVGElement = initialiseParentElement();
  tickSVGElement.src = 'done-tick-highlighted.svg';
  tickSVGElement.style = 'position: absolute; width: 16%; height: 45%; bottom: 0px; right: 0px; display: none';
  divElement.appendChild(tickSVGElement);
  divElement.onclick = window.switchImage.bind(this, newImageId);
  imageListOverflowParent.appendChild(divElement);
  return divElement;
}

function displayTickSVGOverImageThumbnail() {
  images[currentlySelectedImageId].thumbnailElementRef.childNodes[2].style.display = '';
}

function removeTickSVGOverImageThumbnail() {
  if (getNumberOfShapes() === 0) {
    images[currentlySelectedImageId].thumbnailElementRef.childNodes[2].style.display = 'none';
  }
}

let currentlyActiveElement = null;

window.highlightImageThumbnail = (element) => {
  if (currentlyActiveElement) {
    currentlyActiveElement.style.display = 'none';
  }
  element.style.display = '';
  currentlyActiveElement = element;
};

function addNewImage(imageName, imageData) {
  const thumbnailElementRef = addNewItemToImageList(imageName, imageData);
  const imageObject = {
    data: imageData, name: imageName, shapes: {}, labels: {}, thumbnailElementRef,
  };
  images.push(imageObject);
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
  window.highlightImageThumbnail(images[newImageId].thumbnailElementRef.childNodes[1]);
  images[newImageId].thumbnailElementRef.scrollIntoView();
  newImageId += 1;
}

function addImageFromMultiUploadToList(imageName, imageData, firstFromMany) {
  addNewImage(imageName, imageData);
  if (firstFromMany) {
    saveAndRemoveCurrentImageDetails();
    currentImageNameElement.innerHTML = imageName;
    window.highlightImageThumbnail(images[newImageId].thumbnailElementRef.childNodes[1]);
    images[newImageId].thumbnailElementRef.scrollIntoView();
  }
  newImageId += 1;
}

function changeCurrentImageElementText(id) {
  currentImageNameElement.innerHTML = images[id].name;
}

function isElementHeightFullyVisibleInParent(childElement, parentElement) {
  const childBoundingRect = childElement.getBoundingClientRect();
  const parentBoundingRect = parentElement.getBoundingClientRect();
  if (childBoundingRect.top < parentBoundingRect.top || childBoundingRect.bottom > parentBoundingRect.bottom) {
    return false;
  }
  return true;
}

function scrollIntoViewIfNeeded(childElement, parentElement) {
  if (!isElementHeightFullyVisibleInParent(childElement, parentElement)) {
    childElement.scrollIntoView();
  }
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
  window.highlightImageThumbnail(images[id].thumbnailElementRef.childNodes[1]);
  scrollIntoViewIfNeeded(images[id].thumbnailElementRef, imageListOverflowParent);
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
  displayTickSVGOverImageThumbnail, removeTickSVGOverImageThumbnail,
};
