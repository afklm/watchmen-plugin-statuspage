'use strict';

var request = require('request');

var pageid = process.env.WATCHMEN_STATUSPAGE_PAGE_ID;
var apikey = process.env.WATCHMEN_STATUSPAGE_API_KEY;
var baseUrl = 'https://api.statuspage.io/v1/pages/' + pageid + '/components'
var authHeader = 'OAuth ' + apikey;

var findComponentId = function (name, callback) {
  var identifyService = function (service) {
    return service.name == name;
  }
  request.get({
                url: baseUrl,
                headers: {
                  Authorization: authHeader
                }
              }, function (err, httpResponse, body) {
    if (err != null) {
      callback(null, err);
    } else {
      try {
        callback(JSON.parse(body).find(identifyService), null);
      } catch (ex) {
        console.log(ex);
        callback(null, 'Unable to parse statuspage.io result.');
      }
    }
  });
}

var updateStatus = function (name, status) {
  var _baseUrl = baseUrl;
  var _authHeader = authHeader;
  findComponentId(name, function (component, err) {
    if (err != null) {
      console.log('Unable to update component ', name, ' in statuspage.io (', err, ').');
    } else {
      var componentId = component.id;
      request.patch({
                      url: _baseUrl + '/' + componentId + '.json',
                      headers: {
                        Authorization: _authHeader
                      },
                      form: {
                        'component[status]': status
                      }
                    }, function (err, httpResponse, body) {
        if (err != null) {
          console.log('Unable to update status ', status, ' in statuspage.io for component ', componentId,
                      ' (', err, ').')
        } else {
          console.log('Component ', componentId, ' has been updated in statuspage.io to status ', status);
        }
      });
    }
  });
}

var onServiceError = function (service, outage) {
  updateStatus(service.name, 'major_outage');
}

var onServiceBack = function (service, lastOutage) {
  updateStatus(service.name, 'operational');
}


function StatuspagePlugin(watchmen) {
  watchmen.on('new-outage', onServiceError);
  watchmen.on('service-back', onServiceBack);
}

module.exports = StatuspagePlugin;
