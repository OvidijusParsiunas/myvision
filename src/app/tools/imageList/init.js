import { initialiseImageList } from './imageList';
import initialiseImageListButtonClickEvents from './buttons/buttonClickEvents';
import initialiseImageListButtonHoverEvents from './buttons/buttonHoverEvents';
import initialiseImageListDragAndDropEvents from './uploadImages/dragAndDropImages';

function initialiseImageListFunctionality() {
  initialiseImageList();
  initialiseImageListButtonClickEvents();
  initialiseImageListButtonHoverEvents();
  initialiseImageListDragAndDropEvents();
}

export { initialiseImageListFunctionality as default };
