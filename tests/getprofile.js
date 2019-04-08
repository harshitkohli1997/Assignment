var expect = require('chai').expect;
var app = require('../app');
var request = require('supertest');
const mongoose = require('mongoose');
const User = mongoose.model('users');

//dummy user for login
const userCredentials = {
    email: 'abc@gmail.com', 
    password: '12345'
  }



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
      it('should return a 200 response if the user is logged in', function(done){
        authenticatedUser.get('/ideas')
        .expect(200, done);
      });
    
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
      
        it('should return a 200 response if the idea is updated', function(done){
          authenticatedUser
          .put('/ideas/edit/5cab161de9f32b2be0536a70')
          .send(idea)
          .expect(302, done);
          
          });
        });
     
