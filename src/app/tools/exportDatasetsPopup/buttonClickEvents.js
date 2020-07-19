import { selectDatasetExportFormat, exportDatasets, closeexportDatasetsPopup } from './buttonEventHandlers';
import { displayExportPopupInformationPopover, removeExportPopupInformationPopover } from './style';

function assignExportDatasetsPopupButtonEventHandlers() {
  window.selectExportDatasetsFormat = selectDatasetExportFormat;
  window.exportDataset = exportDatasets;
  window.cancelexportDatasets = closeexportDatasetsPopup;
  window.displayExportPopupInformationPopover = displayExportPopupInformationPopover;
  window.removeExportPopupInformationPopover = removeExportPopupInformationPopover;
}

export { assignExportDatasetsPopupButtonEventHandlers as default };
