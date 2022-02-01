import {axios} from '../Interceptor'
import ToastServive from 'react-material-toast';
import {API_URL, END_POINT_LOGIN, FETCH_ACCOUNT, LOGIN_ACCOUNT} from "../Constants/Constant";
import {history} from "../Helper/history";

const toast = ToastServive.new({
    place: 'topRight',
    duration: 2,
    maxCount: 20
});

export const login = (userRequest = {email: '', password: ''}) => {
    return async (dispatch) => {
        const authenticationRequest = {
            email: userRequest.username,
            password: userRequest.password
        }
        return await axios.post(API_URL + END_POINT_LOGIN, authenticationRequest).then(res => {
            if (res.data) {
                const obj = {loggedIn: true, ...res.data};
                localStorage.setItem("Authorization", res.data.jwt);
                localStorage.setItem("user", JSON.stringify(obj));
                history.push('/')
                dispatch(_login(res.data));
            }
        }).catch(err => {
            if (err.response) {
                toast.error(err.response.data.message, () => {
                })
            }
            console.log(err);
        })
    }
};

export const _login = (user) => ({
    type: LOGIN_ACCOUNT,
    user
});

export const fetchDataUser = () => {
    return async (dispatch) => {
        let jwtStr = localStorage.getItem("Authorization");
        return await axios.post(API_URL + '/auth/fetch', {jwt: jwtStr}).then(res => {
            if (res.data) {
                //dispatch(_fetchDataUser({...res.data}));
            }
        }).catch(err => {
            console.log(err);
        })
    }
}

export const _fetchDataUser = (user) => ({
    type: FETCH_ACCOUNT,
    user
})