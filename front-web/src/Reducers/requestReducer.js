

import {GET_REQUEST_LIST_SOLVED} from "../Constants/Constant";


const initialState = [];

export default function requestReducer(state = initialState, action) {
    switch (action.type) {
        case GET_REQUEST_LIST_SOLVED: {
            let newState = [...action.requestList];
            return newState;
        }
        default: return state;
    }
}