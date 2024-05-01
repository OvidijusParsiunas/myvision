// Importing the displayExportDatasetsPopup and hideExportDatasetsPopup functions from the style module of exportDatasetsPopup.
import { displayExportDatasetsPopup, hideExportDatasetsPopup } from '../../../exportDatasetsPopup/style';

// Importing the getExportDatasetsPopupOpenState function from the state module of the current directory.
import { getExportDatasetsPopupOpenState } from '../../../state';

// The toggleExportDatasetsPopup function is used to toggle the visibility of the export datasets popup.
function toggleExportDatasetsPopup() {
  // Checking if the export datasets popup is currently closed.
  if (!getExportDatasetsPopupOpenState()) {
    // If the popup is closed, display it using the displayExportDatasetsPopup function.
    displayExportDatasetsPopup();
  } else {
    // If the popup is already open, hide it using the hideExportDatasetsPopup function.
    hideExportDatasetsPopup();
  }
}

// Exporting the toggleExportDatasetsPopup function as the default export of this module.
export { toggleExportDatasetsPopup as default };

