import { downloadXML } from '../facadeWorkersUtils/downloadFile/fileTypes/XML';

function downloadXMLFile(canvas) {
  if (canvas.backgroundImage) {
    downloadXML();
  }
}

export { downloadXMLFile as default };
