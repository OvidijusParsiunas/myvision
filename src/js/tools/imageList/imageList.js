import { drawImageFromList } from '../toolkit/buttonEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';
import { removeAndRetrieveAllShapeRefs } from '../../canvas/objects/allShapes/allShapes';
import { removeAllLabels } from '../../canvas/objects/label/label';
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

function addNewImageToList(imageText, imageData) {
  const imageElement = initialiseParentElement();
  imageElement.id = newImageId;
  const imageObject = { data: imageData, shapes: removeAndRetrieveAllShapeRefs() }
  images.push(imageObject);
  removeAllLabels();
  removeLabelListItems();
  imageElement.innerHTML = createImageElementMarkup(imageText, newImageId);
  const newRow = imageListElement.insertRow(-1);
  const cell = newRow.insertCell(0);
  cell.appendChild(imageElement);
  imageListElement.scrollLeft = 0;
  cell.scrollIntoView();
  currentlySelectedImageId = newImageId;
  newImageId += 1;
}

window.selectImageFromList = (id) => {
  if (id !== currentlySelectedImageId) {
    images[currentlySelectedImageId].shapes = removeAndRetrieveAllShapeRefs();
    removeAllLabels();
    removeLabelListItems();
    window.cancel();
    resetZoom();
    drawImageFromList(images[id].data);
    repopulateLabelAndShapeObjects(images[id].shapes);
    currentlySelectedImageId = id;
  }
};

export { initialiseImageListFunctionality, addNewImageToList };
