import { FabricCanvas } from 'fabric';

function setRemovePointsOnDrawNewPolygonMode(canvas: FabricCanvas): void {
  if (!canvas) {
    throw new Error('canvas cannot be null or undefined');
  }

  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
  canvas.renderAll();

  for (const obj of Object.values(canvas)) {
    switch (obj.type) {
      case 'polygon':
      case 'bndBox':
        obj.hoverCursor = 'default';
        break;
      default:
        // do nothing
    }
  }
}

export { setRemovePointsOnDrawNewPolygonMode as default };
