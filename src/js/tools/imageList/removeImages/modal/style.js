let modalParentElement = null;

function displayRemoveImagesModal() {
  modalParentElement.style.display = 'block';
}

function hideRemoveImagesModal() {
  modalParentElement.style.display = 'none';
}

function assignRemoveImagesModalLocalVariables() {
  modalParentElement = document.getElementById('remove-images-modal-parent');
}

function initialiseRemoveImagesModalStyling() {
  assignRemoveImagesModalLocalVariables();
}

export { initialiseRemoveImagesModalStyling, displayRemoveImagesModal, hideRemoveImagesModal };
