import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { Segment, Loader, Message } from '../../framework/ui';
import { statusCodeToError } from '../../framework/utils';

function createNewCourse() {
  return {
    title: '',
    fee: '',
    maxStudent: 10,
    description: '',
  };
}

class CourseDetailsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isEditing: false,
      isSaving: false,
      showSuccess: false,
      showError: false,
      error: '',
      course: null,
    };
  }

  componentDidMount() {
    this.fetchCourse();
  }

  fetchCourse() {
    const { id } = this.props.match.params;
    if (id === 'create') {
      this.setState({ course: createNewCourse(), isEditing: true });
      return;
    }

    this.setState({ isLoading: true, error: '' });
    const onSuccess = (response) => {
      this.setState({
        course: response.data,
        isLoading: false,
      });
    };
    const onFail = (error) => {
      this.setState({
        course: null,
        error: statusCodeToError(error.response.status),
        showError: true,
        isLoading: false,
      });
    };
    axios.get(`/api/courses/${id}`).then(onSuccess).catch(onFail);
  }

  handleFieldChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      course: {
        ...this.state.course,
        [name]: value,
      },
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ isSaving: true, showSuccess: false, showError: false });
    const { course } = this.state;
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
      axios.post('/api/courses', course)
        .then(onSuccess)
        .catch(onError);
    } else {
      axios.put(`/api/courses/${course.id}`, course)
        .then(onSuccess)
        .catch(onError);
    }
  }

  handleCancel() {
    this.props.history.push('/courses');
  }

  render() {
    const course = this.state.course || createNewCourse();

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
          <h4 className="ui dividing header">Course Details</h4>
          <div className="fields">
            <div className="eleven wide field">
              <label>Title</label>
              <input type="text" name="title" value={course.title} onChange={this.handleFieldChange.bind(this)} placeholder="Title" />
            </div>
            <div className="five wide field">
              <label>Fee ($)</label>
              <input type="text" name="fee" value={course.fee} onChange={this.handleFieldChange.bind(this)} placeholder="Fee ($)" />
            </div>
          </div>
          <div className="fields">
            <div className="five wide field">
              <label>Max students</label>
              <select name="maxStudent" value={course.maxStudent} className="ui fluid dropdown" onChange={this.handleFieldChange.bind(this)}>
                <option value="10">10</option>
                <option value="16">16</option>
                <option value="24">24</option>
                <option value="32">32</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Description</label>
            <textarea name="description" rows="2" value={course.description} onChange={this.handleFieldChange.bind(this)} />
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

export default withRouter(CourseDetailsView);
