import { selectFormat, hideExportDatasetsPopup } from './style';
import downloadCOCOJSON from './fileTypes/COCOJSON';
import downloadVGGJSON from './fileTypes/VGGJSON';
import downloadCSV from './fileTypes/CSV';
import downloadXML from './fileTypes/XML';
import downloadYOLOTXT from './fileTypes/YOLOTXT';

let currentlySelectedFormat = null;

function selectDatasetExportFormat(format, target) {
  selectFormat(target);
  currentlySelectedFormat = currentlySelectedFormat === format ? '' : format;
}

function exportDatasets() {
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
    hideExportDatasetsPopup();
  }
}

function closeexportDatasetsPopup() {
  hideExportDatasetsPopup();
}

export { selectDatasetExportFormat, exportDatasets, closeexportDatasetsPopup };
