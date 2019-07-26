import { removeLabel } from '../../label/label';
import { removeShape } from '../../allShapes/allShapes';

function removePolygonImpl(canvas, polygon) {
  const polygonId = polygon.id;
  removeShape(polygonId);
  removeLabel(polygonId, canvas);
}

export { removePolygonImpl as default };
