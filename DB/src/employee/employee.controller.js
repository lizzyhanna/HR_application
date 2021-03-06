

var express = require('express');
var model = require('./employee.model');
var logger = require('../helpers/logger');
var conn = require('../helpers/connections')

var router = express.Router();

function notLoggedIn(req, res) {
  if (!req.session.active) {
    res.json({message: 'not logged in'});
    return true;
  }
  return false;
}

// Returns a list of all employees
router.get('/employees', async (req, res) => {
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.getEmployees(connection);

  res.json(response);
});
  
router.get('/employees/:empId', async (req, res) => {
  if (notLoggedIn(req, res)) return;

  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  var is_HRM = req.session.hrm;
  logger.info(is_HRM);
  let userId = req.session.auth;

  let response = await model.getEmployee(connection, req.params.empId, is_HRM, userId);
  res.json(response);
});
  
//Returns contact info of a given employee- does not need perms to get this
//we will need to return what type of user is accessing this so we can hide info if necessary (user story 1.4)
router.get('/employees/:empId/profile', async (req, res) => {
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.getContactInfo(connection, req.params.empId);
  res.json(response);
});
  
//Allows updating contact info of a given employee- must be logged in to do this
router.put('/employees/:empId/profile', async (req, res) => {
  if (notLoggedIn(req, res)) return;
  
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.updateContactInfo(connection, req.params.empId, req.body);
  res.json(response);
});

//Adds an employee to the database- must be logged in to do so
router.post('/employees', async (req, res) => {
  if (notLoggedIn(req, res)) return;

  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.addEmployee(connection, req.body);

  res.json(response);
});

// Remove employee from database
router.delete('/employees/:empId', async (req, res) => {
  if (notLoggedIn(req, res)) return;
  
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.removeEmployee(connection, req.params.empId);
  res.json(response);
});

// Updates the manager of an employee
router.put('/employees/:empId/profile/manager', async (req, res) => {
  if (notLoggedIn(req, res)) return;
  
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.setManager(connection, req.params.empId, req.body.managerId);
  res.json(response);
});

// Gets the list of all reports an employee has been involved in
router.get('/employees/:empId/profile/report-history', async (req, res) => {
  if (notLoggedIn(req, res)) return;
  
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;
  
  let response = await model.reportHistory(connection, req.params.empId);
  res.json(response);
});

//Adds strikes to employee
router.post('/employees/:empId', async (req, res) => {
  //if (notLoggedIn(req, res)) return; //Not sure if this will actually be necessary for a post request.

  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.addStrike(connection, req.params.empId);
  res.json(response);
});

//Create a new report for an employee, by a manager
router.post('/employees/:empId/profile/create-report', async (req, res) => {
  if (notLoggedIn(req, res)) return;
  let by_Employee = req.params.empId;

  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.createReport(connection, req.body, by_Employee);
  res.json(response);
});

router.get('/results', async (req, res) => {
  if (notLoggedIn(req, res)) return;
  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.searchEmployees(connection, req.query.search_query);
  
  res.json(response);
});

// Gets the employment history of an employee
router.get('/employees/:empId/profile/employment-history', async (req, res) => {
  if (notLoggedIn(req, res)) return;

  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.getEmploymentHistory(connection, req.params.empId);
  res.json(response);
});

// Sets an employee's position to be something else and adds a new record in
// employment_history
router.put('/employees/:empId/profile/change-position', async (req, res) => {
  if (notLoggedIn(req, res)) return;

  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  let response = await model.changePosition(connection, req.params.empId, req.body.position);
  res.json(response);
});

router.post('/employees/:empId/profile/make-confidential', async (req, res) => {
  //if (notLoggedIn(req, res)) return;

  let {connection, message} = await conn.getConnection(res);
  if (message == 'fail') return;

  var userID = req.session.auth;
  logger.info(userID);

  let response = await model.makeConfidential(connection, userID, req.params.empId);
  res.json(response);
});

module.exports = router;
