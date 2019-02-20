import constructCanvas from './fabricScript';
import { setCanvas } from './uploadFile';
import setCanvasDownloadXML from './downloadXML';

const canvas = constructCanvas();
setCanvas(canvas);
setCanvasDownloadXML(canvas);
