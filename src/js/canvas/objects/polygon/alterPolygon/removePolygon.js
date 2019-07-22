import { removeLabel } from '../../label/label';

function removePolygonImpl(canvas, polygon) {
  canvas.remove(polygon);
  removeLabel(polygon.id, canvas);
}

export { removePolygonImpl as default };
