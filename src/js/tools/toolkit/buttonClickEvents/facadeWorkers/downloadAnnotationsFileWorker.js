// import { downloadXML } from '../facadeWorkersUtils/downloadFile/fileTypes/XML';
import downloadYOLOTXT from '../facadeWorkersUtils/downloadFile/fileTypes/YOLOTXT';

function downloadTrainingDataEvent(canvas) {
  canvas.discardActiveObject();
  downloadYOLOTXT();
  // nothing to download message
}

export { downloadTrainingDataEvent as default };
