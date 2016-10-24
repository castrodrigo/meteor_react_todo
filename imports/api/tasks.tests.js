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
      
    });
  });
}
