import os from 'os';

const getPrivateIp = () => {
    const interfaces = os.networkInterfaces();
    try{
        for (let devName in interfaces) {
            let iface = interfaces[devName];

            if(Array.isArray(iface) === false || iface.length === 0) {
                continue;
            }

            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                    return alias.address;
            }
        }
        return '0.0.0.0'
    }catch(error){
        throw error;
    }
};

export default getPrivateIp;