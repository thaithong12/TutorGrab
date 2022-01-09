import {PUBLISHED_ASSIGNMENT, GET_ALL_ASSIGNMENT_USER, GET_TODO_LIST_ASSIGNMENT} from "../Constants/Constant";


const initialState = [];

export default function assignmentReducer(state = initialState, action) {
    switch (action.type) {
        case PUBLISHED_ASSIGNMENT: {
            let newState = [...action.ass];
            return newState;
        }
        case GET_ALL_ASSIGNMENT_USER: {
            let newState = [...action.assignment]
            return newState;
        }
        case GET_TODO_LIST_ASSIGNMENT: {
            let newState = [...action.assignments]
            return newState;
        }
        default: return state;
    }
}