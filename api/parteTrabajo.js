import axios from 'axios';
import {getDomain} from './config';

///  PETICIONES GET

export async function SubirParteTrabajo(data) {
  return await axios({
    method: 'POST',
    url: `${getDomain()}/api/parteTrabajo`,
    data: {
      dataPD: data,
    },
  });
}
