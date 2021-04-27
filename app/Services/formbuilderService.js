let async = require('async');
util = require('../../config/util.js'),
fromBuilderDao = require('../DAOFiles/fromBuilderDAO');

// API to get users by user id
let getPostForm = (data, callback) => {
  async.auto ({
    fromBuilder: (cb) => {
      // tslint:disable-next-line: no-shadowed-variable
      fromBuilderDao.getFormData({}, (err, data) =>
      {
        if (err)
        {
          console.log(data, 'data testing..');
          cb(null, { errorCode: 501, statusmessage: 'error found'});
          return;
        }
        cb(null, data);
        return;
      });
       }
    },  (err, Response) => {
      callback(Response.fromBuilder);
  });
};

    /** API for get form data  */
getPostForm = (data, callback) => {
      async.auto({
        fromBuilder: (cb) => {
              const dataToSet = {
                  name: data.name ? data.name : '',
                  email: data.email,
              };
              fromBuilderDao.postFormData(dataToSet, (err, dbData) => {
                  if (err) {
                      cb(null, { statusCode: util.statusCode.FOUR_ZERO_ONE, statusMessage: util.statusMessage.SERVER_BUSY });
                      return;
                  }
                  cb(null, { statusCode: util.statusCode.OK, statusMessage: util.statusMessage.DATA_UPDATED, result: dataToSet });
              });
          }
      }, (err, response) => {
          callback(response.fromBuilder);
      });
   };