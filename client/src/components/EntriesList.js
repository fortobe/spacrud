import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getList, deleteEntry } from '../actions/entries';

class EntriesList extends Component {

    constructor() {
        super();
        this.state = {
            entries: []
        };
        this.deleteItem = this.deleteItem.bind(this);
    }

    componentDidMount() {
        this.props.getList({user: this.props.auth.user.id});
    }

    deleteItem(e) {
        const confirmDelete = window.confirm('Are you sure you want to delete the entry?');
        if (confirmDelete) this.props.deleteEntry({_id: e.target.dataset.id, user: this.props.auth.user.id});
    }

    render() {
        return (
            <div style={{marginTop: '20px'}}>
                    {this.props.entries.map((entry) => {
                        return (
                            <div key={entry._id} className="card" data-id={entry._id} style={{marginBottom: '20px'}}>
                                <div className="card-header">
                                    <div className="btn-toolbar float-right" role="toolbar">
                                        <div className="btn-group" role="group">
                                            <Link className="btn btn-secondary" to={'/edit/'+entry._id}>Edit</Link>
                                            <button className="btn btn-danger" onClick={this.deleteItem} data-id={entry._id}>Delete</button>
                                        </div>
                                    </div>
                                    {entry.name}
                                </div>
                                <div className="card-body">
                                    <p>{entry.text.length > 100? entry.text.substring(0, 97)+'...':entry.text}</p>
                                </div>
                            </div>
                        );
                    })}
            </div>
        );
    }
}

EntriesList.propTypes = {
    getList: PropTypes.func.isRequired,
    deleteEntry: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    entries: state.app.entries,
    auth: state.auth
});

export default connect(mapStateToProps, {getList, deleteEntry})(EntriesList);