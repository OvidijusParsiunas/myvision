import { selectDatasetExportFormat, exportDatasets, closeexportDatasetsPopup } from './buttonEventHandlers.js';
import { displayExportPopupInformationPopover, removeExportPopupInformationPopover } from './style.js';

function assignExportDatasetsPopupButtonEventHandlers() {
  window.selectExportDatasetsFormat = selectDatasetExportFormat;
  window.exportDataset = exportDatasets;
  window.cancelexportDatasets = closeexportDatasetsPopup;
  window.displayExportPopupInformationPopover = displayExportPopupInformationPopover;
  window.removeExportPopupInformationPopover = removeExportPopupInformationPopover;
}

export { assignExportDatasetsPopupButtonEventHandlers as default };
