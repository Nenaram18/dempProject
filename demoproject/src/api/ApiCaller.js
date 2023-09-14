import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const callAxios = async (method, url, params, callBack) => {

    console.log('URL: ', url + ' (' + method + ')');
    let auth_Token = await AsyncStorage.getItem('AUTHTOKEN').then((val) => {
        console.log("Got auth value : ", val);
    });
    console.log('PARAMS: ', JSON.stringify(params, null, 2));
    axios.defaults.timeout = 30000;
    axios({
        method: method,
        url: url,
        headers: auth_Token,
        data: params,
    })
        .then(response => {
            // console.log('SUCCESS RESPONSE: ', JSON.stringify(response?.data, null, 2));
            const statusCode = response?.status || 400;

            callBack(statusCode, response?.data); //response
        })
        .catch(function (error) {
            //   console.log(error);
            // console.log('ERROR RESPONSE: ', JSON.stringify(error?.response?.data, null, 2));
            const errorResp = error?.response;

            const statusCode = errorResp?.status || 401; // const statusCode = errorResp?.status || 401;
            callBack(statusCode, errorResp?.data);
        });
};


const callAPIFormData = async (method, url, params, callBack) => {
    method = method || 'POST';
    let auth_Token = await AsyncStorage.getItem('AUTHTOKEN').then((val) => {
        console.log("Got auth value : ", val);
    });
    console.log("paramm for photo : ", params?.image);

    const formData = new FormData();

    const photoUri = params?.image;
    const photoName = photoUri.substring(photoUri);
    formData.append({
        uri: photoUri,
        name: photoName,
        type: 'image/jpg',
    });
    console.log('URL: ', url + ' (' + method + ')');
    console.log('FORM DATA: ', JSON.stringify(formData));

    axios({
        method: method,
        url: url,
        headers: auth_Token,
        data: formData,
    })
        .then(response => {
            // console.log('RESPONSE: ', JSON.stringify(response?.data, null, 2));
            const statusCode = response?.status || 400;

            callBack(statusCode, response?.data); //response
        })
        .catch(function (error) {
            console.log(error);
            const errorResp = error?.response;

            const statusCode = errorResp?.status || 401; // const statusCode = errorResp?.status || 401;
            callBack(statusCode, errorResp?.data);
        });
};



const callRegisterApi = (params, callBack) => {
    callAxios('POST', "https://genuinemark.org/piccollect/user/register", params, callBack);
};
const callLoginApi = (params, callBack) => {
    callAxios('POST', "https://genuinemark.org/piccollect/user/login", params, callBack);
};


const callUploadPicsApi = (params, callBack) => {
    callAPIFormData('POST', "https://genuinemark.org/piccollect/picture/upload", params, callBack);
};

export default {
    callRegisterApi,
    callLoginApi,
    callUploadPicsApi
}