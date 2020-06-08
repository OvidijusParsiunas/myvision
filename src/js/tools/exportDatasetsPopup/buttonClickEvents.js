import { selectDatasetExportFormat, exportDatasets, closeexportDatasetsPopUp } from './buttonEventHandlers';
import { displayExportPopUpInformationPopover, removeExportPopUpInformationPopover } from './style';

function assignExportDatasetsPopupButtonEventHandlers() {
  window.selectExportDatasetsFormat = selectDatasetExportFormat;
  window.exportDataset = exportDatasets;
  window.cancelexportDatasets = closeexportDatasetsPopUp;
  window.displayExportPopUpInformationPopover = displayExportPopUpInformationPopover;
  window.removeExportPopUpInformationPopover = removeExportPopUpInformationPopover;
}

export { assignExportDatasetsPopupButtonEventHandlers as default };
