import {PUBLISHED_ASSIGNMENT} from "../Constants/Constant";


const initialState = [];

export default function topUserReducer(state = initialState, action) {
    switch (action.type) {
        case PUBLISHED_ASSIGNMENT: {
            let newState = [...action.ass];
            return newState;
        }
        default: return state;
    }
}