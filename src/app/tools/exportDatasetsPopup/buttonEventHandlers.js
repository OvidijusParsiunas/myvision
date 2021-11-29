import { selectFormat, hideExportDatasetsPopup } from './style.js';
import { setSessionDirtyState } from '../state.js';
import downloadCOCOJSON from './fileTypes/COCOJSON.js';
import downloadVGGJSON from './fileTypes/VGGJSON.js';
import downloadCSV from './fileTypes/CSV.js';
import downloadXML from './fileTypes/XML.js';
import downloadYOLOTXT from './fileTypes/YOLOTXT.js';

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
    setSessionDirtyState(false);
  }
}

function closeexportDatasetsPopup() {
  hideExportDatasetsPopup();
}

export { selectDatasetExportFormat, exportDatasets, closeexportDatasetsPopup };
