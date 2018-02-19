import React from 'react';
import axios from 'axios';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';

import { Segment, Loader, Message } from '../../framework/ui';
import { statusCodeToError } from '../../framework/utils';

function createNewStudent() {
  return {
    fullName: '',
    gender: 'Male',
    dateOfBirth: '1999-01-01',
    email: '',
    credit: 0,
  };
}

class StudentDetailsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isEditing: false,
      isSaving: false,
      showSuccess: false,
      showError: false,
      error: '',
      student: null,
    };
  }

  componentDidMount() {
    this.fetchStudent();
  }

  fetchStudent() {
    const { id } = this.props.match.params;
    if (id === 'create') {
      this.setState({ student: createNewStudent(), isEditing: true });
      return;
    }

    this.setState({ isLoading: true, error: '' });
    const onSuccess = (response) => {
      this.setState({
        student: {
          ...response.data,
          firstName: response.data.fullName.split(' ')[0],
          lastName: response.data.fullName.split(' ')[1],
        },
        isLoading: false,
      });
    };
    const onError = (error) => {
      this.setState({
        student: null,
        error: statusCodeToError(error.response.status),
        showError: true,
        isLoading: false,
      });
    };
    axios.get(`/api/students/${id}`).then(onSuccess).catch(onError);
  }

  handleFieldChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      student: {
        ...this.state.student,
        [name]: value,
      },
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ isSaving: true, showSuccess: false, showError: false });
    const { student } = this.state;
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
      axios.post('/api/students', student)
        .then(onSuccess)
        .catch(onError);
    } else {
      axios.put(`/api/students/${student.id}`, student)
        .then(onSuccess)
        .catch(onError);
    }
  }

  handleCancel() {
    this.props.history.push('/students');
  }

  render() {
    const student = this.state.student || createNewStudent();

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
          <h4 className="ui dividing header">Student Details</h4>
          <div className="fields">
            <div className="eight wide field">
              <label>First name</label>
              <input type="text" name="firstName" value={student.firstName} onChange={this.handleFieldChange.bind(this)} placeholder="First name" />
            </div>
            <div className="eight wide field">
              <label>Last name</label>
              <input type="text" name="lastName" value={student.lastName} onChange={this.handleFieldChange.bind(this)} placeholder="Last name" />
            </div>
          </div>
          <div className="fields">
            <div className="eight wide field">
              <label>Email</label>
              <input type="email" name="email" value={student.email} onChange={this.handleFieldChange.bind(this)} placeholder="Email" />
            </div>
            <div className="eight wide field">
              <label>Date of birth</label>
              <input type="text" name="dateOfBirth" value={student.dateOfBirth} onChange={this.handleFieldChange.bind(this)} placeholder="YYYY-MM-DD" />
            </div>
          </div>
          <div className="fields">
            <div className="five wide field">
              <label>Gender</label>
              <select name="gender" value={student.gender} className="ui fluid dropdown" onChange={this.handleFieldChange.bind(this)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="five wide field">
              <label>Credit</label>
              <select name="credit" value={student.credit} className="ui fluid dropdown" onChange={this.handleFieldChange.bind(this)}>
                <option value="16">16</option>
                <option value="24">24</option>
                <option value="32">32</option>
              </select>
            </div>
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

export default withRouter(StudentDetailsView);
