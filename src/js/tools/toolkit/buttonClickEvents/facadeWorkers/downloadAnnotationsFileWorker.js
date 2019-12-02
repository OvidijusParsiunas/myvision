import { downloadVGGJSON } from '../facadeWorkersUtils/downloadFile/fileTypes/XML';

function downloadTrainingDataEvent(canvas) {
  canvas.discardActiveObject();
  downloadVGGJSON();
  // nothing to download message
}

export { downloadTrainingDataEvent as default };
