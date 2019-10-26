import { constructCanvas } from './canvas/canvas';
import initialiseLabellerPopUp from './tools/labellerPopUp/buttons';
import assignToolkitButtonEvents from './tools/toolkit/buttons';
import assignPassiveEventListeners from './tools/passiveEventListeners/passiveEventListeners';
import { initialiseWindowLayoutSetup } from './tools/styling/styling';
import { initialiseLabelListFunctionality } from './tools/labelList/labelList';
import { initialiseImageListFunctionality } from './tools/imageList/imageList';

constructCanvas();
initialiseLabellerPopUp();
assignToolkitButtonEvents();
assignPassiveEventListeners();
initialiseWindowLayoutSetup();
initialiseLabelListFunctionality();
initialiseImageListFunctionality();
