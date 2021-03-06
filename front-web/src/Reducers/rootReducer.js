import userReducer from './userReducer'
import topUserReducer from "./topUserReducer";
import {combineReducers} from "redux";
import assignmentReducer from "./assignmentReducer";
import subjectReducer from "./subjectReducer";
import assignmentDetailReducer from "./assignmentDetailReducer";
import WebSocketReducer from "./wsReducer";
import requestReducer from "./requestReducer";

const rootReducer = combineReducers({
    user: userReducer,
    topUser: topUserReducer,
    assignments: assignmentReducer,
    subjects: subjectReducer,
    assignment: assignmentDetailReducer,
    wsInfo: WebSocketReducer,
    requestSolved: requestReducer
})

export default rootReducer;
