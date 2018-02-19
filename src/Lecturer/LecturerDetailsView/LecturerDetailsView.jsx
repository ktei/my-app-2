import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { Segment, Loader, Message } from '../../framework/ui';
import { statusCodeToError } from '../../framework/utils';

function createNewLecturer() {
  return {
    name: '',
    email: '',
    bibliography: '',
    staffNumber: '',
  };
}

class LecturerDetailsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isEditing: false,
      isSaving: false,
      showSuccess: false,
      showError: false,
      error: '',
      lecturer: null,
    };
  }

  componentDidMount() {
    this.fetchLecturer();
  }

  fetchLecturer() {
    const { id } = this.props.match.params;
    if (id === 'create') {
      this.setState({ lecturer: createNewLecturer(), isEditing: true });
      return;
    }

    this.setState({ isLoading: true, error: '' });
    const onSuccess = (response) => {
      this.setState({
        lecturer: response.data,
        isLoading: false,
      });
    };
    const onError = (error) => {
      this.setState({
        lecturer: null,
        error: statusCodeToError(error.response.status),
        showError: true,
        isLoading: false,
      });
    };
    axios.get(`/api/lecturers/${id}`).then(onSuccess).catch(onError);
  }

  handleFieldChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      lecturer: {
        ...this.state.lecturer,
        [name]: value,
      },
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ isSaving: true, showSuccess: false, showError: false });
    const { lecturer } = this.state;
    const onSuccess = () => {
      this.setState({ isSaving: false, showSuccess: true });
    };
    const onError = (error) => {
      this.setState({
        isSaving: false,
        showError: true,
        error: `${error.response.statusText} (${error.response.status})`
      });
    };
    if (this.props.match.params.id === 'create') {
      axios.post('/api/lecturers', lecturer)
        .then(onSuccess)
        .catch(onError);
    } else {
      axios.put(`/api/lecturers/${lecturer.id}`, lecturer)
        .then(onSuccess)
        .catch(onError);
    }
  }

  handleCancel() {
    this.props.history.push('/lecturers');
  }

  render() {
    const lecturer = this.state.lecturer || createNewLecturer();

    return (
      <Segment style={{ width: 600, margin: '0 auto' }}>
        {this.state.showSuccess && (
          <Message header="Success!" type="success">
            <p>All changes have been saved</p>
          </Message>
        )}
        {this.state.showError && (
          <Message header="Oops!" type="negative">
            <p>{this.state.error}</p>
          </Message>
        )}
        <form className="ui form" onSubmit={this.handleSubmit.bind(this)}>
          <h4 className="ui dividing header">Lecturer Details</h4>
          <div className="fields">
            <div className="eight wide field">
              <label>Name</label>
              <input type="text" name="name" value={lecturer.name} onChange={this.handleFieldChange.bind(this)} placeholder="Name" />
            </div>
            <div className="eight wide field">
              <label>Email</label>
              <input type="email" name="email" value={lecturer.email} onChange={this.handleFieldChange.bind(this)} placeholder="Email" />
            </div>
          </div>
          <div className="fields">
            <div className="eight wide field">
              <label>Staff number</label>
              <input type="text" name="staffNumber" value={lecturer.staffNumber} onChange={this.handleFieldChange.bind(this)} placeholder="Staff number" />
            </div>
          </div>
          <div className="field">
            <label>Bio</label>
            <textarea name="bibliography" rows="2" value={lecturer.bibliography} onChange={this.handleFieldChange.bind(this)} placeholder="Bio" />
          </div>
          <button
            className={classnames('ui teal button', { loading: this.state.isSaving })}
            type="submit"
            disabled={this.state.isSaving}
          >
            Save changes
          </button>
          <button className="ui button" type="button" onClick={this.handleCancel.bind(this)}>
            Cancel
          </button>
        </form>
        {this.state.isLoading && <Loader />}
      </Segment>
    );
  }
}

export default withRouter(LecturerDetailsView);
