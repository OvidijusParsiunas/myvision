import { selectFormat, hideExportDatasetsPopup } from './style'; // Import helper functions for formatting and hiding the export datasets popup
import { setSessionDirtyState } from '../state'; // Import function to set session dirty state
import downloadCOCOJSON from './fileTypes/COCOJSON'; // Import function to download COCO JSON format
import downloadVGGJSON from './fileTypes/VGGJSON'; // Import function to download VGG JSON format
import downloadCSV from './fileTypes/CSV'; // Import function to download CSV format
import downloadXML from './fileTypes/XML'; // Import function to download XML format
import downloadYOLOTXT from './fileTypes/YOLOTXT'; // Import function to download YOLO TXT format

// Initialize currentlySelectedFormat variable to null
let currentlySelectedFormat = null;

/**
 * Selects the dataset export format
 * @param {string} format - The format to select
 * @param {Element} target - The target element for the select action
 */
function selectDatasetExportFormat(format, target) {
  selectFormat(target); // Call the selectFormat function from the style module
  currentlySelectedFormat = currentlySelectedFormat === format ? '' : format; // Update the currentlySelectedFormat variable based on the new selection
}

/**
 * Exports the datasets based on the currently selected format
 */
function exportDatasets() {
  let exported = true; // Initialize exported variable to true
  switch (currentlySelectedFormat) {
    case 'COCO JSON':
      downloadCOCOJSON(); // Call the downloadCOCOJSON function
      break;
    case 'VGG JSON':
      downloadVGGJSON(); // Call the downloadVGGJSON function
      break;
    case 'CSV':
      downloadCSV(); // Call the downloadCSV function
      break;
    case 'VOC XML':
      downloadXML(); // Call the downloadXML function
      break;
    case 'YOLO TXT':
      downloadYOLOTXT(); // Call the downloadYOLOTXT function
      break;
    default:
      exported = false; // If no format is selected, set exported to false
      break;
  }
  if (exported) {
    hideExportDatasetsPopup(); // Call the hideExportDatasetsPopup function from the style module
    setSessionDirtyState(false); // Call the setSessionDirtyState function from the state module
  }
}

/**
 * Closes the export datasets popup
 */
function closeexportDatasetsPopup() {
  hideExportDatasetsPopup(); // Call the hideExportDatasetsPopup function from the style module
}

// Export the selectDatasetExportFormat, exportDatasets, and closeexportDatasetsPopup functions
export { selectDatasetExportFormat, exportDatasets, closeexportDatasetsPopup };
