import {axios} from "../Interceptor";
import {API_URL, END_POINT_SUBJECTS, SUBJECTS_ALL} from "../Constants/Constant";


export const getAllSubject = () => {
    return async (dispatch) => {
        return await axios.get(API_URL + END_POINT_SUBJECTS).then(res => {
            dispatch(_subjectAll(res.data));
        }).catch(err => {
            console.log(err);
        })
    }
}

export const _subjectAll = (subjects) => ({
    type: SUBJECTS_ALL,
    subjects
})