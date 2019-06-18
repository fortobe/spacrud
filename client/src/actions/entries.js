import axios from 'axios';
import { GET_ERRORS, GET_LIST, GET_ENTRY } from './types';

export const saveEntry = (entry, history) => dispatch => {
    axios.post('/api/save', entry)
        .then(res => {
            alert('Entry succesfully saved');
            history.push('/')
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
};

export const getList = (req) => dispatch => {
    axios.post('/api/list', req)
        .then(res => {
            if (res.data.success) {
                dispatch({
                    type: GET_LIST,
                    payload: res.data.entries
                });
            }
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
};

export const getEntry = (req) => dispatch => {
    axios.post('/api/get', req)
        .then(res => {
            if (res.data.success) {
                dispatch({
                    type: GET_ENTRY,
                    payload: res.data.entry
                });
            }
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
};

export const deleteEntry = (req) => dispatch => {
    axios.post('/api/del', req)
        .then(res => {
            if (res.data.success) {
                window.location.href = '/';
            }
        })
        .catch(err => {
            if (!!window.debugMode) console.error(err);
        });
};