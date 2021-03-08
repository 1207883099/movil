import axios from 'axios';
import {getDomain} from './config';

///  PETICIONES POST

export async function SubirParteTrabajo(data) {
  return await axios({
    method: 'POST',
    url: `${getDomain()}/api/parteTrabajo`,
    data,
  });
}

export async function SubirParteTrabajoDetalles(data) {
  return await axios({
    method: 'POST',
    url: `${getDomain()}/api/parteTrabajo/detalles`,
    data,
  });
}

export async function SubirParteTrabajoDetallesValor(
  lotes,
  IdParteTrabajoDetalle,
) {
  return await axios({
    method: 'POST',
    url: `${getDomain()}/api/parteTrabajo/detalles-valor`,
    data: {
      lotes,
      IdParteTrabajoDetalle,
    },
  });
}
