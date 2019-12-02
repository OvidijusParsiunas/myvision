import { downloadJSON } from '../facadeWorkersUtils/downloadFile/fileTypes/XML';

function downloadTrainingDataEvent(canvas) {
  canvas.discardActiveObject();
  downloadJSON();

  // nothing to download message
}

export { downloadTrainingDataEvent as default };
