import { downloadXML } from '../facadeWorkersUtils/downloadFile/fileTypes/XML';

function downloadXMLFile(canvas) {
  canvas.discardActiveObject();
  if (canvas.backgroundImage) {
    downloadXML();
  }
}

export { downloadXMLFile as default };
