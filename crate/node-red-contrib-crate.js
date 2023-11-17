module.exports = function(RED) {
  'use strict';
  var db = require('node-crate');

  function CrateNode(config) {
    RED.nodes.createNode(this, config);
    this.url = config.url;
    this.name = config.name;
  }
  RED.nodes.registerType("crate", CrateNode);

let isConnected = false;
let currentConnectionUrl = "";  


function connectToCrate(node) {
    if (isConnected && node.crateConfig.url === currentConnectionUrl) {
    node.status({ fill: "green", shape: "dot", text: "already connected" });
    return;
  }
  db.connect(node.crateConfig.url, function(err) {
    if (err) {
      node.status({ fill: "red", shape: "ring", text: "disconnected" });
      node.error('Connection to CrateDB failed: ' + err.message);
      isConnected = false;
    } else {
      node.status({ fill: "green", shape: "dot", text: "connected" });
      isConnected = true;
      currentConnectionUrl = node.crateConfig.url;
    }
  });
}
  
  function CrateOutNode(config) {
    RED.nodes.createNode(this, config);
    this.table = config.table;
    this.name = config.name;
    this.crateConfig = RED.nodes.getNode(config.database);

    if(this.crateConfig) {
      var node = this;
      //use the token to connect to the correct database
      connectToCrate(node); // CATCH ERROR IF NO CONN AVAIL
      node.on('input', function(msg) {
        // if a table was specified
        if(msg.table || node.table) {
          var table = msg.table || node.table;

          // a straight insert
          if(msg.data && !msg.where) {
            db.insert(table, msg.data).then( (res) => {
              node.status( { fill: "green", shape: "dot", text: "insert success"} );
            }).catch( (err) => {
              node.status( { fill: "red", shape: "dot", text: "insert failure" } );
              node.error(err.message);
            });
          }
          // an update
          else if(msg.data && msg.where) {
            db.update(table, msg.data, msg.where).then( (res) => {
              node.status( { fill: "green", shape: "dot", text: "insert success"} );
            }).catch( (err) => {
              node.status( { fill: "red", shape: "dot", text: "insert failure" } );
              node.error(message);
            });
          }
          else {
            node.status({fill:"red",shape:"dot",text:"failure"});
            node.error('No data property in msg object to insert.');
          }
        }
        // no table referenced
        else {
          node.status({fill:"red",shape:"dot",text:"failure"});
          node.error('No table specified in node options or incoming msg object.');
        }
      });
    }
  }
  RED.nodes.registerType("crate out", CrateOutNode);

  function CrateInNode(config) {
    RED.nodes.createNode(this, config);
    this.crateConfig = RED.nodes.getNode(config.database);
    this.name = config.name;

    if(this.crateConfig) {
      var node = this;
      //use the token to connect to the correct database
       connectToCrate(node);

      node.on('input', function(msg) {
        // if a query was specified
        if(msg.query || node.query) {
          var query = msg.query || node.query;

          if(msg.args) {
            db.execute(query, msg.args)
            .then( (res) => {
              node.status({fill:"green",shape:"dot",text:"Read success"});
              msg.payload = res;
              node.send(msg);
            }).catch( (err) => {
              node.status( { fill: "red", shape: "dot", text: "Read failure" } );
              node.error(err.message);
            });
          }
          // no args
          else {
            node.status({fill:"red",shape:"dot",text:"Read failure"});
            node.error('No arguments for the query specified in incoming msg object.');
          }
        }
        // no query referenced
        else {
          node.status({fill:"red",shape:"dot",text:"Read failure"});
          node.error('No query specified in incoming msg object.');
        }
      });
    }
  }
  RED.nodes.registerType("crate in", CrateInNode);
};
