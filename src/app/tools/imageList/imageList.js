import { drawImageFromList, getImageProperties, calculateCurrentImageHeightRatio } from './uploadImages/drawImageOnCanvas.js';
import { updateCrosshairDimensionsAndHideAsync, moveCanvasCrosshairViaLastCanvasPositionAsync } from '../../canvas/mouseInteractions/cursorModes/drawWithCrosshairMode.js';
import { removeAllShapeRefs, retrieveAllShapeRefs } from '../../canvas/objects/allShapes/allShapes.js';
import { retrieveAllLabelRefs, removeAllLabelRefs } from '../../canvas/objects/label/label.js';
import { repopulateLabelAndShapeObjects } from '../../canvas/objects/allShapes/labelAndShapeBuilder.js';
import { resetZoom, zoomOutObjectOnImageSelect } from '../toolkit/buttonClickEvents/facadeWorkers/zoomWorker.js';
import { removeAllLabelListItems } from '../labelList/labelList.js';
import { switchCanvasContainerElements } from '../../canvas/utils/canvasUtils.js';
import labelProperties from '../../canvas/objects/label/properties.js';
import { initialiseImageListML } from './imageListML.js';
import { getCanvasReferences } from '../../canvas/utils/fabricUtils.js';
import purgeCanvasMouseEvents from '../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers.js';
import assignDefaultEvents from '../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers.js';
import { updateImageNameElement } from '../imageSwitchPanel/style.js';
import scrollIntoViewIfNeeded from '../utils/tableUtils.js';
import { setDefaultCursorMode } from '../../canvas/mouseInteractions/cursorModes/defaultMode.js';
import { changeExistingImagesMovability } from '../settingsPopup/options/movableObjects.js';
import { removeWatermarkFromCanvasAreaBackground } from '../../canvas/utils/watermark.js';
import { initiateButtonPulseAnimation } from '../utils/buttons/pulseAnimation.js';
import {
  setZoomInButtonToDefault, setCreatePolygonButtonToActive, setRemoveImagesButtonDefault,
  setCreateBoundingBoxButtonToDefault, setCreatePolygonButtonToDefault, setEditShapesButtonToActive,
  setCreateBoundingBoxButtonToActive, setPolygonEditingButtonsToDefault,
} from '../toolkit/styling/state.js';
import {
  getDefaultState, setCurrentImageId, getContinuousDrawingState,
  setHasMachineLearningButtonBeenHighligtedState, getCrosshairUsedOnCanvasState,
  getHasMachineLearningButtonBeenHighligtedState, getLastDrawingModeState,
} from '../state.js';

let currentlyActiveElement = null;
let imageContainerElement = null;
const images = [];
let currentlySelectedImageId = 0;
let canvas = null;
let newImageId = 0;
let hasCurrentImageThumbnailRedBorder = false;
const ANIMATION_DURATION_MILLISECONDS = 300;

function updateCurrentImageIds(currentId, newId) {
  currentlySelectedImageId = currentId;
  newImageId = newId;
}

function findImageContainerElement() {
  imageContainerElement = document.getElementById('image-list-image-container');
}

function initialiseImageList() {
  findImageContainerElement();
  initialiseImageListML(images);
}

function getAllImageData() {
  return images;
}

function getImageIdByName(imageName) {
  for (let i = 0; i < images.length; i += 1) {
    if (imageName === images[i].name) {
      return i;
    }
  }
  return null;
}

function getLastImageIdByName(imageName) {
  for (let i = images.length - 1; i >= 0; i -= 1) {
    if (imageName === images[i].name) {
      return i;
    }
  }
  return null;
}

function initialiseImageElement() {
  return document.createElement('img');
}

function initiateDivElement() {
  return document.createElement('div');
}

function appendAnimationReadyStyling(imageThumbnailElement) {
  imageThumbnailElement.style.transition = `${ANIMATION_DURATION_MILLISECONDS / 1000}s`;
  imageThumbnailElement.style.maxHeight = '0%';
}

function triggerAnimation(imageThumbnailElement) {
  setTimeout(() => {
    imageThumbnailElement.style.maxHeight = '100%';
    setTimeout(() => {
      imageThumbnailElement.style.transition = '';
    }, ANIMATION_DURATION_MILLISECONDS);
  });
}

function addNewItemToImageList(imageData) {
  const imageThumbnailElement = initialiseImageElement();
  imageThumbnailElement.id = newImageId;
  imageThumbnailElement.classList.add('image-list-thumbnail-image');
  imageThumbnailElement.src = imageData.src;
  imageThumbnailElement.setAttribute('draggable', false);
  imageThumbnailElement.setAttribute('ondragstart', 'return false'); // for firefox
  appendAnimationReadyStyling(imageThumbnailElement);
  const colorOverlayElement = initiateDivElement();
  colorOverlayElement.classList.add('image-list-thumbnail-color-overlay');
  colorOverlayElement.classList.add('image-list-thumbnail-default');
  const tickSVGElement = initialiseImageElement();
  tickSVGElement.classList.add('image-list-thumbnail-SVG-tick-icon');
  tickSVGElement.src = 'assets/svg/done-tick-highlighted.svg';
  const parentThumbnailDivElement = initiateDivElement();
  parentThumbnailDivElement.classList.add('image-list-thumbnail');
  parentThumbnailDivElement.onclick = window.switchImage.bind(this, newImageId);
  parentThumbnailDivElement.appendChild(imageThumbnailElement);
  parentThumbnailDivElement.appendChild(colorOverlayElement);
  parentThumbnailDivElement.appendChild(tickSVGElement);
  imageContainerElement.appendChild(parentThumbnailDivElement);
  triggerAnimation(imageThumbnailElement);
  return parentThumbnailDivElement;
}

function displayTickSVGOverImageThumbnail(id) {
  const imageId = id !== undefined ? id : currentlySelectedImageId;
  if (images[imageId]) images[imageId].thumbnailElementRef.childNodes[2].style.display = 'block';
}

function removeTickSVGOverImageThumbnail(id) {
  images[id].thumbnailElementRef.childNodes[2].style.display = 'none';
}

function setDefaultImageThumbnailHighlightToMLSelected(element) {
  element.childNodes[1].classList.replace('image-list-thumbnail-default', 'image-list-thumbnail-machine-learning-selected');
  const imageId = element.childNodes[0].id;
  displayTickSVGOverImageThumbnail(imageId);
}

function setDefaultImageThumbnailHighlightToML(element) {
  element.childNodes[1].classList.replace('image-list-thumbnail-default', 'image-list-thumbnail-machine-learning');
  element.childNodes[1].style.display = 'block';
  const imageId = element.childNodes[0].id;
  displayTickSVGOverImageThumbnail(imageId);
}

function removeMLThumbnailHighlight(element) {
  element.childNodes[1].classList.replace('image-list-thumbnail-machine-learning', 'image-list-thumbnail-default');
  element.childNodes[1].style.display = 'none';
}

function removeSelectedMLThumbnailHighlight(element) {
  element.childNodes[1].classList.replace('image-list-thumbnail-machine-learning-selected', 'image-list-thumbnail-default');
}

function setMLThumbnailOverlayToMLSelected(element) {
  if (element.classList.contains('image-list-thumbnail-machine-learning')) {
    element.classList.replace('image-list-thumbnail-machine-learning', 'image-list-thumbnail-machine-learning-selected');
  }
}

function setSelectedMLThumbnailColourOverlayBackToDefault(element) {
  if (element.classList.contains('image-list-thumbnail-machine-learning-selected')) {
    element.classList.replace('image-list-thumbnail-machine-learning-selected', 'image-list-thumbnail-default');
    displayTickSVGOverImageThumbnail();
  }
}

function setMLGeneratedShapesToOriginalColorPallette() {
  if (images[currentlySelectedImageId].numberOfMLGeneratedShapes > 0) {
    Object.keys(images[currentlySelectedImageId].shapes).forEach((key) => {
      const shape = images[currentlySelectedImageId].shapes[key].shapeRef;
      if (shape.MLPallette) {
        shape.fill = shape.trueFill;
        shape.stroke = shape.trueStroke;
        shape.MLPallette = false;
      }
    });
    images[currentlySelectedImageId].numberOfMLGeneratedShapes = 0;
  }
}

function setCurrentlyActiveElementToInvisible() {
  if (currentlyActiveElement) {
    currentlyActiveElement.style.display = 'none';
    setSelectedMLThumbnailColourOverlayBackToDefault(currentlyActiveElement);
  }
}

function highlightImageThumbnail(element) {
  setCurrentlyActiveElementToInvisible();
  setMLThumbnailOverlayToMLSelected(element);
  if (hasCurrentImageThumbnailRedBorder) {
    element.style.borderColor = '#ff4d4d';
  }
  element.style.display = 'block';
  currentlyActiveElement = element;
}

function changeImageThumbnailBorderColorToRed() {
  if (currentlyActiveElement) {
    hasCurrentImageThumbnailRedBorder = true;
    currentlyActiveElement.style.borderColor = '#ff4d4d';
  }
}

function resetImageThumbnailBorderColor() {
  hasCurrentImageThumbnailRedBorder = false;
  if (currentlyActiveElement) {
    currentlyActiveElement.style.borderColor = '';
  }
}

function addNewImage(imageName, imageData) {
  const thumbnailElementRef = addNewItemToImageList(imageData);
  const imageObject = {
    data: imageData, name: imageName, shapes: {}, labels: {}, thumbnailElementRef,
  };
  images.push(imageObject);
}

function captureCurrentImageData() {
  images[currentlySelectedImageId].labels = retrieveAllLabelRefs();
  images[currentlySelectedImageId].shapes = retrieveAllShapeRefs();
  removeAllLabelRefs();
  removeAllShapeRefs();
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
  if (images.length > 1) {
    captureCurrentImageData();
  } else {
    setEditShapesButtonToActive();
  }
  removeAllLabelListItems();
  const timesZoomedOut = resetZoom(false);
  zoomOutObjectOnImageSelect(images[currentlySelectedImageId].shapes,
    images[currentlySelectedImageId].labels, timesZoomedOut);
  setMLGeneratedShapesToOriginalColorPallette();
  currentlySelectedImageId = newImageId;
  setCurrentImageId(newImageId);
}

function setDefaultImageProperties(image, imageMetadata) {
  image.imageDimensions = { scaleX: 1, scaleY: 1 };
  image.shapes = {};
  image.labels = {};
  image.size = imageMetadata.size;
  image.numberOfMLGeneratedShapes = 0;
  image.analysedByML = false;
}

function setToolkitStylingOnNewImage() {
  if (!getDefaultState() && getContinuousDrawingState()) {
    const lastDrawnShapeState = getLastDrawingModeState();
    if (lastDrawnShapeState === 'polygon') {
      setCreatePolygonButtonToActive();
      setCreateBoundingBoxButtonToDefault();
    } else if (lastDrawnShapeState === 'boundingBox') {
      setCreateBoundingBoxButtonToActive();
      setCreatePolygonButtonToDefault();
    } else {
      assignDefaultEvents(canvas, null, false);
      setCreatePolygonButtonToDefault();
      setCreateBoundingBoxButtonToDefault();
    }
  } else {
    setCreatePolygonButtonToDefault();
    setCreateBoundingBoxButtonToDefault();
  }
  setPolygonEditingButtonsToDefault();
  setRemoveImagesButtonDefault();
  setZoomInButtonToDefault();
}

function changeCurrentImageNameElementText(imageName, isfirstFromMany) {
  updateImageNameElement(imageName, images, currentlySelectedImageId, isfirstFromMany);
}

function highlightMachineLearningButton() {
  if (!getHasMachineLearningButtonBeenHighligtedState()) {
    const beginAnimationImmediately = true;
    initiateButtonPulseAnimation(document.getElementById('machine-learning-button'),
      'rgb(184 233 179)', 'white', 5, beginAnimationImmediately);
    setHasMachineLearningButtonBeenHighligtedState(true);
  }
}

function displayUploadedImage(imageMetadata, isfirstFromMany) {
  highlightImageThumbnail(images[newImageId].thumbnailElementRef.childNodes[1]);
  saveAndRemoveCurrentImageDetails();
  changeCurrentImageNameElementText(imageMetadata.name, isfirstFromMany);
  images[newImageId].thumbnailElementRef.scrollIntoView();
  removeWatermarkFromCanvasAreaBackground();
  setToolkitStylingOnNewImage();
  highlightMachineLearningButton();
  if (getCrosshairUsedOnCanvasState()) updateCrosshairDimensionsAndHideAsync(canvas);
}

function addSingleImageToList(imageMetadata, imageData) {
  addNewImage(imageMetadata.name, imageData);
  setDefaultImageProperties(images[newImageId], imageMetadata);
  displayUploadedImage(imageMetadata, false);
  newImageId += 1;
}

function addImageFromMultiUploadToList(imageMetadata, imageData, isfirstFromMany) {
  addNewImage(imageMetadata.name, imageData);
  setDefaultImageProperties(images[newImageId], imageMetadata);
  if (images.length === 1 || isfirstFromMany) {
    displayUploadedImage(imageMetadata, isfirstFromMany);
  }
  newImageId += 1;
}

// to replicate the bug, carry out the following:
// upload image, draw bounding box, upload new image, come back to the first
// and use diagonal scaling to the right edge
// NOTE: some of the code to fix a similar bug is located in the purgeAllMouseEvents.js file
function fixForObjectScalingBugOnCanvasSwitch() {
  const { canvas1, canvas2 } = getCanvasReferences();
  if (canvas1 && canvas1.__eventListeners && canvas1.__eventListeners['object:scaling'] && canvas1.__eventListeners['object:scaling'].length > 1) {
    assignDefaultEvents(canvas2, null, false);
  }
}

// the following function is implemented to set properties for unseen shapes that have been
// uploaded where I had to originall setDefault(false) in order to trigger some of the contained
// functions in order to set the objects correctly. There is still some scepticism for whether
// this is working correctly, hence please be cautions.
function resetCanvasForUnseenShapes() {
  purgeCanvasMouseEvents(canvas);
  setDefaultCursorMode(canvas);
  assignDefaultEvents(canvas, null, false);
}

// the reason why we do not use scaleX/scaleY is because these are returned in
// a promise as the image is drawn hence we do not have it at this time
// (for the new image)
function changeToExistingImage(id) {
  if (currentlySelectedImageId >= 0) { captureCurrentImageData(); }
  removeAllLabelListItems();
  const timesZoomedOut = resetZoom(true);
  drawImageFromList(images[id].data);
  repopulateLabelAndShapeObjects(images[id].shapes, images[id].labels,
    images[id].imageDimensions, images[id].data);
  switchCanvasContainerElements();
  changeExistingImagesMovability(images[id].shapes);
  if (currentlySelectedImageId >= 0) {
    zoomOutObjectOnImageSelect(images[currentlySelectedImageId].shapes,
      images[currentlySelectedImageId].labels, timesZoomedOut);
  }
  setCurrentImageId(id);
  highlightImageThumbnail(images[id].thumbnailElementRef.childNodes[1]);
  scrollIntoViewIfNeeded(images[id].thumbnailElementRef, imageContainerElement);
  fixForObjectScalingBugOnCanvasSwitch();
  currentlySelectedImageId = id;
  changeCurrentImageNameElementText(images[currentlySelectedImageId].name);
  resetCanvasForUnseenShapes();
  setToolkitStylingOnNewImage();
  if (getCrosshairUsedOnCanvasState()) moveCanvasCrosshairViaLastCanvasPositionAsync();
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

function assignCanvasToImageList(canvasObj) {
  canvas = canvasObj;
}

export {
  assignCanvasToImageList,
  setDefaultImageThumbnailHighlightToML, switchImage, canSwitchImage,
  changeImageThumbnailBorderColorToRed, resetImageThumbnailBorderColor,
  displayTickSVGOverImageThumbnail, getAllImageData, initialiseImageList,
  addSingleImageToList, setSelectedMLThumbnailColourOverlayBackToDefault,
  addImageFromMultiUploadToList, updateCurrentImageIds, getLastImageIdByName,
  setDefaultImageThumbnailHighlightToMLSelected, removeTickSVGOverImageThumbnail,
  removeMLThumbnailHighlight, removeSelectedMLThumbnailHighlight, getImageIdByName,
};
