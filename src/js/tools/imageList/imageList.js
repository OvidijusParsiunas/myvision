import { drawImageFromList } from '../toolkit/buttonEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';
import { removeAndRetrieveAllShapeRefs } from '../../canvas/objects/allShapes/allShapes';
import { removeAndRetrieveAllLabelRefs } from '../../canvas/objects/label/label';
import { repopulateLabelAndShapeObjects } from '../../canvas/objects/allShapes/labelAndShapeBuilder';
import { resetZoom } from '../toolkit/buttonEvents/facadeWorkers/zoomWorker';
import { removeLabelListItems } from '../labelList/labelList';

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

// when adding points and clicking another image, the cursor for polygons doesn't refresh

function createImageElementMarkup(imageText, id) {
  return `
  <div id="imageId${id}" onClick="selectImageFromList(${id})" class="image${id} imageListItem">
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

window.selectImageFromList = (id) => {
  if (id !== currentlySelectedImageId) {
    window.cancel();
    images[currentlySelectedImageId].shapes = removeAndRetrieveAllShapeRefs();
    images[currentlySelectedImageId].labels = removeAndRetrieveAllLabelRefs();
    removeLabelListItems();
    resetZoom();
    drawImageFromList(images[id].data);
    repopulateLabelAndShapeObjects(images[id].shapes, images[id].labels);
    currentlySelectedImageId = id;
  }
};

export { initialiseImageListFunctionality, addNewImageToList };
