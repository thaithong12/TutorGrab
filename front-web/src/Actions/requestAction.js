import {axios} from "../Interceptor";
import {
    API_URL,
    END_POINT_ALL_REQUEST_SOLVE_ASSIGNMENT,
    END_POINT_REQUEST_SOLVE_ASSIGNMENT,
    GET_REQUEST_LIST_SOLVED
} from "../Constants/Constant";
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

export const getAllRequestForEachAssignmentOfUser = (requestId) => {
    return async (dispatch) => {
        return await axios.get(API_URL + END_POINT_ALL_REQUEST_SOLVE_ASSIGNMENT + requestId).then(res => {
            if (res.status === 200) {
                dispatch(_getAllRequestForEachAssignmentOfUser(res.data));
                console.log('Goi vao day ')
                console.log(res.data)
            }
        }).catch(err => {
            console.log(err)
        })
    }
}

export const _getAllRequestForEachAssignmentOfUser = (requestList) => ({
    type: GET_REQUEST_LIST_SOLVED,
    requestList
});

export const acceptRequestForAssignment = (assignmentId, responseId, requestId, difficultType) => {
    return async (dispatch) => {
        let data = {
            assignmentId: assignmentId,
            responseId: responseId,
            requestId: requestId,
            difficultType: difficultType
        }
        return await axios.post(API_URL + END_POINT_REQUEST_SOLVE_ASSIGNMENT + '/accept', data).then(res => {
            dispatch(getAllRequestForEachAssignmentOfUser(data.requestId));
        }).catch(err => {
            console.log(err.response.data);
            if (err.response.status === 400) {
                toast.error(err.response.data.message,() => {})
            }
        })
    }
}

export const rejectRequestForAssignment = (assignmentId, responseId, requestId) => {
    return async (dispatch) => {
        let data = {
            assignmentId: assignmentId,
            responseId: responseId,
            requestId: requestId
        }
        return await axios.post(API_URL + END_POINT_REQUEST_SOLVE_ASSIGNMENT + '/reject', data).then(res => {
            dispatch(getAllRequestForEachAssignmentOfUser(data.requestId));
        }).catch(err => {
            console.log(err.response.data);
        })
    }
}
