import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';

class App extends Component {
  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    tasks: Tasks.find({}).fetch(),
  };
}, App);
