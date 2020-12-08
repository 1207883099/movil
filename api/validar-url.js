import axios from 'axios';
import {getDomain} from './config';

///  PETICIONES GET

export async function ValidateUrl() {
  return await axios({
    method: 'GET',
    url: `${getDomain()}/api/validation`,
  });
}
