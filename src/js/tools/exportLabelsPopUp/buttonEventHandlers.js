import { selectFormat, hideExportLabelsPopUp } from './style';
import downloadCOCOJSON from '../toolkit/buttonClickEvents/facadeWorkersUtils/downloadFile/fileTypes/COCOJSON';

let currentlySelectedFormat = null;

function selectLabelExportFormat(format, target) {
  selectFormat(target);
  currentlySelectedFormat = currentlySelectedFormat === format ? '' : format;
}

function exportLabels() {
  let exported = true;
  switch (currentlySelectedFormat) {
    case 'COCO JSON':
      downloadCOCOJSON();
      break;
    default:
      exported = false;
      break;
  }
  if (exported) {
    hideExportLabelsPopUp();
  }
}

function closeExportLabelsPopUp() {
  hideExportLabelsPopUp();
}

export { selectLabelExportFormat, exportLabels, closeExportLabelsPopUp };
