import { selectFormat, hideExportLabelsPopUp } from './style';
import downloadCOCOJSON from '../toolkit/buttonClickEvents/facadeWorkersUtils/downloadFile/fileTypes/COCOJSON';
import downloadVGGJSON from '../toolkit/buttonClickEvents/facadeWorkersUtils/downloadFile/fileTypes/VGGJSON';
import downloadCSV from '../toolkit/buttonClickEvents/facadeWorkersUtils/downloadFile/fileTypes/CSV';
import downloadXML from '../toolkit/buttonClickEvents/facadeWorkersUtils/downloadFile/fileTypes/XML';
import downloadYOLOTXT from '../toolkit/buttonClickEvents/facadeWorkersUtils/downloadFile/fileTypes/YOLOTXT';

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
    case 'VGG JSON':
      downloadVGGJSON();
      break;
    case 'CSV':
      downloadCSV();
      break;
    case 'VOC XML':
      downloadXML();
      break;
    case 'YOLO TXT':
      downloadYOLOTXT();
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
