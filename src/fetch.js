import Promise from '@lvchengbin/promise';
import { URLSearchParams } from '@lvchengbin/url';


export default ( url, options ) => {

    let {
        data,
        async = true,
        type = 'json',
        cache = false,
        method = 'GET',
        headers = {},
        username,
        password,
        processData = true,
        credentials = false,
        xhr = new XMLHttpRequest()
    } = options;

    method = method.toUpperCase;

    const hasContent = !/^(GET|HEAD)$/.test( method );

    return new Promise( ( resolve, reject ) => {

        if( credentials ) {
            xhr.withCredentials = true;
        }

        const onreadystatechange = () => {
            if( xhr.readyState != 4 ) return;
            if( xhr.status === 0 ) return;


            
            
        };

    } );
};


