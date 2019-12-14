import { selectFormat } from './style';
import downloadCOCOJSON from '../toolkit/buttonClickEvents/facadeWorkersUtils/downloadFile/fileTypes/COCOJSON';

let currentlySelectedFormat = null;

function selectLabelExportFormat(format, target) {
  selectFormat(target);
  currentlySelectedFormat = currentlySelectedFormat === format ? '' : format;
}

function exportLabels() {
  switch (currentlySelectedFormat) {
    case 'COCO JSON':
      downloadCOCOJSON();
      break;
    default:
      break;
  }
}

export { selectLabelExportFormat, exportLabels };
