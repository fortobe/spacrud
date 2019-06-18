import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import appReducer from './appReducer';

export default combineReducers({
    errors: errorReducer,
    auth: authReducer,
    app: appReducer
});