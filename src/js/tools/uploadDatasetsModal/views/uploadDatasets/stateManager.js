let format = '';
let reuseAlreadyUploadedImages = false;

function setFormatState(formatState) {
  format = formatState;
}

function setReuseAlreadyUploadedImagesState(reuseAlreadyUploadedImagesState) {
  reuseAlreadyUploadedImages = reuseAlreadyUploadedImagesState;
}

function getFormatState() {
  return format;
}

function getReuseAlreadyUploadedImagesState() {
  return reuseAlreadyUploadedImages;
}

export {
  setFormatState,
  getFormatState,
  setReuseAlreadyUploadedImagesState,
  getReuseAlreadyUploadedImagesState,
};
