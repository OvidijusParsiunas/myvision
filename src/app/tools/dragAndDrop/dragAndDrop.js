import uploadImages from '../imageList/uploadImages/uploadImages.js';
import isAnyModalOpen from '../utils/modals/status.js';
import { getUploadDatasetsModalDisplayedState } from '../state.js';
import { getCurrentViewNumber } from '../uploadDatasetsModal/views/viewManager.js';
import { uploadDatasetFilesHandler } from '../uploadDatasetsModal/views/uploadDatasets/uploadDatasetFilesHandler.js';

let bodyElement = null;
let imageListDragAndDropOverlayElement = null;
let windowDragAndDropOverlayElement = null;
let uploadDatasetsDragAndDropOverlayElement = null;
let uploadDatasetsTable2Element = null;
let currentlyDisplayedOverlayElement = null;

function dropHandler(event) {
  if (currentlyDisplayedOverlayElement) {
    if (currentlyDisplayedOverlayElement === imageListDragAndDropOverlayElement) {
      uploadImages(event.dataTransfer);
    } else if (currentlyDisplayedOverlayElement === uploadDatasetsDragAndDropOverlayElement) {
      uploadDatasetFilesHandler(event.dataTransfer);
    }
  }
}

function displayDragAndDropOverlays() {
  if (isAnyModalOpen()) {
    if (getUploadDatasetsModalDisplayedState() && getCurrentViewNumber() === 5) {
      windowDragAndDropOverlayElement.style.display = 'block';
      uploadDatasetsDragAndDropOverlayElement.style.height = `${uploadDatasetsTable2Element.clientHeight - 8}px`;
      uploadDatasetsDragAndDropOverlayElement.style.display = 'block';
      currentlyDisplayedOverlayElement = uploadDatasetsDragAndDropOverlayElement;
    }
  } else {
    windowDragAndDropOverlayElement.style.display = 'block';
    imageListDragAndDropOverlayElement.style.display = 'block';
    currentlyDisplayedOverlayElement = imageListDragAndDropOverlayElement;
  }
}

function hideDragAndDropOverlays() {
  if (currentlyDisplayedOverlayElement) {
    currentlyDisplayedOverlayElement.style.display = 'none';
    windowDragAndDropOverlayElement.style.display = 'none';
  }
  currentlyDisplayedOverlayElement = null;
}

function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

function assignListener(element, events, handler) {
  events.forEach((event) => {
    element.addEventListener(event, handler, false);
  });
}

function assignEventListeners() {
  assignListener(windowDragAndDropOverlayElement, ['dragenter', 'dragover', 'dragleave', 'drop'], preventDefaults);
  assignListener(windowDragAndDropOverlayElement, ['drop'], dropHandler);
  assignListener(windowDragAndDropOverlayElement, ['dragleave', 'drop', 'mouseup'], hideDragAndDropOverlays);
  assignListener(bodyElement, ['dragenter'], displayDragAndDropOverlays);
}

function assignLocalVariables() {
  bodyElement = document.getElementsByTagName('body')[0];
  imageListDragAndDropOverlayElement = document.getElementById('image-list-drag-and-drop-overlay');
  windowDragAndDropOverlayElement = document.getElementById('window-drag-and-drop-overlay');
  uploadDatasetsDragAndDropOverlayElement = document.getElementById('upload-datasets-drag-and-drop-overlay');
  uploadDatasetsTable2Element = document.getElementById('upload-datasets-modal-upload-datasets-table-2');
}

function initialiseDragAndDropFunctionality() {
  assignLocalVariables();
  assignEventListeners();
}

export { initialiseDragAndDropFunctionality as default };
