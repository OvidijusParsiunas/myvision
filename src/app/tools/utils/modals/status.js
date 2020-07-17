import {
  getMachineLearningModalDisplayedState, getUploadDatasetsModalDisplayedState,
  getLabellerModalDisplayedState, getRemoveImageModalDisplayedState, getWelcomeModalDisplayedState,
} from '../../state';

function isAnyModalOpen() {
  return getLabellerModalDisplayedState()
  || getUploadDatasetsModalDisplayedState()
  || getMachineLearningModalDisplayedState()
  || getRemoveImageModalDisplayedState()
  || getWelcomeModalDisplayedState();
}

export { isAnyModalOpen as default };
