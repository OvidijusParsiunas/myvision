import { fileStatus } from '../uploadFile/uploadImage';
import convertJSONToXML from './utils/JSONtoXML';
import buildAnnotationsObject from './utils/annotationsObjFactory';

let canvas = null;

function getFileName() {
  const regexToFindFirstWordBeforeFullStop = new RegExp('^([^.]+)');
  return `${regexToFindFirstWordBeforeFullStop.exec(fileStatus.name)[0]}.xml`;
}

function generateTempDownloadableElement(xml) {
  const pom = document.createElement('a');
  const bb = new Blob([xml], { type: 'text/plain' });
  pom.setAttribute('href', window.URL.createObjectURL(bb));
  pom.setAttribute('download', getFileName());
  pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
  pom.draggable = true;
  pom.classList.add('dragout');
  return pom;
}

function downloadXMLFile(xml) {
  const downloadableElement = generateTempDownloadableElement(xml);
  downloadableElement.click();
}

function generateXML() {
  const downloadableObject = buildAnnotationsObject(canvas, fileStatus);
  return convertJSONToXML(downloadableObject);
}

function downloadXML() {
  if (canvas.backgroundImage) {
    const xml = generateXML();
    downloadXMLFile(xml);
  }
}

function assignCanvasForDownloadingAnnotationsXML(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForDownloadingAnnotationsXML, downloadXML };
