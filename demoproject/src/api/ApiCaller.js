import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const callAxios = async (method, url, params, headerNeeded, callBack) => {

    console.log('URL: ', url + ' (' + method + ')');
    let auth_Token = await AsyncStorage.getItem('AUTHTOKEN').then((val) => {
        let tempVal = JSON.parse(val)
        return "Bearer " + tempVal
    });

    console.log('PARAMS: ', JSON.stringify(params, null, 2));

    axios.defaults.timeout = 30000;
    let axiosVal = headerNeeded == true ? { method: method, url: url, headers: { vAuthorization: auth_Token }, data: params } : { method: method, url: url, data: params }

    // console.log("TOKEN VALUE : ", auth_Token);
    // console.log("headerNeeded : ", headerNeeded);
    console.log("HEADER VALUE : ", axiosVal);

    axios(axiosVal)
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


// const callAPIFormData = async (method, url, params, callBack) => {
//     method = method || 'POST';
//     let auth_Token = await AsyncStorage.getItem('AUTHTOKEN').then((val) => {
//         console.log("Got auth value : ", val);
//     });
//     console.log("paramm for photo : ", params?.image);

//     const formData = new FormData();

//     const photoUri = params?.image;
//     const photoName = photoUri.substring(photoUri);
//     formData.append({
//         uri: photoUri,
//         name: photoName,
//         type: 'image/jpg',
//     });
//     console.log('URL: ', url + ' (' + method + ')');
//     console.log('FORM DATA: ', JSON.stringify(formData));

//     axios({
//         method: method,
//         url: url,
//         headers: auth_Token,
//         data: formData,
//     })
//         .then(response => {
//             // console.log('RESPONSE: ', JSON.stringify(response?.data, null, 2));
//             const statusCode = response?.status || 400;

//             callBack(statusCode, response?.data); //response
//         })
//         .catch(function (error) {
//             console.log(error);
//             const errorResp = error?.response;

//             const statusCode = errorResp?.status || 401; // const statusCode = errorResp?.status || 401;
//             callBack(statusCode, errorResp?.data);
//         });
// };



const callLoginApi = (params, callBack) => {
    callAxios('POST', "http://hexeros.com/dev/finowise/api/V1/verify_otp", params, false, callBack);
};
const callTradeListApi = (params, callBack) => {
    callAxios('POST', "http://hexeros.com/dev/finowise/api/V1/mentor/trade_list", params, true, callBack);
};



export default {
    callLoginApi,
    callTradeListApi
}