import {TOP_USER} from "../Constants/Constant";


const initialState = []

export default function topUserReducer(state = initialState, action) {
    switch (action.type) {
        case TOP_USER: {
            let newState = [...action.user];
            return newState;
        }
        default: return state;
    }
}