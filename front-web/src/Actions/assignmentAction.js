import {axios} from "../Interceptor";
import {
    API_URL,
    END_POINT_ASSIGNMENT, END_POINT_TODO_LIST_ASSIGNMENT,
    GET_ALL_ASSIGNMENT,
    GET_ALL_ASSIGNMENT_USER,
    GET_ASSIGNMENT, GET_TODO_LIST_ASSIGNMENT
} from "../Constants/Constant";
import ToastServive from "react-material-toast";

export const toast = ToastServive.new({
    place: 'topRight',
    duration: 5,
    maxCount: 20
});

export const createAssignment = (assignment) => {
    return async (dispatch) => {
        return await axios.post(API_URL + END_POINT_ASSIGNMENT, assignment).then(res => {
            dispatch(_getAllAssignment(res.data));
        }).catch(err => {
            console.log(err);
        })
    }
};

export const updateAssignment = (assignment) => {
    return async (dispatch) => {
        return await axios.put(API_URL + END_POINT_ASSIGNMENT + "/" + assignment.id, assignment).then(res => {

        }).catch((error) => {
            toast.error(error.response.data.message.toUpperCase(), () => {
            });
        });
    }
}

export const deleteAssignment = (id) => {
    return async (dispatch) => {
        return await axios.delete(API_URL + END_POINT_ASSIGNMENT + "/" + id).then(res => {
            return res;
        }).catch((error) => {
            if (error.response.status === 400) {
                toast.error(error.response.data.message.toUpperCase(), () => {
                });
            } else {
                console.log(error);
            }
            return error;
        });
    }
}

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
            console.log(res.data)
        }).catch((error) => {
            console.log(error)
        });
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
        }).catch((error) => {
            toast.error(error.response.data.message.toUpperCase(), () => {
            });
        });
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

export const updateAnswerAssignment = (assignment) => {
    return async (dispatch) => {
        return await axios.put(API_URL + END_POINT_ASSIGNMENT + "/" + assignment.id + '/answer', assignment).then(res => {
            toast.success('Send Answer Success!!', () => {})
        }).catch((error) => {
            toast.error(error.response.data.message.toUpperCase(), () => {
            });
        });
    }
}