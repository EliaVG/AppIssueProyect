// Archivo de variables auxiliares
let appInfo = {};
let appId = '';

export default appInfo;
export const getAppInfo = () => appInfo
export const setAppInfo = (info) => {
    appInfo = info;
}

export const setAppId = (id) => {appId = id};
export const getAppId = () => appId; 

// Marcas de televisores que se mostrarán en los desplegables
 export const brands = [{ value: 'vestel', label: 'Vestel' },  
 { value: 'toshiba', label: 'Toshiba' },  
 { value: 'hisense', label: 'Hisense' },  
 { value: 'samsung', label: 'Samsung' },  
 { value: 'lg', label: 'LG' },  
 { value: 'elAraby', label: 'ElAraby' },  
 { value: 'artel', label: 'Artel' },  
 { value: 'axen', label: 'AXEN' },  
 { value: 'blaupunkt', label: 'Blaupunkt' },  
 { value: 'daiko', label: 'Daiko' },  
 { value: 'ergo', label: 'Ergo' },  
 { value: 'jtc', label: 'JTC' },  
 { value: 'kodak', label: 'Kodak' },  
 { value: 'masterg', label: 'Masterg' },  
 { value: 'medion', label: 'Medion' },  
 { value: 'metz', label: 'METZ' },  
 { value: 'noblex', label: 'Coocaa' },
 { value: 'panasonic', label: 'Panasonic' },
 { value: 'profilo', label: 'Profilo' },
 { value: 'schneider', label: 'Schneider' },
 { value: 'sharp', label: 'Sharp' },
 { value: 'sunny', label: 'Sunny' },
 { value: 'tornado', label: 'Tornado' },
 { value: 'MP3 car audio', label: 'MP3 Car Audio' },
 { value: 'turnkey/konka', label: 'Turnkey/Konka' },
 { value: 'umc', label: 'UMC' },
 { value: 'vidaa', label: 'Vidaa' },
 { value: 'vision+', label: 'Vision+' },
 { value: 'xiaomi', label: 'Xiaomi' }];