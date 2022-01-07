import { PUBLISHED_ASSIGNMENT, GET_ALL_ASSIGNMENT_USER} from "../Constants/Constant";


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
        default: return state;
    }
}