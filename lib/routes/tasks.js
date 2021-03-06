const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Task = require('../models/task');
const Context = require('../models/context');
const Project = require('../models/project');

router
  .get('/', (req, res, next) => {
    let query = { userId: req.user.id };
    Object.assign(query, req.query);
    Task.find(query).lean()
      .then(tasks => res.send(tasks))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Task.findOne({ userId: req.user.id, _id: req.params.id })
      .lean()
      .then((task) => res.send(task))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Task.findOneAndRemove({ userId: req.user.id, _id: req.params.id })
      .then(deleted => res.send(deleted))
      .catch(next);
  })
  .post('/', bodyParser, (req, res, next) => {
    const userId = req.user.id;
    let task = new Task(req.body);
    task.userId = userId;
    // Promise.all here with Context and Project
    Promise.all([
      Context.findOne({name: req.body.contextId, userId}),
      Project.findOne({description: req.body.projectId, userId})
    ])
      .then(([context, project]) => {
        if(context) task.contextId = context._id;
        if(project) task.projectId = project._id;
        return task.save();
      })
      .then(task => res.send(task))
      .catch(next);
  })
  .put('/:id', bodyParser, (req, res, next) => {
    Task.findOneAndUpdate({ userId: req.user.id, _id: req.params.id }, req.body)
      .then(saved => res.send(saved))
      .catch(next);
  });

module.exports = router;