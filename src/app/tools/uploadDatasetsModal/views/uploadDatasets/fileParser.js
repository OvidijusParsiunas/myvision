import { IMAGE_FILE_INDICATOR, ANNOTATION_FILE_INDICATOR, CLASSES_FILE_INDICATOR } from '../../consts.js';

function parseImageData(fileMetaData, event) {
  const image = new Image();
  image.src = event.target.result;
  return { fileFormat: IMAGE_FILE_INDICATOR, body: { fileMetaData, imageElement: image } };
}

function parseJSON(fileMetaData, event) {
  try {
    const JSONObject = JSON.parse(event.target.result);
    return {
      fileFormat: ANNOTATION_FILE_INDICATOR,
      body: { fileMetaData, annotationData: JSONObject },
    };
  } catch (errorMessage) {
    return {
      fileFormat: ANNOTATION_FILE_INDICATOR,
      body: { fileMetaData },
      errorObj: { error: true, message: `Invalid JSON - ${errorMessage}` },
    };
  }
}

function isArrayOfStrings(rowsOfAttributes) {
  for (let i = 0; i < rowsOfAttributes.length; i += 1) {
    if (!Number.isNaN(parseInt(rowsOfAttributes[i], 10))) {
      return false;
    }
  }
  return true;
}

// for clarification - this is for Tensorflow CSV
function parseCSV(fileMetaData, event) {
  try {
    const rows = event.target.result.split(/\r\n|\n/);
    const rowsOfAttributes = [];
    rows.forEach((line) => {
      const attributes = line.split(',').filter(entry => entry.trim() !== '');
      if (attributes.length > 0) { rowsOfAttributes.push(attributes); }
    });
    if (rowsOfAttributes[0].length === 8 && isArrayOfStrings(rowsOfAttributes[0])) {
      rowsOfAttributes.shift();
    }
    return {
      fileFormat: ANNOTATION_FILE_INDICATOR,
      body: { fileMetaData, annotationData: rowsOfAttributes },
    };
  } catch (errorMessage) {
    return {
      fileFormat: ANNOTATION_FILE_INDICATOR,
      body: { fileMetaData },
      errorObj: { error: true, message: `Invalid CSV - ${errorMessage}` },
    };
  }
}

function xmlToJson(xml) {
  let resultJSONobject = {};
  if (xml.nodeType === 1) {
    if (xml.attributes.length > 0) {
      resultJSONobject['@attributes'] = {};
      for (let i = 0; i < xml.attributes.length; i += 1) {
        const attribute = xml.attributes.item(i);
        resultJSONobject['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) {
    resultJSONobject = xml.nodeValue;
  }
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i += 1) {
      const item = xml.childNodes.item(i);
      const { nodeName } = item;
      if (typeof (resultJSONobject[nodeName]) === 'undefined') {
        resultJSONobject[nodeName] = xmlToJson(item);
      } else {
        if (typeof (resultJSONobject[nodeName].push) === 'undefined') {
          const oldObject = resultJSONobject[nodeName];
          resultJSONobject[nodeName] = [];
          resultJSONobject[nodeName].push(oldObject);
        }
        resultJSONobject[nodeName].push(xmlToJson(item));
      }
    }
  }
  return resultJSONobject;
}

function parseXML(fileMetaData, event) {
  try {
    const parser = new DOMParser();
    const JSONObject = xmlToJson(parser.parseFromString(event.target.result, 'application/xml'));
    return {
      fileFormat: ANNOTATION_FILE_INDICATOR,
      body: { fileMetaData, annotationData: JSONObject },
    };
  } catch (errorMessage) {
    return {
      fileFormat: ANNOTATION_FILE_INDICATOR,
      body: { fileMetaData },
      errorObj: { error: true, message: `Invalid XML - ${errorMessage}` },
    };
  }
}

function txtToJSON(result, fileMetaData) {
  const lines = result.split('\n');
  let fileEmpty = true;
  let isAnnotationsFile = true;
  const linesOfAttributes = [];
  lines.forEach((line) => {
    const attributes = line
      .split(' ')
      .filter(entry => entry.trim() !== '')
      .map((entry) => {
        const number = Number.parseFloat(entry, 10);
        if (!Number.isNaN(number)) { return number; }
        return entry;
      });
    if (attributes.length > 0) {
      fileEmpty = false;
      if (attributes.length !== 5) {
        isAnnotationsFile = false;
      }
      linesOfAttributes.push(attributes);
    }
  });
  if (fileEmpty) {
    return {
      fileFormat: ANNOTATION_FILE_INDICATOR,
      body: { fileMetaData },
      errorObj: { error: true, message: 'Text file is empty', parsingError: true },
    };
  }
  const fileFormat = isAnnotationsFile ? ANNOTATION_FILE_INDICATOR : CLASSES_FILE_INDICATOR;
  return { fileFormat, body: { fileMetaData, annotationData: linesOfAttributes } };
}

function parseTXT(fileMetaData, event) {
  try {
    return txtToJSON(event.target.result, fileMetaData);
  } catch (errorMessage) {
    return {
      fileFormat: ANNOTATION_FILE_INDICATOR,
      body: { fileMetaData },
      errorObj: { error: true, message: `Invalid text file - ${errorMessage}`, parsingError: true },
    };
  }
}

function parseAllFiles(fileMetaData, event) {
  if (fileMetaData.type.startsWith('image/')) {
    return parseImageData(fileMetaData, event);
  }
  if (fileMetaData.name.endsWith('.json')) {
    return parseJSON(fileMetaData, event);
  }
  if (fileMetaData.name.endsWith('.csv')) {
    return parseCSV(fileMetaData, event);
  }
  if (fileMetaData.name.endsWith('.xml')) {
    return parseXML(fileMetaData, event);
  }
  if (fileMetaData.name.endsWith('.txt')) {
    return parseTXT(fileMetaData, event);
  }
  return {};
}

export { parseAllFiles as default };
