import { getCurrentImageId } from '../toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';

let allImageDataRef = null;

function updateNumberOfUncheckedMLImages() {
  const currentImageId = getCurrentImageId();
  console.log(allImageDataRef[currentImageId]);
}

function initialiseImageListML(allImageDataObj) {
  allImageDataRef = allImageDataObj;
}

export { initialiseImageListML, updateNumberOfUncheckedMLImages };
