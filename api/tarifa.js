import axios from 'axios';
import {getDomain} from './config';

///  PETICIONES GET

export async function obtenerTarifas(token) {
  return await axios({
    method: 'GET',
    url: `${getDomain()}/api/tarifa`,
    headers: {'access-token': token},
  });
}
