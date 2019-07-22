import constructCanvas from './canvas/canvas';
import assignToolkitButtonEvents from './tools/toolkit/buttons';
import assignLabellerPopUpButtonEvents from './tools/labellerPopUp/buttons';
import { initialiseLabelListFunctionality } from './tools/labelList/labelList';

constructCanvas();
assignToolkitButtonEvents();
assignLabellerPopUpButtonEvents();
initialiseLabelListFunctionality();
