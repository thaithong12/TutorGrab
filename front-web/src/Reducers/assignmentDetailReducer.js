import {GET_ASSIGNMENT} from "../Constants/Constant";


const initialStateAssignment = {};

export default function assignmentDetailReducer(state = initialStateAssignment, action) {
    switch (action.type) {
        case GET_ASSIGNMENT: {
            let newState = {...action.assignment}
            return newState;
        }
        default: return state;
    }
}