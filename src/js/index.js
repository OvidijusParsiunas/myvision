import { constructCanvas } from './canvas/canvas';
import initialiseLabellerPopUp from './tools/labellerPopUp/buttons';
import assignToolkitButtonClickEvents from './tools/toolkit/buttonClickEvents/buttonClickEvents';
import { assignToolkitButtonHoverEvents } from './tools/toolkit/buttonHoverEvents/buttonHoverEvents';
import assignPassiveEventListeners from './tools/passiveEventListeners/passiveEventListeners';
import { initialiseWindowLayoutSetup } from './tools/styling/styling';
import { initialiseLabelListFunctionality } from './tools/labelList/labelList';
import { initialiseImageListFunctionality } from './tools/imageList/imageList';

constructCanvas();
initialiseLabellerPopUp();
assignToolkitButtonClickEvents();
assignToolkitButtonHoverEvents();
assignPassiveEventListeners();
initialiseWindowLayoutSetup();
initialiseLabelListFunctionality();
initialiseImageListFunctionality();
