import { getLabelById } from '../../label/label';

function removePolygonImpl(canvas, polygon) {
  canvas.remove(getLabelById(polygon.id));
  canvas.remove(polygon);
}

export { removePolygonImpl as default };
