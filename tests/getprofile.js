var expect = require('chai').expect;
var app = require('../app');
var request = require('supertest');
const mongoose = require('mongoose');
const User = mongoose.model('users');

const userCredentials = {
    email: 'harshit.kohli1997@gmail.com', 
    password: 'scooby1234'
  }
  //now let's login the user before we run any tests
  var authenticatedUser = request.agent(app);
  beforeEach(function(done){
    authenticatedUser
      .post('/users/login')
      .send(userCredentials)
      .end(function(err, response){
        expect(response.statusCode).to.equal(302);
        expect('Location', '/ideas');
        done();
      });
  });
  const newuser = {
    email:'test@gmail.com',
    name:'testing',
    password:'123456',
    password2:'123456'
    }

  describe('TEST REgisteration', function(done){
  
  
    it('should return a 302 response if the user is get registered', function(done){
      request(app)
      .post('/users/register')
      .send(newuser)
      .end(function(err, response){
        expect(response.statusCode).to.equal(302);
        done()
    });
  });
 
  });
  afterEach(function() {
    User.remove({email:'test@gmail.com'});
    
})

  describe('Test auth', function(done){
    //addresses 1st bullet point: if the user is logged in we should get a 200 status code
      it('should return a 200 response if the user is logged in', function(done){
        authenticatedUser.get('/ideas')
        .expect(200, done);
      });
    //addresses 2nd bullet point: if the user is not logged in we should get a 302 response code and be directed to the /login page
      it('should return a 302 response and redirect to /login', function(done){
        request(app).get('/ideas')
        .expect('Location', '/users/login')
        .expect(302, done);
      });
    });
    const idea = {
      title:'new title ',
      details:'updated details'
    }
    describe('test for update', function(done){
      //addresses 1st bullet point: if the user is logged in we should get a 200 status code
        it('should return a 200 response if the idea is updated', function(done){
          authenticatedUser
          .put('/ideas/edit/5cab2be379335e369015729c')
          .send(idea)
          .expect(302, done);
          
          });
        });
     
