function onFileLoad(imageMetaData, event) {
  console.log(imageMetaData);
  console.log(event);
  // const image = new Image();
  // image.src = event.target.result;
  // addImageFromMultiUploadToList(imageMetadata, image);
}

function uploadDatasetFilesHandler(uploadData) {
  if (uploadData.files && uploadData.files.length > 0) {
    for (let i = 0; i < uploadData.files.length; i += 1) {
      const reader = new FileReader();
      reader.onload = onFileLoad.bind(this, uploadData.files[i]);
      reader.readAsDataURL(uploadData.files[i]);
    }
  }
}

export { uploadDatasetFilesHandler as default };
