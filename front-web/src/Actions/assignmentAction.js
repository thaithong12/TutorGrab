import {axios} from "../Interceptor";
import {
    API_URL,
    END_POINT_ASSIGNMENT, END_POINT_TODO_LIST_ASSIGNMENT,
    GET_ALL_ASSIGNMENT,
    GET_ALL_ASSIGNMENT_USER,
    GET_ASSIGNMENT, GET_TODO_LIST_ASSIGNMENT
} from "../Constants/Constant";

export const createAssignment = (assignment) => {
    return async (dispatch) => {
        return await axios.post(API_URL + END_POINT_ASSIGNMENT, assignment).then(res => {
            dispatch(_getAllAssignment(res.data));
        }).catch(err => {
            console.log(err);
        })
    }
};

export const getAllAssignment = () => {
    return async (dispatch) => {
        return await axios.get(API_URL + END_POINT_ASSIGNMENT).then(res => {
            dispatch(_getAllAssignment(res.data));
        }).catch(err => {
            console.log(err);
        })
    }
};

export const _getAllAssignment = (assignments) => ({
    type: GET_ALL_ASSIGNMENT,
    assignments
});

export const getAssignmentsOfUser = (id, who) => {
    return async (dispatch) => {
        return await axios.get(API_URL + END_POINT_ASSIGNMENT + '/user/' + id + '/' + who).then(res => {
            dispatch(_getAssignmentsOfUser(res.data));
        }).catch(err => {
            console.log(err);
        })
    }
};

export const _getAssignmentsOfUser = (assignment) => ({
    type: GET_ALL_ASSIGNMENT_USER,
    assignment
});

export const getAssignmentDetail = (id) => {
    return async (dispatch) => {
        return await axios.get(API_URL + END_POINT_ASSIGNMENT + '/' + id).then(res => {
            dispatch(_getAssignmentDetail(res.data));
            //console.log(res.data);
        }).catch(err => {
            console.log(err);
        })
    }
};

export const _getAssignmentDetail = (assignment) => ({
    type: GET_ASSIGNMENT,
    assignment
})

export const getTodoListAssignment = () => {
    return async (dispatch) => {
        return await axios.get(API_URL + END_POINT_TODO_LIST_ASSIGNMENT).then(res => {
            dispatch(_getTodoListAssignment(res.data));
        }).catch(err => {
            //console.log(err);
        })
    }
}

export const _getTodoListAssignment = (assignments) => ({
    type: GET_TODO_LIST_ASSIGNMENT,
    assignments
})