import {axios} from "../Interceptor";
import {API_URL, END_POINT_REQUEST_SOLVE_ASSIGNMENT, END_POINT_TOP_USER, TOP_USER} from "../Constants/Constant";
import {toast} from "./assignmentAction";

export const createRequestSolveForAssignment = (request) => {
    return async (dispatch) => {
        return await axios.post(API_URL + END_POINT_REQUEST_SOLVE_ASSIGNMENT, request).then(res => {
            toast.success("Send request solve sucess!!", () => {
            });
        }).catch(err => {
            console.log(err.response.data);
            toast.error(err.response.data.message, () => {
            });
        })
    }
}
