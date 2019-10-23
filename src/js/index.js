import { initialiseWindowLayoutSetup } from './tools/styling/styling';
import { constructCanvas } from './canvas/canvas';
import initialiseLabellerPopUp from './tools/labellerPopUp/buttons';
import assignToolkitButtonEvents from './tools/toolkit/buttons';
import { initialiseLabelListFunctionality } from './tools/labelList/labelList';
import { initialiseImageListFunctionality } from './tools/imageList/imageList';

initialiseWindowLayoutSetup();
constructCanvas();
initialiseLabellerPopUp();
assignToolkitButtonEvents();
initialiseLabelListFunctionality();
initialiseImageListFunctionality();
