import { SAVE_ENTRY, GET_LIST, GET_ENTRY } from '../actions/types';

const initialState = {
    entry: null,
    entries: [],
};

export default function(state = initialState, action ) {
    switch(action.type) {
        case SAVE_ENTRY:
        case GET_ENTRY:
            return {
                ...state,
                entry: action.payload
            };
        case GET_LIST:
            return {
                ...state,
                entries: action.payload
            };
        default:
            return state;
    }
}