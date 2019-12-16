import { fileStatus } from '../../uploadFile/drawImageOnCanvas';
import convertJSONToXML from '../fileTypeConverters/JSONtoXML';
import buildAnnotationsObject from '../fileStructureGenerators/generateStandardAnnotationsObject';

let canvas = null;

function getFileName() {
  const regexToFindFirstWordBeforeFullStop = new RegExp('^([^.]+)');
  return `${regexToFindFirstWordBeforeFullStop.exec(fileStatus.name)[0]}.xml`;
}

function generateTempDownloadableElement(annotationsObject) {
  const pom = document.createElement('a');
  const bb = new Blob([annotationsObject], { type: 'text/plain' });
  pom.setAttribute('href', window.URL.createObjectURL(bb));
  pom.setAttribute('download', getFileName());
  pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
  pom.draggable = true;
  pom.classList.add('dragout');
  return pom;
}

function getPolygonCoordinates() {
  let shape = {};
  canvas.forEachObject((object) => {
    if (object.shapeName === 'polygon') {
      console.log(object);
    }
  });
}

function generateJSON() {
  return getPolygonCoordinates(canvas);
}

function downloadJSON() {
  const JSON = generateJSON();
  const downloadableElement = generateTempDownloadableElement(JSON);
  downloadableElement.click();
}

function assignCanvasForDownloadingAnnotationsXML(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForDownloadingAnnotationsXML, downloadJSON };
