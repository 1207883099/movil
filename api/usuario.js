import axios from 'axios';
import { getDomain } from './config';

///  PETICIONES GET

export async function Auth(ip_movil){
    return await axios({
        method: 'POST',
        url: `${getDomain()}/api/auth`,
        data: { ip_movil }
    });
}
