import * as UploadDatasetsConsts from './consts';

const availableFormats = [
  UploadDatasetsConsts.COCO_JSON_FORMAT,
  UploadDatasetsConsts.VGG_JSON_FORMAT,
  UploadDatasetsConsts.CSV_FORMAT,
  UploadDatasetsConsts.VOC_XML_FORMAT,
  UploadDatasetsConsts.YOLO_TXT_FORMAT,
];
const defaultState = UploadDatasetsConsts.COCO_JSON_FORMAT;
let currentlySelectedFormat = defaultState;
let reuseAlreadyUploadedImages = false;

function setFormatState(formatState) {
  currentlySelectedFormat = currentlySelectedFormat === formatState ? defaultState : formatState;
}

function setReuseAlreadyUploadedImagesState(reuseAlreadyUploadedImagesState) {
  reuseAlreadyUploadedImages = reuseAlreadyUploadedImagesState;
}

function getFormatState() {
  return currentlySelectedFormat;
}

function getReuseAlreadyUploadedImagesState() {
  return reuseAlreadyUploadedImages;
}

function getAvailableFormats() {
  return availableFormats;
}

function setAllStatesToDefault() {
  currentlySelectedFormat = defaultState;
  reuseAlreadyUploadedImages = false;
}

export {
  setFormatState,
  getFormatState,
  getAvailableFormats,
  setAllStatesToDefault,
  setReuseAlreadyUploadedImagesState,
  getReuseAlreadyUploadedImagesState,
};
