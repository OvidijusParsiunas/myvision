import { removeLabel } from '../../label/label.js';
import { removeShape } from '../../allShapes/allShapes.js';

function removePolygonImpl(canvas, polygon) {
  const polygonId = polygon.id;
  removeShape(polygonId);
  removeLabel(polygonId, canvas);
}

export { removePolygonImpl as default };
