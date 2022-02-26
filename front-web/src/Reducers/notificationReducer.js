import {GET_ALL_NOTIFICATION} from "../Constants/Constant";


const initialState = [];

export default function assignmentReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_NOTIFICATION: {
            let newState = [...action.ass];
            return newState;
        }
        default: return state;
    }
}