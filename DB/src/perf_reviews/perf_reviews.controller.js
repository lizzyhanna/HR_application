var express = require('express');
var model = require('./perf_reviews.model');
var conn = require('../helpers/connections');
var logger = require('../helpers/logger');

var router = express.Router();

function notLoggedIn(req, res) {
    if (!req.session.active) {
      res.json({message: 'not logged in'});
      return true;
    }
    return false;
  }

//Must be logged in to add a new performance review to an employee
router.post('/employees/:empId/profile/performance_reviews', async (req, res) => {

//    if (notLoggedIn(req, res)) return;

    let {connection, message} = await conn.getConnection(res);
    if (message == 'fail') return;

    let response = await model.postNewPerfRev(connection, req.params.empId, req.body, req.header('id'));
    connection.release();
    if (response.message != 'succeed')
      res.status(400);
    res.json(response);

});

//now gets only the employee that is currently logged in if it matches the one that is requested 
//could also be amended if (or is manager) once we have that
router.get('/employees/:empId/profile/performance_reviews', async (req, res) => {

//  if (notLoggedIn(req,res)) return;
  logger.info('ID: ' + req.header('id'));
  if (req.header('id') != req.params.empId) {
    res.status(400).json({message: 'must have same id as requested reviews'});
    return;
  }

  console.log(req.session.auth)
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let perf_rev = await model.seeAllPerfRevs(connection, req.params.empId, req.session.auth);
  connection.release();
  res.json(perf_rev);
});

//View an employee's overall rating based on performance reviews
router.get('/employees/:empId/profile/rating', async (req, res) => {
//  if (notLoggedIn(req,res)) return;
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let perf_score = await model.getPerfScore(connection, req.params.empId);
  connection.release();
  res.json(perf_score);
});

//Delete a performance review
router.delete('/employees/:empId/profile/performance_reviews/:perf_id', async (req, res) => {
//  if (notLoggedIn(req,res)) return;
  
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.deletePerfRev(connection, req.params.empId, req.params.perf_id);
  connection.release();
  res.json(response);
})

//allows a manager to see all performance reviews for any employee under him/her
router.get('/employees/manager/perf_reviews', async (req,res) => {
//  if (notLoggedIn(req,res)) return;

  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let manager_perf_rev = await model.seeAllPerfRevsManager(connection, req.header('id'));
  connection.release();
  res.json(manager_perf_rev);
});

router.get('/perf_reviews', async (req, res) => {
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let data = await model.checkAllPerfReviews(connection);
  connection.release();
  res.json(data);
});


module.exports = router;