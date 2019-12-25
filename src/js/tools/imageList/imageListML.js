import { getCurrentImageId } from '../toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';

let allImageDataRef = null;

// should use the same file as the one in the image list
function setThumbnailColourOverlayBackToDefault(element) {
  if (element.classList.contains('image-list-thumbnail-machine-learning-selected')) {
    element.classList.replace('image-list-thumbnail-machine-learning-selected', 'image-list-thumbnail-default');
  }
}

// should use the same file as the one in the image list
function updateNumberOfUncheckedMLImages() {
  const currentImageId = getCurrentImageId();
  const currentImage = allImageDataRef[currentImageId];
  if (currentImage.numberOfMLGeneratedShapes > 0) {
    currentImage.numberOfMLGeneratedShapes -= 1;
    if (currentImage.numberOfMLGeneratedShapes === 0) {
      setThumbnailColourOverlayBackToDefault(currentImage.thumbnailElementRef.childNodes[1]);
    }
  }
}

function initialiseImageListML(allImageDataObj) {
  allImageDataRef = allImageDataObj;
}

export { initialiseImageListML, updateNumberOfUncheckedMLImages };
