import { selectLabelExportFormat, exportLabels, closeExportLabelsPopUp } from './buttonEventHandlers';
import { initialiseExportLabelsPopupElements, displayExportPopUpInformationPopover, removeExportPopUpInformationPopover } from './style';

function initialiseExportLabelsPopUp() {
  initialiseExportLabelsPopupElements();
  window.selectLabelExportFormat = selectLabelExportFormat;
  window.exportLabels = exportLabels;
  window.cancelExportLabels = closeExportLabelsPopUp;
  window.displayExportPopUpInformationPopover = displayExportPopUpInformationPopover;
  window.removeExportPopUpInformationPopover = removeExportPopUpInformationPopover;
}

export { initialiseExportLabelsPopUp as default };
