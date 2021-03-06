import {END_POINT_REGISTER, FETCH_ACCOUNT, LOGIN_ACCOUNT, LOGOUT_ACCOUNT} from '../Constants/Constant';


let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? {isAdmin:user.isAdmin , loggedIn: user.loggedIn, user } : {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case LOGOUT_ACCOUNT:
            return {};
        case LOGIN_ACCOUNT: {
            let  newState = {...state, user: action.user, loggedIn: true}
            return newState;
        }
        case END_POINT_REGISTER: {
            let newState = {...state,isSuccess: true};
            return newState;
        }
        case FETCH_ACCOUNT: {
            let newState = {...state, user: action.user, loggedIn: true};
            return newState;
        }
        default: return state;
    }
}