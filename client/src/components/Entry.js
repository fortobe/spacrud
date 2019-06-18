import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { saveEntry, getEntry, deleteEntry } from '../actions/entries';
import classnames from 'classnames';

class Entry extends Component {

    constructor() {
        super();
        this.state = {
            _id: '',
            name: '',
            text: '',
            user: '',
            errors: {}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const {user} = this.props.auth;
        let entry = {
            name: this.state.name,
            text: this.state.text,
            user: user.id,
        };
        if (!!this.state._id) entry._id = this.state._id;
        this.setState({...entry});
        this.props.saveEntry(entry, this.props.history);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() {
        if (this.props.type === 'Edit') {
            this.props.getEntry({id: this.props.match.params.id});
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        if (nextProps.entry) {
            this.setState({...nextProps.entry});
        }
    }

    deleteItem(e) {
        const confirmDelete = window.confirm('Are you sure you want to delete the entry?');
        if (confirmDelete) this.props.deleteEntry({_id: e.target.dataset.id, user: this.props.auth.user.id});
    }

    render() {
        const { errors } = this.state;
        const id = (!!this.props.entry) ? <input type="hidden" name="id" value={this.props.entry._id}/> : '';
        const del = (!!this.props.entry) ? <button
            type="button"
            data-id={this.props.entry._id}
            onClick={this.deleteItem}
            className={'btn btn-danger'}
        >Delete</button> : '';
        return(
            <div className="container" style={{ marginTop: '50px', width: '700px'}}>
                <h2 style={{marginBottom: '40px'}}>{this.props.type} Entry</h2>
                <form onSubmit={ this.handleSubmit }>
                    {errors.user && (<div className="invalid-feedback">{errors.user}</div>)}
                    {id}
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Name"
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.name
                            })}
                            name="name"
                            onChange={ this.handleInputChange }
                            value={ this.state.name }
                        />
                        {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                    </div>
                    <div className="form-group">
                        <textarea
                            placeholder="text here..."
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.text
                            })}
                            name="text"
                            onChange={ this.handleInputChange }
                            value={ this.state.text}
                        ></textarea>
                        {errors.text && (<div className="invalid-feedback">{errors.text}</div>)}
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                        {del}
                    </div>
                </form>
            </div>
        )
    }
}

Entry.propTypes = {
    saveEntry: PropTypes.func.isRequired,
    getEntry: PropTypes.func.isRequired,
    deleteEntry: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    entry: state.app.entry,
    errors: state.errors,
    auth: state.auth
});

export default connect(mapStateToProps, {saveEntry, getEntry, deleteEntry})(withRouter(Entry));