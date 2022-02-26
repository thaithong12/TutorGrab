import {INIT_WS_CONNECTION, INIT_WS_TOKEN, SET_WS_GROUPS, WS_CHECK_CONNECTED,} from "../Constants/Constant";

const initialState = {
    isWsConnected: false,
    wsObject: null,
    wsUserTokenValue: "",
    wsUserGroups: [],
    currentActiveGroup: "",
    allMessagesFetched: false,
    usersInConversationList: [],
    chatHistory: []
}

const WebSocketReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT_WS_TOKEN:
            return {...state, wsUserTokenValue: action.payload};
        case INIT_WS_CONNECTION:
            return {...state, wsObject: action.payload};
        case WS_CHECK_CONNECTED:
            return {...state, isWsConnected: action.payload};
        case SET_WS_GROUPS:
            return {...state, wsUserGroups: action.payload};
        default:
            return state;
    }
}

export default WebSocketReducer;