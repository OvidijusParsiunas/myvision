// import { downloadXML } from '../facadeWorkersUtils/downloadFile/fileTypes/XML';
import downloadCOCOJSON from '../facadeWorkersUtils/downloadFile/fileTypes/COCOJSON';

function downloadTrainingDataEvent(canvas) {
  canvas.discardActiveObject();
  downloadCOCOJSON();
  // nothing to download message
}

export { downloadTrainingDataEvent as default };
