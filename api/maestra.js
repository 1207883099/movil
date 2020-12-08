import axios from 'axios';
import {getDomain} from './config';

///  PETICIONES GET

export async function obtenerMaestra(token) {
  return await axios({
    method: 'GET',
    url: `${getDomain()}/api/maestra`,
    headers: {'access-token': token},
  });
}
