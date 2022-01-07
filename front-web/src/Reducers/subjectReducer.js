import {SUBJECTS_ALL} from "../Constants/Constant";

const initialState = []

export default function subjectReducer (state = initialState, action) {
    switch (action.type) {
        case SUBJECTS_ALL: {
            let newState = [...action.subjects];
            return newState;
        }
        default: return state;
    }
}