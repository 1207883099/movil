import axios from 'axios';
import {getDomain} from './config';

///  PETICIONES GET

export async function obtenerConfiguracion(
  token,
  section,
  fiscal = null,
  rol = null,
) {
  return await axios({
    method: 'GET',
    url: `${getDomain()}/api/configuracion/${section}?fiscal=${fiscal}&rol=${rol}`,
    headers: {'access-token': token},
  });
}
