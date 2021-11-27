import axios from 'axios'
import ToastServive from 'react-material-toast';
import {API_URL, END_POINT_LOGIN, LOGIN_ACCOUNT} from "../Constants/Constant";
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
                /*if (obj.authorization.includes("ROLE_ADMIN")) {
                    obj.isAdmin = true;
                } else obj.isAdmin = false;*/
                localStorage.setItem("Authorization", res.data.jwt);
                localStorage.setItem("user", JSON.stringify(obj));
                history.push('/')
                dispatch(_login(res.data));
            } else {
                toast.error("Username or Password not valid", () => {

                })
            }
        }).catch(err => {
            console.log(err);
        })
    }
};

export const _login = (user) => ({
    type: LOGIN_ACCOUNT,
    user
});