import { getTextFromDictionary } from './language';

const textProperties = [
  { id: 'welcome-modal-title-welcome-text', dictionaryKey: 'WELCOME' },
  { id: 'welcome-modal-description-part-1', dictionaryKey: 'WELCOME_MODAL_DESCRIPTION_PAR_1' },
  { id: 'welcome-modal-description-part-2', dictionaryKey: 'WELCOME_MODAL_DESCRIPTION_PAR_2' },
  { id: 'welcome-modal-description-part-3', dictionaryKey: 'WELCOME_MODAL_DESCRIPTION_PAR_3' },
  { id: 'welcome-modal-description-part-4', dictionaryKey: 'WELCOME_MODAL_DESCRIPTION_PAR_4' },
  { id: 'start-text', dictionaryKey: 'START' },
  { id: 'labeller-modal-title', dictionaryKey: 'LABEL_NAME' },
  { id: 'labeller-modal-submit-button', dictionaryKey: 'SUBMIT' },
  { id: 'labeller-modal-cancel-button', dictionaryKey: 'CANCEL' },
  { id: 'machine-learning-modal-title', dictionaryKey: 'MACHINE_LEARNING' },
  { id: 'machine-learning-modal-loading-text', dictionaryKey: 'LOADING' },
  { id: 'machine-learning-modal-initiate-start-button', dictionaryKey: 'START' },
  { id: 'machine-learning-modal-initiate-next-button', dictionaryKey: 'NEXT' },
  { id: 'machine-learning-modal-initiate-retry-button', dictionaryKey: 'RETRY' },
  { id: 'machine-learning-modal-initiate-cancel-button', dictionaryKey: 'CANCEL' },
  { id: 'machine-learning-modal-no-objects-close-button', dictionaryKey: 'CLOSE' },
  { id: 'machine-learning-modal-initiate-all-images-button', dictionaryKey: 'ALL_IMAGES' },
  { id: 'machine-learning-modal-initiate-new-images-button', dictionaryKey: 'NEW_IMAGES' },
  { id: 'machine-learning-modal-generated-labels-submit-button', dictionaryKey: 'SUBMIT' },
  { id: 'label-list-title', dictionaryKey: 'LABELS' },
  { id: 'upload-datasets-modal-upload-datasets-classes-table-title', dictionaryKey: 'CLASSES' },
  { id: 'upload-datasets-modal-upload-datasets-annotations-table-title', dictionaryKey: 'ANNOTATIONS_JSON' },
  { id: 'upload-datasets-modal-title', dictionaryKey: 'UPLOAD_DATASETS' },
  { id: 'upload-datasets-modal-select-format-title', dictionaryKey: 'CHOOSE_FORMAT' },
  { id: 'upload-datasets-modal-upload-datasets-images-table-title', dictionaryKey: 'IMAGES' },
  { id: 'upload-datasets-modal-start-button', dictionaryKey: 'START' },
  { id: 'upload-datasets-modal-next-button', dictionaryKey: 'NEXT' },
  { id: 'upload-datasets-modal-back-button', dictionaryKey: 'BACK' },
  { id: 'upload-datasets-modal-upload-datasets-upload-button', dictionaryKey: 'UPLOAD' },
  { id: 'upload-datasets-modal-cancel-button', dictionaryKey: 'CANCEL' },
  { id: 'upload-datasets-modal-yes-button', dictionaryKey: 'YES' },
  { id: 'upload-datasets-modal-no-button', dictionaryKey: 'NO' },
  { id: 'upload-datasets-modal-finish-button', dictionaryKey: 'FINISH' },
  { id: 'export-datasets-popup-export-button', dictionaryKey: 'EXPORT' },
  { id: 'settings-popup-labels-visibility-text', dictionaryKey: 'LABEL_VISIBILITY' },
  { id: 'settings-popup-movable-objects-text', dictionaryKey: 'MOVABLE_OBJECTS' },
  { id: 'settings-popup-continuous-drawing-text', dictionaryKey: 'CONTINUOUS_DRAWING' },
  { id: 'settings-popup-bounding-box-crosshair-text', dictionaryKey: 'BOUNDING_BOX_CROSSHAIR' },
  { id: 'settings-popup-bounding-box-crosshair-visibility-text', dictionaryKey: 'VISIBILITY' },
  { id: 'settings-popup-bounding-box-crosshair-color-text', dictionaryKey: 'COLOR' },
  { id: 'edit-shapes-button-popover', dictionaryKey: 'EDIT_SHAPES' },
  { id: 'bounding-box-button-popover', dictionaryKey: 'NEW_BOUNDING_BOX' },
  { id: 'polygon-button-popover', dictionaryKey: 'NEW_POLYGON' },
  { id: 'add-points-button-popover', dictionaryKey: 'ADD_NEW_POINTS_TO_POLYGON' },
  { id: 'remove-points-button-popover', dictionaryKey: 'REMOVE_POLYGON_POINTS' },
  { id: 'upload-datasets-button-popover', dictionaryKey: 'UPLOAD_DATASETS' },
  { id: 'export-datasets-button-popover', dictionaryKey: 'EXPORT_DATASETS' },
  { id: 'export-datasets-popup-title', dictionaryKey: 'CHOOSE_FORMAT_COLON' },
  { id: 'machine-learning-button-popover', dictionaryKey: 'MACHINE_LEARNING' },
  { id: 'zoom-in-button-popover', dictionaryKey: 'ZOOM_IN' },
  { id: 'zoom-out-button-popover', dictionaryKey: 'ZOOM_OUT' },
  { id: 'settings-button-popover', dictionaryKey: 'SETTINGS' },
  { id: 'remove-labels-button-popover', dictionaryKey: 'REMOVE_LABEL' },
  { id: 'remove-images-button-popover', dictionaryKey: 'REMOVE_IMAGE' },
  { id: 'upload-images-button-popover', dictionaryKey: 'UPLOAD_IMAGES' },
  { id: 'image-list-title', dictionaryKey: 'IMAGES' },
  { id: 'remove-images-modal-title', dictionaryKey: 'REMOVE_IMAGE' },
  { id: 'remove-images-modal-description', dictionaryKey: 'REMOVE_IMAGE_DESCRIPTION' },
  { id: 'remove-images-modal-checkbox-description', dictionaryKey: 'REMOVE_IMAGE_NOT_SHOW_AGAIN' },
  { id: 'remove-images-modal-yes-button', dictionaryKey: 'YES' },
  { id: 'remove-images-modal-no-button', dictionaryKey: 'NO' },
  { id: 'image-name', dictionaryKey: 'IMAGE_NAME' },
  { id: 'previous-image-button-popover-text', dictionaryKey: 'PREVIOUS_IMAGE' },
  { id: 'next-image-button-popover-text', dictionaryKey: 'NEXT_IMAGE' },
  { id: 'format-option-checkbox-popover-4', dictionaryKey: 'BOUNDING_BOXES_ONLY' },
  { id: 'format-option-checkbox-popover-1', dictionaryKey: 'BOUNDING_BOXES_ONLY' },
  { id: 'format-option-checkbox-popover-5', dictionaryKey: 'BOUNDING_BOXES_ONLY' },
  { id: 'format-option-checkbox-popover-2', dictionaryKey: 'BOUNDING_BOXES_ONLY' },
  { id: 'format-option-checkbox-popover-6', dictionaryKey: 'BOUNDING_BOXES_ONLY' },
  { id: 'format-option-checkbox-popover-3', dictionaryKey: 'BOUNDING_BOXES_ONLY' },
];

function populateText() {
  textProperties.forEach((textProperty) => {
    textProperty.element.innerHTML = getTextFromDictionary(textProperty.dictionaryKey);
  });
}

function assignTextElements() {
  textProperties.forEach((textProperty) => {
    textProperty.element = document.getElementById(textProperty.id);
  });
}

export {
  populateText, assignTextElements,
};
