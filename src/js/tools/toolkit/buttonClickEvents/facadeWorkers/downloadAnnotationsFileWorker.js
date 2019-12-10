// import { downloadXML } from '../facadeWorkersUtils/downloadFile/fileTypes/XML';
import downloadXML from '../facadeWorkersUtils/downloadFile/fileTypes/XML';

function downloadTrainingDataEvent(canvas) {
  canvas.discardActiveObject();
  downloadXML();
  // nothing to download message
}

export { downloadTrainingDataEvent as default };
