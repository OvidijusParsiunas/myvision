import uploadImages from './uploadImages';

let bodyElement = null;
let imageListDragAndDropOverlayElement = null;
let windowDragAndDropOverlayElement = null;

function assignLocalVariables() {
  bodyElement = document.getElementsByTagName('body')[0];
  imageListDragAndDropOverlayElement = document.getElementById('image-list-drag-and-drop-overlay');
  windowDragAndDropOverlayElement = document.getElementById('window-drag-and-drop-overlay');
}

function dropHandler(event) {
  uploadImages(event.dataTransfer);
}

function displayDragAndDropOverlays() {
  imageListDragAndDropOverlayElement.style.display = 'block';
  windowDragAndDropOverlayElement.style.display = 'block';
}

function hideDragAndDropOverlays() {
  imageListDragAndDropOverlayElement.style.display = 'none';
  windowDragAndDropOverlayElement.style.display = 'none';
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
  assignListener(windowDragAndDropOverlayElement, ['dragleave', 'drop'], hideDragAndDropOverlays);
  assignListener(windowDragAndDropOverlayElement, ['drop'], dropHandler);
  assignListener(bodyElement, ['dragenter'], displayDragAndDropOverlays);
}

function initialiseImageListDragAndDropEvents() {
  assignLocalVariables();
  assignEventListeners();
}

export { initialiseImageListDragAndDropEvents as default };
