import axios from 'axios';
import {getDomain} from './config';

///  PETICIONES GET

export async function Auth(codeAccess) {
  return await axios({
    method: 'POST',
    url: `${getDomain()}/api/auth`,
    data: {codeAccess},
  });
}
