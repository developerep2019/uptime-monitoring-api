// dependencies
const data = require('../../lib/data');
const {
  hash,
  parseJSON,
  createRandomString,
} = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMehods = ['get', 'post', 'put', 'delete'];
  if (acceptedMehods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    data.read('users', phone, (err, userData) => {
      const user = { ...parseJSON(userData) };
      let hashedPassword = hash(password);
      if (hashedPassword === user.password) {
        let tokenId = createRandomString(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObj = {
          phone,
          id: tokenId,
          expires,
        };

        //store the token
        data.create('tokens', tokenId, tokenObj, (err) => {
          if (!err) {
            callback(200, tokenObj);
          } else {
            callback(500, {
              error: 'There was a problem in the server side',
            });
          }
        });
      } else {
        callback(400, {
          error: 'Password is not valid!',
        });
      }
    });
  } else {
    callback(400, {
      error: 'You have a problem in your request',
    });
  }
};

handler._token.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === 'string' &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    data.read('tokens', id, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(400, { error: 'Requested token was not found!' });
      }
    });
  } else {
    callback(404, { error: 'Requested token was not found!' });
  }
};

handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === 'string' &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  const extend =
    typeof requestProperties.body.extend === 'boolean' &&
    requestProperties.body.extend
      ? true
      : false;

  if (id && extend) {
    data.read('tokens', id, (err, tokenData) => {
      const tokenObject = parseJSON(tokenData);
      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() + 60 * 60 * 1000;

        //store the updated token
        data.update('tokens', id, tokenObject, (err) => {
          if (!err) {
            callback(200, {
              message:
                'time update successfull! your token will be available to next 1 hour',
            });
          } else {
            callback(500, {
              error: 'There was a server side error!',
            });
          }
        });
      } else {
        callback(400, {
          error: 'Token already expired!',
        });
      }
    });
  } else {
    callback(400, {
      error: 'There was a problem in your request',
    });
  }
};

handler._token.delete = (requestProperties, callback) => {
  // check the token if valid
  const id =
    typeof requestProperties.queryStringObject.id === 'string' &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    //lookup the id
    data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete('tokens', id, (err) => {
          if (!err) {
            callback(200, {
              message: 'Token was successfully deleted!',
            });
          } else {
            callback(500, {
              error: 'There was a server side error!',
            });
          }
        });
      } else {
        callback(500, { error: 'There was a server side error!' });
      }
    });
  } else {
    callback(400, {
      error: 'There was a problem in your request',
    });
  }
};

handler._token.verify = (id, phone, callback) => {
  data.read('tokens', id, (err, tokenData) => {
    if (!err && tokenData) {
      const token = parseJSON(tokenData);
      if (token.phone === phone && token.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};
module.exports = handler;
