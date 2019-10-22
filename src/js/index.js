import setupWindowLayout from './tools/styling/setup';
import { constructCanvas } from './canvas/canvas';
import initialiseLabellerPopUp from './tools/labellerPopUp/buttons';
import assignToolkitButtonEvents from './tools/toolkit/buttons';
import { initialiseLabelListFunctionality } from './tools/labelList/labelList';
import { initialiseImageListFunctionality } from './tools/imageList/imageList';

setupWindowLayout();
constructCanvas();
initialiseLabellerPopUp();
assignToolkitButtonEvents();
initialiseLabelListFunctionality();
initialiseImageListFunctionality();
