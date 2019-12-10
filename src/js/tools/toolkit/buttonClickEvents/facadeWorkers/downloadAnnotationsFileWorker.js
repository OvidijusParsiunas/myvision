// import { downloadXML } from '../facadeWorkersUtils/downloadFile/fileTypes/XML';
import downloadCSV from '../facadeWorkersUtils/downloadFile/fileTypes/CSV';

function downloadTrainingDataEvent(canvas) {
  canvas.discardActiveObject();
  downloadCSV();
  // nothing to download message
}

export { downloadTrainingDataEvent as default };
