let finalObjectAssemblerFunc = null;

function drawShapesAndImages() {
  const finalObject = finalObjectAssemblerFunc();
  console.log(finalObject);
}

function setFinalObjectAssembler(finalObjectAssemblerFuncArg) {
  finalObjectAssemblerFunc = finalObjectAssemblerFuncArg;
}

export { drawShapesAndImages, setFinalObjectAssembler };
