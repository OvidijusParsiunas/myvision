import constructCanvas from './canvasFactory';
import assignButtonEvents from './buttonMouseEvents';
import setCanvasDownloadXML from './downloadXML';

const canvas = constructCanvas();
assignButtonEvents();
setCanvasDownloadXML(canvas);
