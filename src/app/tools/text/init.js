import { assignTextElements, populateText } from './languages/style';

function initialiseText() {
  assignTextElements();
  populateText();
}

export { initialiseText as default };
