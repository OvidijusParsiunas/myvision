import constructCanvas from './canvasFactory';
import assignButtonEvents from './buttonMouseEvents';
import { setCanvas } from './uploadFile';
import setCanvasDownloadXML from './downloadXML';

const canvas = constructCanvas();
assignButtonEvents();
setCanvas(canvas);
setCanvasDownloadXML(canvas);
