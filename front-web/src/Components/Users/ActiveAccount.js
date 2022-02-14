import {useParams} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import {API_URL, END_POINT_PUBLISHED_ASSIGNMENT, END_POINT_TOP_USER} from "../../Constants/Constant";
import {_publishedAssignment, _topUser} from "../../Actions/homeAction";
import {history} from "../../Helper/history";

export function ActiveAccount() {
    const {token} = useParams();

    console.log(token);
    useEffect(() => {
        async function fetchData() {
            await axios.get(API_URL + '/auth/active-account?token=' + token).then(res => {
                console.log(res)
                debugger;
                if (res.status === 200) {
                    history.push('/sign-in');
                } else {
                    history.push('/404');
                }
            }).catch(err => {
                console.log(err);
            })
        }
        fetchData();
    }, [])
    return (<div>

    </div>)
}