import axios from "axios";
import {
    API_URL,
    END_POINT_PUBLISHED_ASSIGNMENT,
    END_POINT_TOP_USER,
    PUBLISHED_ASSIGNMENT,
    TOP_USER
} from "../Constants/Constant";


export const topUser = () => {
    return async (dispatch) => {
        return await axios.get(API_URL + END_POINT_TOP_USER).then(res => {
            dispatch(_topUser(res.data));
        }).catch(err => {
            console.log(err);
        })
    }
}

export const _topUser = (user) => ({
    type: TOP_USER,
    user
})

export const publishedAssignment = () => {
    return async (dispatch) => {
        return await axios.get(API_URL + END_POINT_PUBLISHED_ASSIGNMENT).then(res => {
            dispatch(_publishedAssignment(res.data));
        }).catch(err => {
            console.log(err);
        })
    }
}

export const _publishedAssignment = (ass) => ({
    type: PUBLISHED_ASSIGNMENT,
    ass
})