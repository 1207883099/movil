import axios from 'axios';
import {getDomain} from './config';

///  PETICIONES GET

export async function SubirParteDiario(data) {
  return await axios({
    method: 'POST',
    url: `${getDomain()}/api/parteDiario`,
    data,
  });
}
