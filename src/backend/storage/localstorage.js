var when = require('when');
var nodeFn = require('when/node/function');
var keys = require('when/keys');


var localforage = require('localforage');


var settings;
var flowsFile;
var flowsFullPath;
var flowsFileBackup;
var credentialsFile;
var credentialsFileBackup;
var oldCredentialsFile;
var sessionsFile;
var libDir;
var libFlowsDir;
var globalSettingsFile;

function getFileMeta(root,path) {
  console.log('getFileMeta', root, path);

  var meta = {};

  return meta;
}

function getFileBody(root,path) {
  console.log('getFileBody', root, path);
  var body = "";
  return body;
}

/**
 * Write content to a file using UTF8 encoding.
 * This forces a fsync before completing to ensure
 * the write hits disk.
 */
function writeFile(path,content) {

  console.log('writeFile', path, content);
  return localforage.setItem(path, content);
}

var localfilesystem = {
  init: function(_settings) {
    settings = _settings;

    settings.userDir = 'PAGENODES';
    flowsFile = 'flows.json';
    flowsFullPath = settings.userDir + '_' + flowsFile;

    credentialsFile = settings.userDir + '_cred';
    credentialsFileBackup = settings.userDir + '_cred.backup';

    oldCredentialsFile = settings.userDir + '_credentials.json';

    flowsFileBackup = flowsFullPath + ".backup";

    sessionsFile = settings.userDir + '_sessions.json';

    libDir = settings.userDir + '_lib';
    libFlowsDir = libDir + "_flows";

    globalSettingsFile = settings.userDir + '_config.json';

    return when.resolve('ok');
  },

  getFlows: function() {
    return localforage.getItem(flowsFullPath).then(val =>{
      return val || [];
    });
  },

  saveFlows: function(flows) {

    var flowData;
    return writeFile(flowsFullPath, flows);
  },

  getCredentials: function() {
    return when.resolve('ok');
  },

  saveCredentials: function(credentials) {
    return writeFile(credentialsFile, credentials);
  },

  getSettings: function() {
    console.log('getSettings');
    return localforage.getItem(globalSettingsFile).then(val =>{
      return val || {};
    });

  },
  saveSettings: function(settings) {
    console.log('saveSettings', settings);
    return writeFile(globalSettingsFile,settings);
  },
  getSessions: function() {
    console.log('getSessions');
    return localforage.getItem(globalSettingsFile).then(val =>{
      return val || {};
    });

  },
  saveSessions: function(sessions) {
    return writeFile(sessionsFile,JSON.stringify(sessions));
  },

  getLibraryEntry: function(type,path) {
    var name = 'PN_LIB_' + type + '_' + path;
    return localforage.getItem(name).then(val =>{
      return val || [];
    });
  },

  saveLibraryEntry: function(type,path,meta,body) {
    var fn = [libDir , type, path].join('_');
    var headers = "";
    for (var i in meta) {
      if (meta.hasOwnProperty(i)) {
        headers += "// "+i+": "+meta[i]+"\n";
      }
    }

    writeFile(fn,headers+body);

    return when.resolve('ok');
  }
};

module.exports = localfilesystem;

