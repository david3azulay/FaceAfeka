const { connect } = require('mongoose');

// ON CMD NOT BASH ==> "C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe" --dbpath="/Users/shaym/mongodb-data"
const connectionUrl = 'mongodb+srv://admin:1234@faceafeka.h0rbq.mongodb.net';
const databaseName = 'FaceAfeka';

const mongooseDataBaseConnectionUrl = `${connectionUrl}/${databaseName}`;

connect(mongooseDataBaseConnectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
