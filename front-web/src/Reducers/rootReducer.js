import userReducer from './userReducer'
import topUserReducer from "./topUserReducer";
import {combineReducers} from "redux";
import assignmentReducer from "./assignmentReducer";

const rootReducer = combineReducers({
    user: userReducer,
    topUser: topUserReducer,
    assignments: assignmentReducer
})

export default rootReducer;
