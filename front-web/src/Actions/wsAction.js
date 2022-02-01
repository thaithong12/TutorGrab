import {
    API_URL,
    END_POINT_FETCH_ALL_GROUP,
    INIT_WS_CONNECTION,
    SET_WS_GROUPS,
    WS_CHECK_CONNECTED
} from "../Constants/Constant";
import {axios} from "../Interceptor";

export const initWsConnection = (reduxModel) => ({
    type: INIT_WS_CONNECTION,
    payload: reduxModel
})

export const wsHealthCheckConnected = (isWsConnected) => ({
    type: WS_CHECK_CONNECTED,
    payload: isWsConnected
})

export const wsFetchAllSortedGroup = (userId) => {
    return async (dispatch) => {
        return await axios.get(API_URL + END_POINT_FETCH_ALL_GROUP + userId).then(res => {
            dispatch(_wsFetchAllSortedGroup([...res.data]));
        }).catch(err => {
            console.log(err);
        })
    }
}

export const _wsFetchAllSortedGroup = (groupListModel) => ({
    type: SET_WS_GROUPS,
    payload: groupListModel
})
