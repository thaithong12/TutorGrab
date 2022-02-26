import {axios} from "../Interceptor";
import {API_URL, END_POINT_NOTIFICATIONS, GET_ALL_NOTIFICATION} from "../Constants/Constant";

export const fetchAllNotificationOfUser = (userId) => {
    return async (dispatch) => {
        return await axios.get(API_URL + END_POINT_NOTIFICATIONS + userId).then(res => {
            dispatch(_fetchAllNotificationOfUser(res.data));
        }).catch(err => {
            console.log(err.response.data);
        });
    }
}

export const _fetchAllNotificationOfUser = (notificationsList) => ({
    type: GET_ALL_NOTIFICATION,
    notificationsList
});