import constructCanvas from './canvas/canvas';
import initialiseLabellerPopUp from './tools/labellerPopUp/buttons';
import assignToolkitButtonEvents from './tools/toolkit/buttons';
import { initialiseLabelListFunctionality } from './tools/labelList/labelList';

constructCanvas();
initialiseLabellerPopUp();
assignToolkitButtonEvents();
initialiseLabelListFunctionality();
