'use strict';

const CustomErrors = {};

CustomErrors.HTTP = {
  get404: function() {
    const err = new Error('Not Found!');
    err.code = 'NOT_FOUND';
    err.status = 404;
    return err;
  }
};

module.exports = CustomErrors;
