import { setRemoveImageModalDisplayedState } from '../../../stateMachine';

let modalParentElement = null;

function displayRemoveImagesModal() {
  modalParentElement.style.display = 'block';
  setRemoveImageModalDisplayedState(true);
}

function closeRemoveImagesModal() {
  modalParentElement.style.display = 'none';
  setRemoveImageModalDisplayedState(false);
}

function assignRemoveImagesModalLocalVariables() {
  modalParentElement = document.getElementById('remove-images-modal-parent');
}

function initialiseRemoveImagesModalStyling() {
  assignRemoveImagesModalLocalVariables();
}

export { initialiseRemoveImagesModalStyling, displayRemoveImagesModal, closeRemoveImagesModal };
