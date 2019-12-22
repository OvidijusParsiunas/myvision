import { drawImageFromList, getImageProperties, calculateCurrentImageHeightRatio } from '../toolkit/buttonClickEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';
import { removeAndRetrieveAllShapeRefs, getNumberOfShapes } from '../../canvas/objects/allShapes/allShapes';
import { removeAndRetrieveAllLabelRefs } from '../../canvas/objects/label/label';
import { repopulateLabelAndShapeObjects, setShapeMovablePropertiesOnImageSelect } from '../../canvas/objects/allShapes/labelAndShapeBuilder';
import { resetZoom, zoomOutObjectOnImageSelect, switchCanvasWrapperInnerElement } from '../toolkit/buttonClickEvents/facadeWorkers/zoomWorker';
import { removeAllLabelListItems } from '../labelList/labelList';
import { setDefaultState, setCurrentImageId } from '../toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';
import { switchCanvasWrapperInnerElementsDisplay } from '../../canvas/utils/canvasUtils';
import labelProperties from '../../canvas/objects/label/properties';
import { initialiseImageListML } from './imageListML';

let currentImageNameElement = null;
let currentlyActiveElement = null;
const images = [];
let currentlySelectedImageId = 0;
let newImageId = 0;
let firstImage = true;
let imageListOverflowParent = null;
let currentlySelectedImageAffectedByML = false;

function findImageListElement() {
  currentImageNameElement = document.getElementById('currentImageName');
  imageListOverflowParent = document.getElementById('image-list-overflow-parent');
}

function initialiseImageListFunctionality() {
  findImageListElement();
  initialiseImageListML(images);
}

function getAllImageData() {
  return images;
}

function initialiseImageElement() {
  return document.createElement('img');
}

function initiateDivElement() {
  return document.createElement('div');
}

function addNewItemToImageList(imageData) {
  const imageThumbnailElement = initialiseImageElement();
  imageThumbnailElement.id = newImageId;
  imageThumbnailElement.classList.add('image-list-thumbnail-image');
  imageThumbnailElement.src = imageData.src;
  const colorOverlayElement = initiateDivElement();
  colorOverlayElement.classList.add('image-list-thumbnail-color-overlay');
  colorOverlayElement.classList.add('image-list-thumbnail-default');
  const tickSVGElement = initialiseImageElement();
  tickSVGElement.classList.add('image-list-thumbnail-SVG-tick-icon');
  tickSVGElement.src = 'done-tick-highlighted.svg';
  const parentThumbnailDivElement = initiateDivElement();
  parentThumbnailDivElement.classList.add('image-list-thumbnail');
  parentThumbnailDivElement.onclick = window.switchImage.bind(this, newImageId);
  parentThumbnailDivElement.appendChild(imageThumbnailElement);
  parentThumbnailDivElement.appendChild(colorOverlayElement);
  parentThumbnailDivElement.appendChild(tickSVGElement);
  imageListOverflowParent.appendChild(parentThumbnailDivElement);
  return parentThumbnailDivElement;
}

function displayTickSVGOverImageThumbnail() {
  images[currentlySelectedImageId].thumbnailElementRef.childNodes[2].style.display = 'block';
}

function removeTickSVGOverImageThumbnail() {
  if (getNumberOfShapes() === 0) {
    images[currentlySelectedImageId].thumbnailElementRef.childNodes[2].style.display = 'none';
  }
}

function changeThumbnailWidthIfOnRight(element, width) {
  if (element.childNodes[0].id % 2 === 1) {
    element.childNodes[1].style.width = width;
  }
}

function highlightCurrentImageThumbnailForML(element) {
  element.childNodes[1].style.background = '#0080001f';
  currentlySelectedImageAffectedByML = true;
}

function highlightImageThumbnailForML(element) {
  element.childNodes[1].style.display = 'block';
  element.childNodes[1].classList.replace('image-list-thumbnail-default', 'image-list-thumbnail-machine-learning');
  changeThumbnailWidthIfOnRight(element, 'calc(100% - 6px)');
}

function setCurrentlyActiveElementToInvisible() {
  if (currentlyActiveElement) {
    currentlyActiveElement.style.display = 'none';
    if (currentlySelectedImageAffectedByML) {
      currentlyActiveElement.style.background = '';
      currentlySelectedImageAffectedByML = false;
    }
  }
}

function setThumbnailColourOverlayBackToDefault(element) {
  element.classList.replace('image-list-thumbnail-machine-learning', 'image-list-thumbnail-default');
  if (element.style.width === 'calc(100% - 6px') {
    element.style.width = 'calc(100% - 4px)';
  }
}

function highlightImageThumbnail(element) {
  setCurrentlyActiveElementToInvisible();
  if (element.classList.contains('image-list-thumbnail-machine-learning')) {
    setThumbnailColourOverlayBackToDefault(element);
  }
  element.style.display = 'block';
  currentlyActiveElement = element;
}

function addNewImage(imageName, imageData) {
  const thumbnailElementRef = addNewItemToImageList(imageData);
  const imageObject = {
    data: imageData, name: imageName, shapes: {}, labels: {}, thumbnailElementRef,
  };
  images.push(imageObject);
}

function captureCurrentImageData() {
  images[currentlySelectedImageId].shapes = removeAndRetrieveAllShapeRefs();
  images[currentlySelectedImageId].labels = removeAndRetrieveAllLabelRefs();
  const currentlySelectedImageProperties = getImageProperties();
  const imageDimensions = {};
  imageDimensions.scaleX = currentlySelectedImageProperties.scaleX;
  imageDimensions.scaleY = currentlySelectedImageProperties.scaleY;
  imageDimensions.originalWidth = currentlySelectedImageProperties.originalWidth;
  imageDimensions.originalHeight = currentlySelectedImageProperties.originalHeight;
  imageDimensions.oldImageHeightRatio = calculateCurrentImageHeightRatio();
  imageDimensions.polygonOffsetLeft = labelProperties.pointOffsetProperties().left;
  imageDimensions.polygonOffsetTop = labelProperties.pointOffsetProperties().top;
  images[currentlySelectedImageId].imageDimensions = imageDimensions;
}

function saveAndRemoveCurrentImageDetails() {
  if (!firstImage) {
    captureCurrentImageData();
  }
  removeAllLabelListItems();
  const timesZoomedOut = resetZoom(false);
  zoomOutObjectOnImageSelect(images[currentlySelectedImageId].shapes,
    images[currentlySelectedImageId].labels, timesZoomedOut);
  currentlySelectedImageId = newImageId;
  setCurrentImageId(newImageId);
  firstImage = false;
}

function setDefaultImageProperties(image, imageMetadata) {
  image.imageDimensions = {};
  image.shapes = {};
  image.labels = {};
  image.size = imageMetadata.size;
}

function addSingleImageToList(imageMetadata, imageData) {
  addNewImage(imageMetadata.name, imageData);
  saveAndRemoveCurrentImageDetails();
  currentImageNameElement.innerHTML = imageMetadata.name;
  highlightImageThumbnail(images[newImageId].thumbnailElementRef.childNodes[1]);
  images[newImageId].thumbnailElementRef.scrollIntoView();
  setDefaultImageProperties(images[newImageId], imageMetadata);
  newImageId += 1;
}

function addImageFromMultiUploadToList(imageMetadata, imageData, firstFromMany) {
  addNewImage(imageMetadata.name, imageData);
  setDefaultImageProperties(images[newImageId], imageMetadata);
  if (firstFromMany) {
    saveAndRemoveCurrentImageDetails();
    currentImageNameElement.innerHTML = imageMetadata.name;
    highlightImageThumbnail(images[newImageId].thumbnailElementRef.childNodes[1]);
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
  if (childBoundingRect.top < parentBoundingRect.top
    || childBoundingRect.bottom > parentBoundingRect.bottom) {
    return false;
  }
  return true;
}

function scrollIntoViewIfNeeded(childElement, parentElement) {
  if (!isElementHeightFullyVisibleInParent(childElement, parentElement)) {
    childElement.scrollIntoView();
  }
}

// the reason why we do not use scaleX/scaleY is because these are returned in
// a promise as the image is drawn hence we do not have it at this time
// (for the new image)
function changeToExistingImage(id) {
  // things to take before evaluatng the current shapes on the current image
  // get shapes
  // zoomOutObjectOnImageSelect
  // make sure the scales are correct

  setDefaultState(false);
  captureCurrentImageData();
  removeAllLabelListItems();
  const timesZoomedOut = resetZoom(true);
  drawImageFromList(images[id].data);
  repopulateLabelAndShapeObjects(images[id].shapes, images[id].labels,
    images[id].imageDimensions, images[id].data);
  switchCanvasWrapperInnerElementsDisplay();
  setShapeMovablePropertiesOnImageSelect(images[id].shapes);
  zoomOutObjectOnImageSelect(images[currentlySelectedImageId].shapes,
    images[currentlySelectedImageId].labels, timesZoomedOut);
  currentlySelectedImageId = id;
  setCurrentImageId(id);
  switchCanvasWrapperInnerElement();
  changeCurrentImageElementText(id);
  highlightImageThumbnail(images[id].thumbnailElementRef.childNodes[1]);
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
  switchImage, canSwitchImage, addImageFromMultiUploadToList,
  initialiseImageListFunctionality, highlightImageThumbnailForML,
  highlightCurrentImageThumbnailForML, removeTickSVGOverImageThumbnail,
  displayTickSVGOverImageThumbnail, addSingleImageToList, getAllImageData,
};
