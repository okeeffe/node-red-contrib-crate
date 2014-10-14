# Crate Client for Node-RED

[![NPM](https://nodei.co/npm/node-red-contrib-crate.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-red-contrib-crate/)

An independently-made [Node-RED](http://nodered.org) wrapper for the [Crate](http://crate.io) elastic data store, installed locally or anywhere else that can be referenced by a URL. There are both input and output nodes included for interacting with the Crate HTTP endpoint API.

Please note: Crate is a trademark of Crate Technology Gmbh, registered in the E.U. and in other countries.

## What's all this about?

Calm down, you're safe here. I'll explain everything.

#### Node-RED

From Node-RED's own [web page](http://nodered.org):

> Node-RED is a tool for wiring together hardware devices, APIs and online services in new and interesting ways.

#### Crate

From Crate's own [web page](http://crate.io):

> Crate is a new breed of database to serve today’s mammoth data needs. Based on the familiar SQL syntax, Crate combines high availability, resiliency, and scalability in a distributed design that allows you to query mountains of data in realtime, not batches.

> We solve your data scaling problems and make administration a breeze. Easy to scale, simple to use.

## Installation

Run this command in the root directory of your Node-RED installation:

```
npm install node-red-contrib-crate
```

Note that this will also install the nodes' sole dependency - [node-crate](https://github.com/megastef/node-crate), on which this Node-RED package is built. All credit to [megastef](https://github.com/megastef) - you the man.

## Usage

Once installed (and after restarting Node-RED and refreshing its page in your browser), you'll see some nodes labelled "crate" in your node locker under the 'storage' section.

The node with both an input and an output is (confusingly) our input node. This node allows you to get information from your crate database.

The node with only an input is our output node. This allows you to send information to your crate database and save it there.

When you drag either node to your workspace, you'll need to open its options and either add a crate database (if you haven't already), or select one. Adding a database is as simple as pasting in the database's _sql HTTP endpoint URL.

For the output node you can specify a table to send the information to in the node's options.

Both nodes take their information from a <code>msg</code> object passed to them. **Below are the specs for each node's msg inputs**. Note that these are also visible if you select a node in Node-RED and view the info tab on the right of the screen.

#### Ouput node msg object

- <code>msg.table</code> <em>(semi-optional)</em>: Specify which table to insert the data into (this will override the option entered in the node config window if set, allowing you to use one output node to send to multiple tables). Note that table must be set either in the node options or in this property.
- <code>msg.data</code> <em>(required)</em>: The JS data object you want to insert in the table, in the form <code>{ columnName1: 'value1', columnName2: 'value2' }</code>.
- <code>msg.where</code> <em>(optional)</em>: Makes the insert an update action instead, where your string condition is met, e.g. <code>'columnName3=5'</code>.

#### Input node msg object

- <code>msg.query</code> <em>(required)</em>: An sql-style string query, for example:
```
"select * from tweets where text like ?"
```
- <code>msg.args</code> <em>(required)</em>: Arguments for your query, in an array, e.g. <code>['%crate%']</code>.

## Features

Currently, the output node provides support for:

* Inserts
* Updates
* One output node can provide access to multiple tables within a Crate database through use of the <code>msg.table</code> property passed to it that can override options set on the node.

The input node provides support for:

* Querying

For more on these features and how they work in Crate, check out their [docs](https://crate.io/docs).

## Roadmap

* BLOBs
* Bulk actions
