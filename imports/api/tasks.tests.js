/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Tasks } from './tasks.js';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;

      beforeEach(() => {
        Tasks.remove({});
        taskId = Tasks.insert({
          text: 'test task',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
        });
      });

      it('can delete owned task', () => {
        // Finding the internal implementation of the task method to test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        // Fake method invocation that looks like what the method expects
        const invocation = { userId };
        // Running the method with `this` set to the fake invocation
        deleteTask.apply(invocation, [taskId]);
        // Verifying that the method does what is expected
        assert.equal(Tasks.find().count(), 0);
      });

      it('can make owned task private', () => {
        // Finding the internal implementation of the task method to test it in isolation
        const privateTask = Meteor.server.method_handlers['tasks.setPrivate'];
        const setToPrivate = true;
        // Fake method invocation that looks like what the method expects
        const invocation = { userId };
        // Running the method with `this` set to the fake invocation
        privateTask.apply(invocation, [taskId, setToPrivate]);
        // Verifying that the method does what is expected
        assert.equal(Tasks.findOne(taskId).private, true);
      });

      it('can make owned task public', () => {
        // Finding the internal implementation of the task method to test it in isolation
        const privateTask = Meteor.server.method_handlers['tasks.setPrivate'];
        const setToPrivate = false;
        // Fake method invocation that looks like what the method expects
        const invocation = { userId };
        // Running the method with `this` set to the fake invocation
        privateTask.apply(invocation, [taskId, !setToPrivate]);
        privateTask.apply(invocation, [taskId, setToPrivate]);
        // Verifying that the method does what is expected
        assert.equal(Tasks.findOne(taskId).private, false);
      });

      it('can check owned task, if private', () => {
        // Finding the internal implementation of the task method to test it in isolation
        const privateTask = Meteor.server.method_handlers['tasks.setPrivate'];
        const checkTask = Meteor.server.method_handlers['tasks.setChecked'];
        const setTo = true;
        // Fake method invocation that looks like what the method expects
        const invocation = { userId };
        // Running the method with `this` set to the fake invocation
        privateTask.apply(invocation, [taskId, setTo]);
        checkTask.apply(invocation, [taskId, setTo]);
        // Verifying that the method does what is expected
        assert.equal(Tasks.findOne(taskId).checked, true);
      });

      it('anyone can check public task', () => {
        // Finding the internal implementation of the task method to test it in isolation
        const checkTask = Meteor.server.method_handlers['tasks.setChecked'];
        const setTo = true;
        // Fake method invocation that looks like what the method expects
        const invocation = Random.id();
        // Running the method with `this` set to the fake invocation
        checkTask.apply(invocation, [taskId, setTo]);
        // Verifying that the method does what is expected
        assert.equal(Tasks.findOne(taskId).checked, true);
      });

    });
  });
}
