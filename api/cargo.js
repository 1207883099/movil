import axios from 'axios';
import {getDomain} from './config';

///  PETICIONES GET

export async function obtenerCargos(token) {
  return await axios({
    method: 'GET',
    url: `${getDomain()}/api/cargo`,
    headers: {'access-token': token},
  });
}
