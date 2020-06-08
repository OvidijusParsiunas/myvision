import { selectLabelExportFormat, exportLabels, closeExportLabelsPopUp } from './buttonEventHandlers';
import { displayExportPopUpInformationPopover, removeExportPopUpInformationPopover } from './style';

function assignExportLabelsPopupButtonEventHandlers() {
  window.selectLabelExportFormat = selectLabelExportFormat;
  window.exportLabels = exportLabels;
  window.cancelExportLabels = closeExportLabelsPopUp;
  window.displayExportPopUpInformationPopover = displayExportPopUpInformationPopover;
  window.removeExportPopUpInformationPopover = removeExportPopUpInformationPopover;
}

export { assignExportLabelsPopupButtonEventHandlers as default };
