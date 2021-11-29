import { getCurrentImageId } from '../state.js';

let allImageDataRef = null;

function displayTickSVGOverImageThumbnail(element) {
  element.style.display = 'block';
}

function setSelectedMLThumbnailColourOverlayBackToDefault(element) {
  if (element.classList.contains('image-list-thumbnail-machine-learning-selected')) {
    element.classList.replace('image-list-thumbnail-machine-learning-selected', 'image-list-thumbnail-default');
  }
}

function updateNumberOfUncheckedMLImages() {
  const currentImageId = getCurrentImageId();
  const currentImage = allImageDataRef[currentImageId];
  if (currentImage.numberOfMLGeneratedShapes > 0) {
    currentImage.numberOfMLGeneratedShapes -= 1;
    if (currentImage.numberOfMLGeneratedShapes === 0) {
      const thumbnailElements = currentImage.thumbnailElementRef.childNodes;
      setSelectedMLThumbnailColourOverlayBackToDefault(thumbnailElements[1]);
      displayTickSVGOverImageThumbnail(thumbnailElements[2]);
    }
  }
}

function initialiseImageListML(allImageDataObj) {
  allImageDataRef = allImageDataObj;
}

export { initialiseImageListML, updateNumberOfUncheckedMLImages };
