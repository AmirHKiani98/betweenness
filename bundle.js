(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function toList(float32Array) {
    let i = 0;
    var object = [];
    var from = {};
    var to = {};
    for (let i = 0; i < float32Array.length; i++) {
        let value = float32Array[i];
        switch (i % 4) {
            case 0:
                from.x = value;
                break;
            case 1:
                from.y = value;

                break;
            case 2:
                to.x = value;
                break;
            case 3:
                to.y = value;
                object.push({ from, to })
                from = {};
                to = {};
                break;
            default:
                break;
        }
    }
    return object;
}
},{}],2:[function(require,module,exports){
// Importing packages
// import { toList } from "./assets/kian-packages/Float32ToObject.js";
const toList = require('./assets/kian-packages/Float32ToObject.js');
console.log(toList([1, 2, 3, 4]));

function getAllFuncs(toCheck) {
    const props = [];
    let obj = toCheck;
    do {
        props.push(...Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props.sort().filter((e, i, arr) => {
        if (e != arr[i + 1] && typeof toCheck[e] == 'function') return true;
    });
}
// Requirements for graph
let createGraph = require('ngraph.graph');
let wgl = require('w-gl');
let graph = createGraph();
let path = require('ngraph.path');

graph.addNode("a", { x: 0, y: 0 });
graph.addNode("b", { x: 2, y: 3 });
graph.addNode("c", { x: 10, y: 5 });
graph.addNode("d", { x: -10, y: 4 });
graph.addNode("e", { x: 2, y: 4 });
graph.addNode("f", { x: 13, y: 11 });
graph.addNode("g", { x: -5, y: 15 });
graph.addNode("h", { x: 6, y: 15 });

graph.addLink('a', 'b');
graph.addLink('b', 'c', {});
graph.addLink('b', 'e', {});
graph.addLink('e', 'd', {});
graph.addLink('e', 'f', {});
graph.addLink('e', 'g', {});
graph.addLink('e', 'h', {});
graph.addLink('g', 'h', {});
let shortestPath = path.aStar(graph, {
    distance(fromNode, toNode, link) {
        return 1;
    }
});

let canvas = document.getElementById("betweenness-id");
scene = wgl.scene(canvas);
scene.setClearColor(16 / 255, 16 / 255, 16 / 255, 1);
scene.setClearColor(1, 1, 1, 1)

let initialSceneSize = 10;
scene.setViewBox({
    left: -initialSceneSize,
    top: -initialSceneSize,
    right: initialSceneSize,
    bottom: initialSceneSize,
})
scene.setPixelRatio(2);
var lines = new wgl.WireCollection(graph.getLinksCount());
graph.forEachLink(function(link) {
    let from = graph.getNode(link.fromId).data;
    let to = graph.getNode(link.toId).data;
    lines.add({ from, to });
});
// Find best betweenness
var allnodes = [];
graph.forEachNode(function(node) {
    allnodes.push(node.id);
})
console.log(shortestPath);

lines.color = { r: 0 / 255, g: 0 / 255, b: 0 / 255, a: 1 }
scene.appendChild(lines);
},{"./assets/kian-packages/Float32ToObject.js":1,"ngraph.graph":4,"ngraph.path":13,"w-gl":14}],3:[function(require,module,exports){
module.exports = function eventify(subject) {
  validateSubject(subject);

  var eventsStorage = createEventsStorage(subject);
  subject.on = eventsStorage.on;
  subject.off = eventsStorage.off;
  subject.fire = eventsStorage.fire;
  return subject;
};

function createEventsStorage(subject) {
  // Store all event listeners to this hash. Key is event name, value is array
  // of callback records.
  //
  // A callback record consists of callback function and its optional context:
  // { 'eventName' => [{callback: function, ctx: object}] }
  var registeredEvents = Object.create(null);

  return {
    on: function (eventName, callback, ctx) {
      if (typeof callback !== 'function') {
        throw new Error('callback is expected to be a function');
      }
      var handlers = registeredEvents[eventName];
      if (!handlers) {
        handlers = registeredEvents[eventName] = [];
      }
      handlers.push({callback: callback, ctx: ctx});

      return subject;
    },

    off: function (eventName, callback) {
      var wantToRemoveAll = (typeof eventName === 'undefined');
      if (wantToRemoveAll) {
        // Killing old events storage should be enough in this case:
        registeredEvents = Object.create(null);
        return subject;
      }

      if (registeredEvents[eventName]) {
        var deleteAllCallbacksForEvent = (typeof callback !== 'function');
        if (deleteAllCallbacksForEvent) {
          delete registeredEvents[eventName];
        } else {
          var callbacks = registeredEvents[eventName];
          for (var i = 0; i < callbacks.length; ++i) {
            if (callbacks[i].callback === callback) {
              callbacks.splice(i, 1);
            }
          }
        }
      }

      return subject;
    },

    fire: function (eventName) {
      var callbacks = registeredEvents[eventName];
      if (!callbacks) {
        return subject;
      }

      var fireArguments;
      if (arguments.length > 1) {
        fireArguments = Array.prototype.splice.call(arguments, 1);
      }
      for(var i = 0; i < callbacks.length; ++i) {
        var callbackInfo = callbacks[i];
        callbackInfo.callback.apply(callbackInfo.ctx, fireArguments);
      }

      return subject;
    }
  };
}

function validateSubject(subject) {
  if (!subject) {
    throw new Error('Eventify cannot use falsy object as events subject');
  }
  var reservedWords = ['on', 'fire', 'off'];
  for (var i = 0; i < reservedWords.length; ++i) {
    if (subject.hasOwnProperty(reservedWords[i])) {
      throw new Error("Subject cannot be eventified, since it already has property '" + reservedWords[i] + "'");
    }
  }
}

},{}],4:[function(require,module,exports){
/**
 * @fileOverview Contains definition of the core graph object.
 */

// TODO: need to change storage layer:
// 1. Be able to get all nodes O(1)
// 2. Be able to get number of links O(1)

/**
 * @example
 *  var graph = require('ngraph.graph')();
 *  graph.addNode(1);     // graph has one node.
 *  graph.addLink(2, 3);  // now graph contains three nodes and one link.
 *
 */
module.exports = createGraph;

var eventify = require('ngraph.events');

/**
 * Creates a new graph
 */
function createGraph(options) {
  // Graph structure is maintained as dictionary of nodes
  // and array of links. Each node has 'links' property which
  // hold all links related to that node. And general links
  // array is used to speed up all links enumeration. This is inefficient
  // in terms of memory, but simplifies coding.
  options = options || {};
  if ('uniqueLinkId' in options) {
    console.warn(
      'ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\n' +
      'Use `multigraph` option instead\n',
      '\n',
      'Note: there is also change in default behavior: From now on each graph\n'+
      'is considered to be not a multigraph by default (each edge is unique).'
    );

    options.multigraph = options.uniqueLinkId;
  }

  // Dear reader, the non-multigraphs do not guarantee that there is only
  // one link for a given pair of node. When this option is set to false
  // we can save some memory and CPU (18% faster for non-multigraph);
  if (options.multigraph === undefined) options.multigraph = false;

  if (typeof Map !== 'function') {
    // TODO: Should we polyfill it ourselves? We don't use much operations there..
    throw new Error('ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph');
  } 

  var nodes = new Map();
  var links = [],
    // Hash of multi-edges. Used to track ids of edges between same nodes
    multiEdges = {},
    suspendEvents = 0,

    createLink = options.multigraph ? createUniqueLink : createSingleLink,

    // Our graph API provides means to listen to graph changes. Users can subscribe
    // to be notified about changes in the graph by using `on` method. However
    // in some cases they don't use it. To avoid unnecessary memory consumption
    // we will not record graph changes until we have at least one subscriber.
    // Code below supports this optimization.
    //
    // Accumulates all changes made during graph updates.
    // Each change element contains:
    //  changeType - one of the strings: 'add', 'remove' or 'update';
    //  node - if change is related to node this property is set to changed graph's node;
    //  link - if change is related to link this property is set to changed graph's link;
    changes = [],
    recordLinkChange = noop,
    recordNodeChange = noop,
    enterModification = noop,
    exitModification = noop;

  // this is our public API:
  var graphPart = {
    /**
     * Adds node to the graph. If node with given id already exists in the graph
     * its data is extended with whatever comes in 'data' argument.
     *
     * @param nodeId the node's identifier. A string or number is preferred.
     * @param [data] additional data for the node being added. If node already
     *   exists its data object is augmented with the new one.
     *
     * @return {node} The newly added node or node with given id if it already exists.
     */
    addNode: addNode,

    /**
     * Adds a link to the graph. The function always create a new
     * link between two nodes. If one of the nodes does not exists
     * a new node is created.
     *
     * @param fromId link start node id;
     * @param toId link end node id;
     * @param [data] additional data to be set on the new link;
     *
     * @return {link} The newly created link
     */
    addLink: addLink,

    /**
     * Removes link from the graph. If link does not exist does nothing.
     *
     * @param link - object returned by addLink() or getLinks() methods.
     *
     * @returns true if link was removed; false otherwise.
     */
    removeLink: removeLink,

    /**
     * Removes node with given id from the graph. If node does not exist in the graph
     * does nothing.
     *
     * @param nodeId node's identifier passed to addNode() function.
     *
     * @returns true if node was removed; false otherwise.
     */
    removeNode: removeNode,

    /**
     * Gets node with given identifier. If node does not exist undefined value is returned.
     *
     * @param nodeId requested node identifier;
     *
     * @return {node} in with requested identifier or undefined if no such node exists.
     */
    getNode: getNode,

    /**
     * Gets number of nodes in this graph.
     *
     * @return number of nodes in the graph.
     */
    getNodeCount: getNodeCount,

    /**
     * Gets total number of links in the graph.
     */
    getLinkCount: getLinkCount,

    /**
     * Synonym for `getLinkCount()`
     */
    getLinksCount: getLinkCount,
    
    /**
     * Synonym for `getNodeCount()`
     */
    getNodesCount: getNodeCount,

    /**
     * Gets all links (inbound and outbound) from the node with given id.
     * If node with given id is not found null is returned.
     *
     * @param nodeId requested node identifier.
     *
     * @return Array of links from and to requested node if such node exists;
     *   otherwise null is returned.
     */
    getLinks: getLinks,

    /**
     * Invokes callback on each node of the graph.
     *
     * @param {Function(node)} callback Function to be invoked. The function
     *   is passed one argument: visited node.
     */
    forEachNode: forEachNode,

    /**
     * Invokes callback on every linked (adjacent) node to the given one.
     *
     * @param nodeId Identifier of the requested node.
     * @param {Function(node, link)} callback Function to be called on all linked nodes.
     *   The function is passed two parameters: adjacent node and link object itself.
     * @param oriented if true graph treated as oriented.
     */
    forEachLinkedNode: forEachLinkedNode,

    /**
     * Enumerates all links in the graph
     *
     * @param {Function(link)} callback Function to be called on all links in the graph.
     *   The function is passed one parameter: graph's link object.
     *
     * Link object contains at least the following fields:
     *  fromId - node id where link starts;
     *  toId - node id where link ends,
     *  data - additional data passed to graph.addLink() method.
     */
    forEachLink: forEachLink,

    /**
     * Suspend all notifications about graph changes until
     * endUpdate is called.
     */
    beginUpdate: enterModification,

    /**
     * Resumes all notifications about graph changes and fires
     * graph 'changed' event in case there are any pending changes.
     */
    endUpdate: exitModification,

    /**
     * Removes all nodes and links from the graph.
     */
    clear: clear,

    /**
     * Detects whether there is a link between two nodes.
     * Operation complexity is O(n) where n - number of links of a node.
     * NOTE: this function is synonim for getLink()
     *
     * @returns link if there is one. null otherwise.
     */
    hasLink: getLink,

    /**
     * Detects whether there is a node with given id
     * 
     * Operation complexity is O(1)
     * NOTE: this function is synonim for getNode()
     *
     * @returns node if there is one; Falsy value otherwise.
     */
    hasNode: getNode,

    /**
     * Gets an edge between two nodes.
     * Operation complexity is O(n) where n - number of links of a node.
     *
     * @param {string} fromId link start identifier
     * @param {string} toId link end identifier
     *
     * @returns link if there is one. null otherwise.
     */
    getLink: getLink
  };

  // this will add `on()` and `fire()` methods.
  eventify(graphPart);

  monitorSubscribers();

  return graphPart;

  function monitorSubscribers() {
    var realOn = graphPart.on;

    // replace real `on` with our temporary on, which will trigger change
    // modification monitoring:
    graphPart.on = on;

    function on() {
      // now it's time to start tracking stuff:
      graphPart.beginUpdate = enterModification = enterModificationReal;
      graphPart.endUpdate = exitModification = exitModificationReal;
      recordLinkChange = recordLinkChangeReal;
      recordNodeChange = recordNodeChangeReal;

      // this will replace current `on` method with real pub/sub from `eventify`.
      graphPart.on = realOn;
      // delegate to real `on` handler:
      return realOn.apply(graphPart, arguments);
    }
  }

  function recordLinkChangeReal(link, changeType) {
    changes.push({
      link: link,
      changeType: changeType
    });
  }

  function recordNodeChangeReal(node, changeType) {
    changes.push({
      node: node,
      changeType: changeType
    });
  }

  function addNode(nodeId, data) {
    if (nodeId === undefined) {
      throw new Error('Invalid node identifier');
    }

    enterModification();

    var node = getNode(nodeId);
    if (!node) {
      node = new Node(nodeId, data);
      recordNodeChange(node, 'add');
    } else {
      node.data = data;
      recordNodeChange(node, 'update');
    }

    nodes.set(nodeId, node);

    exitModification();
    return node;
  }

  function getNode(nodeId) {
    return nodes.get(nodeId);
  }

  function removeNode(nodeId) {
    var node = getNode(nodeId);
    if (!node) {
      return false;
    }

    enterModification();

    var prevLinks = node.links;
    if (prevLinks) {
      node.links = null;
      for(var i = 0; i < prevLinks.length; ++i) {
        removeLink(prevLinks[i]);
      }
    }

    nodes.delete(nodeId)

    recordNodeChange(node, 'remove');

    exitModification();

    return true;
  }


  function addLink(fromId, toId, data) {
    enterModification();

    var fromNode = getNode(fromId) || addNode(fromId);
    var toNode = getNode(toId) || addNode(toId);

    var link = createLink(fromId, toId, data);

    links.push(link);

    // TODO: this is not cool. On large graphs potentially would consume more memory.
    addLinkToNode(fromNode, link);
    if (fromId !== toId) {
      // make sure we are not duplicating links for self-loops
      addLinkToNode(toNode, link);
    }

    recordLinkChange(link, 'add');

    exitModification();

    return link;
  }

  function createSingleLink(fromId, toId, data) {
    var linkId = makeLinkId(fromId, toId);
    return new Link(fromId, toId, data, linkId);
  }

  function createUniqueLink(fromId, toId, data) {
    // TODO: Get rid of this method.
    var linkId = makeLinkId(fromId, toId);
    var isMultiEdge = multiEdges.hasOwnProperty(linkId);
    if (isMultiEdge || getLink(fromId, toId)) {
      if (!isMultiEdge) {
        multiEdges[linkId] = 0;
      }
      var suffix = '@' + (++multiEdges[linkId]);
      linkId = makeLinkId(fromId + suffix, toId + suffix);
    }

    return new Link(fromId, toId, data, linkId);
  }

  function getNodeCount() {
    return nodes.size;
  }

  function getLinkCount() {
    return links.length;
  }

  function getLinks(nodeId) {
    var node = getNode(nodeId);
    return node ? node.links : null;
  }

  function removeLink(link) {
    if (!link) {
      return false;
    }
    var idx = indexOfElementInArray(link, links);
    if (idx < 0) {
      return false;
    }

    enterModification();

    links.splice(idx, 1);

    var fromNode = getNode(link.fromId);
    var toNode = getNode(link.toId);

    if (fromNode) {
      idx = indexOfElementInArray(link, fromNode.links);
      if (idx >= 0) {
        fromNode.links.splice(idx, 1);
      }
    }

    if (toNode) {
      idx = indexOfElementInArray(link, toNode.links);
      if (idx >= 0) {
        toNode.links.splice(idx, 1);
      }
    }

    recordLinkChange(link, 'remove');

    exitModification();

    return true;
  }

  function getLink(fromNodeId, toNodeId) {
    // TODO: Use sorted links to speed this up
    var node = getNode(fromNodeId),
      i;
    if (!node || !node.links) {
      return null;
    }

    for (i = 0; i < node.links.length; ++i) {
      var link = node.links[i];
      if (link.fromId === fromNodeId && link.toId === toNodeId) {
        return link;
      }
    }

    return null; // no link.
  }

  function clear() {
    enterModification();
    forEachNode(function(node) {
      removeNode(node.id);
    });
    exitModification();
  }

  function forEachLink(callback) {
    var i, length;
    if (typeof callback === 'function') {
      for (i = 0, length = links.length; i < length; ++i) {
        callback(links[i]);
      }
    }
  }

  function forEachLinkedNode(nodeId, callback, oriented) {
    var node = getNode(nodeId);

    if (node && node.links && typeof callback === 'function') {
      if (oriented) {
        return forEachOrientedLink(node.links, nodeId, callback);
      } else {
        return forEachNonOrientedLink(node.links, nodeId, callback);
      }
    }
  }

  function forEachNonOrientedLink(links, nodeId, callback) {
    var quitFast;
    for (var i = 0; i < links.length; ++i) {
      var link = links[i];
      var linkedNodeId = link.fromId === nodeId ? link.toId : link.fromId;

      quitFast = callback(nodes.get(linkedNodeId), link);
      if (quitFast) {
        return true; // Client does not need more iterations. Break now.
      }
    }
  }

  function forEachOrientedLink(links, nodeId, callback) {
    var quitFast;
    for (var i = 0; i < links.length; ++i) {
      var link = links[i];
      if (link.fromId === nodeId) {
        quitFast = callback(nodes.get(link.toId), link)
        if (quitFast) {
          return true; // Client does not need more iterations. Break now.
        }
      }
    }
  }

  // we will not fire anything until users of this library explicitly call `on()`
  // method.
  function noop() {}

  // Enter, Exit modification allows bulk graph updates without firing events.
  function enterModificationReal() {
    suspendEvents += 1;
  }

  function exitModificationReal() {
    suspendEvents -= 1;
    if (suspendEvents === 0 && changes.length > 0) {
      graphPart.fire('changed', changes);
      changes.length = 0;
    }
  }

  function forEachNode(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Function is expected to iterate over graph nodes. You passed ' + callback);
    }

    var valuesIterator = nodes.values();
    var nextValue = valuesIterator.next();
    while (!nextValue.done) {
      if (callback(nextValue.value)) {
        return true; // client doesn't want to proceed. Return.
      }
      nextValue = valuesIterator.next();
    }
  }
}

// need this for old browsers. Should this be a separate module?
function indexOfElementInArray(element, array) {
  if (!array) return -1;

  if (array.indexOf) {
    return array.indexOf(element);
  }

  var len = array.length,
    i;

  for (i = 0; i < len; i += 1) {
    if (array[i] === element) {
      return i;
    }
  }

  return -1;
}

/**
 * Internal structure to represent node;
 */
function Node(id, data) {
  this.id = id;
  this.links = null;
  this.data = data;
}

function addLinkToNode(node, link) {
  if (node.links) {
    node.links.push(link);
  } else {
    node.links = [link];
  }
}

/**
 * Internal structure to represent links;
 */
function Link(fromId, toId, data, id) {
  this.fromId = fromId;
  this.toId = toId;
  this.data = data;
  this.id = id;
}

function makeLinkId(fromId, toId) {
  return fromId.toString() + '👉 ' + toId.toString();
}

},{"ngraph.events":3}],5:[function(require,module,exports){
/**
 * Based on https://github.com/mourner/tinyqueue
 * Copyright (c) 2017, Vladimir Agafonkin https://github.com/mourner/tinyqueue/blob/master/LICENSE
 * 
 * Adapted for PathFinding needs by @anvaka
 * Copyright (c) 2017, Andrei Kashcha
 */
module.exports = NodeHeap;

function NodeHeap(data, options) {
  if (!(this instanceof NodeHeap)) return new NodeHeap(data, options);

  if (!Array.isArray(data)) {
    // assume first argument is our config object;
    options = data;
    data = [];
  }

  options = options || {};

  this.data = data || [];
  this.length = this.data.length;
  this.compare = options.compare || defaultCompare;
  this.setNodeId = options.setNodeId || noop;

  if (this.length > 0) {
    for (var i = (this.length >> 1); i >= 0; i--) this._down(i);
  }

  if (options.setNodeId) {
    for (var i = 0; i < this.length; ++i) {
      this.setNodeId(this.data[i], i);
    }
  }
}

function noop() {}

function defaultCompare(a, b) {
  return a - b;
}

NodeHeap.prototype = {

  push: function (item) {
    this.data.push(item);
    this.setNodeId(item, this.length);
    this.length++;
    this._up(this.length - 1);
  },

  pop: function () {
    if (this.length === 0) return undefined;

    var top = this.data[0];
    this.length--;

    if (this.length > 0) {
      this.data[0] = this.data[this.length];
      this.setNodeId(this.data[0], 0);
      this._down(0);
    }
    this.data.pop();

    return top;
  },

  peek: function () {
    return this.data[0];
  },

  updateItem: function (pos) {
    this._down(pos);
    this._up(pos);
  },

  _up: function (pos) {
    var data = this.data;
    var compare = this.compare;
    var setNodeId = this.setNodeId;
    var item = data[pos];

    while (pos > 0) {
      var parent = (pos - 1) >> 1;
      var current = data[parent];
      if (compare(item, current) >= 0) break;
        data[pos] = current;

       setNodeId(current, pos);
       pos = parent;
    }

    data[pos] = item;
    setNodeId(item, pos);
  },

  _down: function (pos) {
    var data = this.data;
    var compare = this.compare;
    var halfLength = this.length >> 1;
    var item = data[pos];
    var setNodeId = this.setNodeId;

    while (pos < halfLength) {
      var left = (pos << 1) + 1;
      var right = left + 1;
      var best = data[left];

      if (right < this.length && compare(data[right], best) < 0) {
        left = right;
        best = data[right];
      }
      if (compare(best, item) >= 0) break;

      data[pos] = best;
      setNodeId(best, pos);
      pos = left;
    }

    data[pos] = item;
    setNodeId(item, pos);
  }
};
},{}],6:[function(require,module,exports){
/**
 * Performs suboptimal, greed A Star path finding.
 * This finder does not necessary finds the shortest path. The path
 * that it finds is very close to the shortest one. It is very fast though.
 */
module.exports = aStarBi;

var NodeHeap = require('./NodeHeap');
var makeSearchStatePool = require('./makeSearchStatePool');
var heuristics = require('./heuristics');
var defaultSettings = require('./defaultSettings');

var BY_FROM = 1;
var BY_TO = 2;
var NO_PATH = defaultSettings.NO_PATH;

module.exports.l2 = heuristics.l2;
module.exports.l1 = heuristics.l1;

/**
 * Creates a new instance of pathfinder. A pathfinder has just one method:
 * `find(fromId, toId)`, it may be extended in future.
 * 
 * NOTE: Algorithm implemented in this code DOES NOT find optimal path.
 * Yet the path that it finds is always near optimal, and it finds it very fast.
 * 
 * @param {ngraph.graph} graph instance. See https://github.com/anvaka/ngraph.graph
 * 
 * @param {Object} options that configures search
 * @param {Function(a, b)} options.heuristic - a function that returns estimated distance between
 * nodes `a` and `b`.  Defaults function returns 0, which makes this search equivalent to Dijkstra search.
 * @param {Function(a, b)} options.distance - a function that returns actual distance between two
 * nodes `a` and `b`. By default this is set to return graph-theoretical distance (always 1);
 * @param {Boolean} options.oriented - whether graph should be considered oriented or not.
 * 
 * @returns {Object} A pathfinder with single method `find()`.
 */
function aStarBi(graph, options) {
  options = options || {};
  // whether traversal should be considered over oriented graph.
  var oriented = options.oriented;

  var heuristic = options.heuristic;
  if (!heuristic) heuristic = defaultSettings.heuristic;

  var distance = options.distance;
  if (!distance) distance = defaultSettings.distance;
  var pool = makeSearchStatePool();

  return {
    find: find
  };

  function find(fromId, toId) {
    // Not sure if we should return NO_PATH or throw. Throw seem to be more
    // helpful to debug errors. So, throwing.
    var from = graph.getNode(fromId);
    if (!from) throw new Error('fromId is not defined in this graph: ' + fromId);
    var to = graph.getNode(toId);
    if (!to) throw new Error('toId is not defined in this graph: ' + toId);

    if (from === to) return [from]; // trivial case.

    pool.reset();

    var callVisitor = oriented ? orientedVisitor : nonOrientedVisitor;

    // Maps nodeId to NodeSearchState.
    var nodeState = new Map();

    var openSetFrom = new NodeHeap({
      compare: defaultSettings.compareFScore,
      setNodeId: defaultSettings.setHeapIndex
    });

    var openSetTo = new NodeHeap({
      compare: defaultSettings.compareFScore,
      setNodeId: defaultSettings.setHeapIndex
    });


    var startNode = pool.createNewState(from);
    nodeState.set(fromId, startNode);

    // For the first node, fScore is completely heuristic.
    startNode.fScore = heuristic(from, to);
    // The cost of going from start to start is zero.
    startNode.distanceToSource = 0;
    openSetFrom.push(startNode);
    startNode.open = BY_FROM;

    var endNode = pool.createNewState(to);
    endNode.fScore = heuristic(to, from);
    endNode.distanceToSource = 0;
    openSetTo.push(endNode);
    endNode.open = BY_TO;

    // Cost of the best solution found so far. Used for accurate termination
    var lMin = Number.POSITIVE_INFINITY;
    var minFrom;
    var minTo;

    var currentSet = openSetFrom;
    var currentOpener = BY_FROM;

    while (openSetFrom.length > 0 && openSetTo.length > 0) {
      if (openSetFrom.length < openSetTo.length) {
        // we pick a set with less elements
        currentOpener = BY_FROM;
        currentSet = openSetFrom;
      } else {
        currentOpener = BY_TO;
        currentSet = openSetTo;
      }

      var current = currentSet.pop();

      // no need to visit this node anymore
      current.closed = true;

      if (current.distanceToSource > lMin) continue;

      graph.forEachLinkedNode(current.node.id, callVisitor);

      if (minFrom && minTo) {
        // This is not necessary the best path, but we are so greedy that we
        // can't resist:
        return reconstructBiDirectionalPath(minFrom, minTo);
      }
    }

    return NO_PATH; // No path.

    function nonOrientedVisitor(otherNode, link) {
      return visitNode(otherNode, link, current);
    }

    function orientedVisitor(otherNode, link) {
      // For oritned graphs we need to reverse graph, when traveling
      // backwards. So, we use non-oriented ngraph's traversal, and 
      // filter link orientation here.
      if (currentOpener === BY_FROM) {
        if (link.fromId === current.node.id) return visitNode(otherNode, link, current)
      } else if (currentOpener === BY_TO) {
        if (link.toId === current.node.id) return visitNode(otherNode, link, current);
      }
    }

    function canExit(currentNode) {
      var opener = currentNode.open
      if (opener && opener !== currentOpener) {
        return true;
      }

      return false;
    }

    function reconstructBiDirectionalPath(a, b) {
      var pathOfNodes = [];
      var aParent = a;
      while(aParent) {
        pathOfNodes.push(aParent.node);
        aParent = aParent.parent;
      }
      var bParent = b;
      while (bParent) {
        pathOfNodes.unshift(bParent.node);
        bParent = bParent.parent
      }
      return pathOfNodes;
    }

    function visitNode(otherNode, link, cameFrom) {
      var otherSearchState = nodeState.get(otherNode.id);
      if (!otherSearchState) {
        otherSearchState = pool.createNewState(otherNode);
        nodeState.set(otherNode.id, otherSearchState);
      }

      if (otherSearchState.closed) {
        // Already processed this node.
        return;
      }

      if (canExit(otherSearchState, cameFrom)) {
        // this node was opened by alternative opener. The sets intersect now,
        // we found an optimal path, that goes through *this* node. However, there
        // is no guarantee that this is the global optimal solution path.

        var potentialLMin = otherSearchState.distanceToSource + cameFrom.distanceToSource;
        if (potentialLMin < lMin) {
          minFrom = otherSearchState;
          minTo = cameFrom
          lMin = potentialLMin;
        }
        // we are done with this node.
        return;
      }

      var tentativeDistance = cameFrom.distanceToSource + distance(otherSearchState.node, cameFrom.node, link);

      if (tentativeDistance >= otherSearchState.distanceToSource) {
        // This would only make our path longer. Ignore this route.
        return;
      }

      // Choose target based on current working set:
      var target = (currentOpener === BY_FROM) ? to : from;
      var newFScore = tentativeDistance + heuristic(otherSearchState.node, target);
      if (newFScore >= lMin) {
        // this can't be optimal path, as we have already found a shorter path.
        return;
      }
      otherSearchState.fScore = newFScore;

      if (otherSearchState.open === 0) {
        // Remember this node in the current set
        currentSet.push(otherSearchState);
        currentSet.updateItem(otherSearchState.heapIndex);

        otherSearchState.open = currentOpener;
      }

      // bingo! we found shorter path:
      otherSearchState.parent = cameFrom;
      otherSearchState.distanceToSource = tentativeDistance;
    }
  }
}

},{"./NodeHeap":5,"./defaultSettings":8,"./heuristics":9,"./makeSearchStatePool":10}],7:[function(require,module,exports){
/**
 * Performs a uni-directional A Star search on graph.
 * 
 * We will try to minimize f(n) = g(n) + h(n), where
 * g(n) is actual distance from source node to `n`, and
 * h(n) is heuristic distance from `n` to target node.
 */
module.exports = aStarPathSearch;

var NodeHeap = require('./NodeHeap');
var makeSearchStatePool = require('./makeSearchStatePool');
var heuristics = require('./heuristics');
var defaultSettings = require('./defaultSettings.js');

var NO_PATH = defaultSettings.NO_PATH;

module.exports.l2 = heuristics.l2;
module.exports.l1 = heuristics.l1;

/**
 * Creates a new instance of pathfinder. A pathfinder has just one method:
 * `find(fromId, toId)`, it may be extended in future.
 * 
 * @param {ngraph.graph} graph instance. See https://github.com/anvaka/ngraph.graph
 * @param {Object} options that configures search
 * @param {Function(a, b)} options.heuristic - a function that returns estimated distance between
 * nodes `a` and `b`. This function should never overestimate actual distance between two
 * nodes (otherwise the found path will not be the shortest). Defaults function returns 0,
 * which makes this search equivalent to Dijkstra search.
 * @param {Function(a, b)} options.distance - a function that returns actual distance between two
 * nodes `a` and `b`. By default this is set to return graph-theoretical distance (always 1);
 * @param {Boolean} options.oriented - whether graph should be considered oriented or not.
 * 
 * @returns {Object} A pathfinder with single method `find()`.
 */
function aStarPathSearch(graph, options) {
  options = options || {};
  // whether traversal should be considered over oriented graph.
  var oriented = options.oriented;

  var heuristic = options.heuristic;
  if (!heuristic) heuristic = defaultSettings.heuristic;

  var distance = options.distance;
  if (!distance) distance = defaultSettings.distance;
  var pool = makeSearchStatePool();

  return {
    /**
     * Finds a path between node `fromId` and `toId`.
     * @returns {Array} of nodes between `toId` and `fromId`. Empty array is returned
     * if no path is found.
     */
    find: find
  };

  function find(fromId, toId) {
    var from = graph.getNode(fromId);
    if (!from) throw new Error('fromId is not defined in this graph: ' + fromId);
    var to = graph.getNode(toId);
    if (!to) throw new Error('toId is not defined in this graph: ' + toId);
    pool.reset();

    // Maps nodeId to NodeSearchState.
    var nodeState = new Map();

    // the nodes that we still need to evaluate
    var openSet = new NodeHeap({
      compare: defaultSettings.compareFScore,
      setNodeId: defaultSettings.setHeapIndex
    });

    var startNode = pool.createNewState(from);
    nodeState.set(fromId, startNode);

    // For the first node, fScore is completely heuristic.
    startNode.fScore = heuristic(from, to);

    // The cost of going from start to start is zero.
    startNode.distanceToSource = 0;
    openSet.push(startNode);
    startNode.open = 1;

    var cameFrom;

    while (openSet.length > 0) {
      cameFrom = openSet.pop();
      if (goalReached(cameFrom, to)) return reconstructPath(cameFrom);

      // no need to visit this node anymore
      cameFrom.closed = true;
      graph.forEachLinkedNode(cameFrom.node.id, visitNeighbour, oriented);
    }

    // If we got here, then there is no path.
    return NO_PATH;

    function visitNeighbour(otherNode, link) {
      var otherSearchState = nodeState.get(otherNode.id);
      if (!otherSearchState) {
        otherSearchState = pool.createNewState(otherNode);
        nodeState.set(otherNode.id, otherSearchState);
      }

      if (otherSearchState.closed) {
        // Already processed this node.
        return;
      }
      if (otherSearchState.open === 0) {
        // Remember this node.
        openSet.push(otherSearchState);
        otherSearchState.open = 1;
      }

      var tentativeDistance = cameFrom.distanceToSource + distance(otherNode, cameFrom.node, link);
      if (tentativeDistance >= otherSearchState.distanceToSource) {
        // This would only make our path longer. Ignore this route.
        return;
      }

      // bingo! we found shorter path:
      otherSearchState.parent = cameFrom;
      otherSearchState.distanceToSource = tentativeDistance;
      otherSearchState.fScore = tentativeDistance + heuristic(otherSearchState.node, to);

      openSet.updateItem(otherSearchState.heapIndex);
    }
  }
}

function goalReached(searchState, targetNode) {
  return searchState.node === targetNode;
}

function reconstructPath(searchState) {
  var path = [searchState.node];
  var parent = searchState.parent;

  while (parent) {
    path.push(parent.node);
    parent = parent.parent;
  }

  return path;
}

},{"./NodeHeap":5,"./defaultSettings.js":8,"./heuristics":9,"./makeSearchStatePool":10}],8:[function(require,module,exports){
// We reuse instance of array, but we trie to freeze it as well,
// so that consumers don't modify it. Maybe it's a bad idea.
var NO_PATH = [];
if (typeof Object.freeze === 'function') Object.freeze(NO_PATH);

module.exports = {
  // Path search settings
  heuristic: blindHeuristic,
  distance: constantDistance,
  compareFScore: compareFScore,
  NO_PATH: NO_PATH,

  // heap settings
  setHeapIndex: setHeapIndex,

  // nba:
  setH1: setH1,
  setH2: setH2,
  compareF1Score: compareF1Score,
  compareF2Score: compareF2Score,
}

function blindHeuristic(/* a, b */) {
  // blind heuristic makes this search equal to plain Dijkstra path search.
  return 0;
}

function constantDistance(/* a, b */) {
  return 1;
}

function compareFScore(a, b) {
  var result = a.fScore - b.fScore;
  // TODO: Can I improve speed with smarter ties-breaking?
  // I tried distanceToSource, but it didn't seem to have much effect
  return result;
}

function setHeapIndex(nodeSearchState, heapIndex) {
  nodeSearchState.heapIndex = heapIndex;
}

function compareF1Score(a, b) {
  return a.f1 - b.f1;
}

function compareF2Score(a, b) {
  return a.f2 - b.f2;
}

function setH1(node, heapIndex) {
  node.h1 = heapIndex;
}

function setH2(node, heapIndex) {
  node.h2 = heapIndex;
}
},{}],9:[function(require,module,exports){
module.exports = {
  l2: l2,
  l1: l1
};

/**
 * Euclid distance (l2 norm);
 * 
 * @param {*} a 
 * @param {*} b 
 */
function l2(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Manhattan distance (l1 norm);
 * @param {*} a 
 * @param {*} b 
 */
function l1(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.abs(dx) + Math.abs(dy);
}

},{}],10:[function(require,module,exports){
/**
 * This class represents a single search node in the exploration tree for
 * A* algorithm.
 * 
 * @param {Object} node  original node in the graph
 */
function NodeSearchState(node) {
  this.node = node;

  // How we came to this node?
  this.parent = null;

  this.closed = false;
  this.open = 0;

  this.distanceToSource = Number.POSITIVE_INFINITY;
  // the f(n) = g(n) + h(n) value
  this.fScore = Number.POSITIVE_INFINITY;

  // used to reconstruct heap when fScore is updated.
  this.heapIndex = -1;
};

function makeSearchStatePool() {
  var currentInCache = 0;
  var nodeCache = [];

  return {
    createNewState: createNewState,
    reset: reset
  };

  function reset() {
    currentInCache = 0;
  }

  function createNewState(node) {
    var cached = nodeCache[currentInCache];
    if (cached) {
      // TODO: This almost duplicates constructor code. Not sure if
      // it would impact performance if I move this code into a function
      cached.node = node;
      // How we came to this node?
      cached.parent = null;

      cached.closed = false;
      cached.open = 0;

      cached.distanceToSource = Number.POSITIVE_INFINITY;
      // the f(n) = g(n) + h(n) value
      cached.fScore = Number.POSITIVE_INFINITY;

      // used to reconstruct heap when fScore is updated.
      cached.heapIndex = -1;

    } else {
      cached = new NodeSearchState(node);
      nodeCache[currentInCache] = cached;
    }
    currentInCache++;
    return cached;
  }
}
module.exports = makeSearchStatePool;
},{}],11:[function(require,module,exports){
module.exports = nba;

var NodeHeap = require('../NodeHeap');
var heuristics = require('../heuristics');
var defaultSettings = require('../defaultSettings.js');
var makeNBASearchStatePool = require('./makeNBASearchStatePool.js');

var NO_PATH = defaultSettings.NO_PATH;

module.exports.l2 = heuristics.l2;
module.exports.l1 = heuristics.l1;

/**
 * Creates a new instance of pathfinder. A pathfinder has just one method:
 * `find(fromId, toId)`.
 * 
 * This is implementation of the NBA* algorithm described in 
 * 
 *  "Yet another bidirectional algorithm for shortest paths" paper by Wim Pijls and Henk Post
 * 
 * The paper is available here: https://repub.eur.nl/pub/16100/ei2009-10.pdf
 * 
 * @param {ngraph.graph} graph instance. See https://github.com/anvaka/ngraph.graph
 * @param {Object} options that configures search
 * @param {Function(a, b)} options.heuristic - a function that returns estimated distance between
 * nodes `a` and `b`. This function should never overestimate actual distance between two
 * nodes (otherwise the found path will not be the shortest). Defaults function returns 0,
 * which makes this search equivalent to Dijkstra search.
 * @param {Function(a, b)} options.distance - a function that returns actual distance between two
 * nodes `a` and `b`. By default this is set to return graph-theoretical distance (always 1);
 * 
 * @returns {Object} A pathfinder with single method `find()`.
 */
function nba(graph, options) {
  options = options || {};
  // whether traversal should be considered over oriented graph.
  var oriented = options.oriented;
  var quitFast = options.quitFast;

  var heuristic = options.heuristic;
  if (!heuristic) heuristic = defaultSettings.heuristic;

  var distance = options.distance;
  if (!distance) distance = defaultSettings.distance;

  // During stress tests I noticed that garbage collection was one of the heaviest
  // contributors to the algorithm's speed. So I'm using an object pool to recycle nodes.
  var pool = makeNBASearchStatePool();

  return {
    /**
     * Finds a path between node `fromId` and `toId`.
     * @returns {Array} of nodes between `toId` and `fromId`. Empty array is returned
     * if no path is found.
     */
    find: find
  };

  function find(fromId, toId) {
    // I must apologize for the code duplication. This was the easiest way for me to
    // implement the algorithm fast.
    var from = graph.getNode(fromId);
    if (!from) throw new Error('fromId is not defined in this graph: ' + fromId);
    var to = graph.getNode(toId);
    if (!to) throw new Error('toId is not defined in this graph: ' + toId);

    pool.reset();

    // I must also apologize for somewhat cryptic names. The NBA* is bi-directional
    // search algorithm, which means it runs two searches in parallel. One is called
    // forward search and it runs from source node to target, while the other one
    // (backward search) runs from target to source.

    // Everywhere where you see `1` it means it's for the forward search. `2` is for 
    // backward search.

    // For oriented graph path finding, we need to reverse the graph, so that
    // backward search visits correct link. Obviously we don't want to duplicate
    // the graph, instead we always traverse the graph as non-oriented, and filter
    // edges in `visitN1Oriented/visitN2Oritented`
    var forwardVisitor = oriented ? visitN1Oriented : visitN1;
    var reverseVisitor = oriented ? visitN2Oriented : visitN2;

    // Maps nodeId to NBASearchState.
    var nodeState = new Map();

    // These two heaps store nodes by their underestimated values.
    var open1Set = new NodeHeap({
      compare: defaultSettings.compareF1Score,
      setNodeId: defaultSettings.setH1
    });
    var open2Set = new NodeHeap({
      compare: defaultSettings.compareF2Score,
      setNodeId: defaultSettings.setH2
    });

    // This is where both searches will meet.
    var minNode;

    // The smallest path length seen so far is stored here:
    var lMin = Number.POSITIVE_INFINITY;

    // We start by putting start/end nodes to the corresponding heaps
    // If variable names like `f1`, `g1` are too confusing, please refer
    // to makeNBASearchStatePool.js file, which has detailed description.
    var startNode = pool.createNewState(from);
    nodeState.set(fromId, startNode); 
    startNode.g1 = 0;
    var f1 = heuristic(from, to);
    startNode.f1 = f1;
    open1Set.push(startNode);

    var endNode = pool.createNewState(to);
    nodeState.set(toId, endNode);
    endNode.g2 = 0;
    var f2 = f1; // they should agree originally
    endNode.f2 = f2;
    open2Set.push(endNode)

    // the `cameFrom` variable is accessed by both searches, so that we can store parents.
    var cameFrom;

    // this is the main algorithm loop:
    while (open2Set.length && open1Set.length) {
      if (open1Set.length < open2Set.length) {
        forwardSearch();
      } else {
        reverseSearch();
      }

      if (quitFast && minNode) break;
    }

    var path = reconstructPath(minNode);
    return path; // the public API is over

    function forwardSearch() {
      cameFrom = open1Set.pop();
      if (cameFrom.closed) {
        return;
      }

      cameFrom.closed = true;

      if (cameFrom.f1 < lMin && (cameFrom.g1 + f2 - heuristic(from, cameFrom.node)) < lMin) {
        graph.forEachLinkedNode(cameFrom.node.id, forwardVisitor);
      }

      if (open1Set.length > 0) {
        // this will be used in reverse search
        f1 = open1Set.peek().f1;
      } 
    }

    function reverseSearch() {
      cameFrom = open2Set.pop();
      if (cameFrom.closed) {
        return;
      }
      cameFrom.closed = true;

      if (cameFrom.f2 < lMin && (cameFrom.g2 + f1 - heuristic(cameFrom.node, to)) < lMin) {
        graph.forEachLinkedNode(cameFrom.node.id, reverseVisitor);
      }

      if (open2Set.length > 0) {
        // this will be used in forward search
        f2 = open2Set.peek().f2;
      }
    }

    function visitN1(otherNode, link) {
      var otherSearchState = nodeState.get(otherNode.id);
      if (!otherSearchState) {
        otherSearchState = pool.createNewState(otherNode);
        nodeState.set(otherNode.id, otherSearchState);
      }

      if (otherSearchState.closed) return;

      var tentativeDistance = cameFrom.g1 + distance(cameFrom.node, otherNode, link);

      if (tentativeDistance < otherSearchState.g1) {
        otherSearchState.g1 = tentativeDistance;
        otherSearchState.f1 = tentativeDistance + heuristic(otherSearchState.node, to);
        otherSearchState.p1 = cameFrom;
        if (otherSearchState.h1 < 0) {
          open1Set.push(otherSearchState);
        } else {
          open1Set.updateItem(otherSearchState.h1);
        }
      }
      var potentialMin = otherSearchState.g1 + otherSearchState.g2;
      if (potentialMin < lMin) { 
        lMin = potentialMin;
        minNode = otherSearchState;
      }
    }

    function visitN2(otherNode, link) {
      var otherSearchState = nodeState.get(otherNode.id);
      if (!otherSearchState) {
        otherSearchState = pool.createNewState(otherNode);
        nodeState.set(otherNode.id, otherSearchState);
      }

      if (otherSearchState.closed) return;

      var tentativeDistance = cameFrom.g2 + distance(cameFrom.node, otherNode, link);

      if (tentativeDistance < otherSearchState.g2) {
        otherSearchState.g2 = tentativeDistance;
        otherSearchState.f2 = tentativeDistance + heuristic(from, otherSearchState.node);
        otherSearchState.p2 = cameFrom;
        if (otherSearchState.h2 < 0) {
          open2Set.push(otherSearchState);
        } else {
          open2Set.updateItem(otherSearchState.h2);
        }
      }
      var potentialMin = otherSearchState.g1 + otherSearchState.g2;
      if (potentialMin < lMin) {
        lMin = potentialMin;
        minNode = otherSearchState;
      }
    }

    function visitN2Oriented(otherNode, link) {
      // we are going backwards, graph needs to be reversed. 
      if (link.toId === cameFrom.node.id) return visitN2(otherNode, link);
    }
    function visitN1Oriented(otherNode, link) {
      // this is forward direction, so we should be coming FROM:
      if (link.fromId === cameFrom.node.id) return visitN1(otherNode, link);
    }
  }
}

function reconstructPath(searchState) {
  if (!searchState) return NO_PATH;

  var path = [searchState.node];
  var parent = searchState.p1;

  while (parent) {
    path.push(parent.node);
    parent = parent.p1;
  }

  var child = searchState.p2;

  while (child) {
    path.unshift(child.node);
    child = child.p2;
  }
  return path;
}

},{"../NodeHeap":5,"../defaultSettings.js":8,"../heuristics":9,"./makeNBASearchStatePool.js":12}],12:[function(require,module,exports){
module.exports = makeNBASearchStatePool;

/**
 * Creates new instance of NBASearchState. The instance stores information
 * about search state, and is used by NBA* algorithm.
 *
 * @param {Object} node - original graph node
 */
function NBASearchState(node) {
  /**
   * Original graph node.
   */
  this.node = node;

  /**
   * Parent of this node in forward search
   */
  this.p1 = null;

  /**
   * Parent of this node in reverse search
   */
  this.p2 = null;

  /**
   * If this is set to true, then the node was already processed
   * and we should not touch it anymore.
   */
  this.closed = false;

  /**
   * Actual distance from this node to its parent in forward search
   */
  this.g1 = Number.POSITIVE_INFINITY;

  /**
   * Actual distance from this node to its parent in reverse search
   */
  this.g2 = Number.POSITIVE_INFINITY;


  /**
   * Underestimated distance from this node to the path-finding source.
   */
  this.f1 = Number.POSITIVE_INFINITY;

  /**
   * Underestimated distance from this node to the path-finding target.
   */
  this.f2 = Number.POSITIVE_INFINITY;

  // used to reconstruct heap when fScore is updated. TODO: do I need them both?

  /**
   * Index of this node in the forward heap.
   */
  this.h1 = -1;

  /**
   * Index of this node in the reverse heap.
   */
  this.h2 = -1;
}

/**
 * As path-finding is memory-intensive process, we want to reduce pressure on
 * garbage collector. This class helps us to recycle path-finding nodes and significantly
 * reduces the search time (~20% faster than without it).
 */
function makeNBASearchStatePool() {
  var currentInCache = 0;
  var nodeCache = [];

  return {
    /**
     * Creates a new NBASearchState instance
     */
    createNewState: createNewState,

    /**
     * Marks all created instances available for recycling.
     */
    reset: reset
  };

  function reset() {
    currentInCache = 0;
  }

  function createNewState(node) {
    var cached = nodeCache[currentInCache];
    if (cached) {
      // TODO: This almost duplicates constructor code. Not sure if
      // it would impact performance if I move this code into a function
      cached.node = node;

      // How we came to this node?
      cached.p1 = null;
      cached.p2 = null;

      cached.closed = false;

      cached.g1 = Number.POSITIVE_INFINITY;
      cached.g2 = Number.POSITIVE_INFINITY;
      cached.f1 = Number.POSITIVE_INFINITY;
      cached.f2 = Number.POSITIVE_INFINITY;

      // used to reconstruct heap when fScore is updated.
      cached.h1 = -1;
      cached.h2 = -1;
    } else {
      cached = new NBASearchState(node);
      nodeCache[currentInCache] = cached;
    }
    currentInCache++;
    return cached;
  }
}

},{}],13:[function(require,module,exports){
module.exports = {
  aStar: require('./a-star/a-star.js'),
  aGreedy: require('./a-star/a-greedy-star'),
  nba: require('./a-star/nba/index.js'),
}

},{"./a-star/a-greedy-star":6,"./a-star/a-star.js":7,"./a-star/nba/index.js":11}],14:[function(require,module,exports){
/*!
 * wgl v0.4.0
 * (c) 2017 Andrei Kashcha.
 * Released under the MIT License.
 */
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (factory((global.wgl = {})));
}(this, (function(exports) {
    'use strict';

    /**
     * This module unifies handling of mouse whee event across different browsers
     *
     * See https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel?redirectlocale=en-US&redirectslug=DOM%2FMozilla_event_reference%2Fwheel
     * for more details
     *
     * Usage:
     *  var addWheelListener = require('wheel').addWheelListener;
     *  var removeWheelListener = require('wheel').removeWheelListener;
     *  addWheelListener(domElement, function (e) {
     *    // mouse wheel event
     *  });
     *  removeWheelListener(domElement, function);
     */
    // by default we shortcut to 'addEventListener':

    var wheel = addWheelListener;

    // But also expose "advanced" api with unsubscribe:
    var addWheelListener_1 = addWheelListener;
    var removeWheelListener_1 = removeWheelListener;


    var prefix = "";
    var _addEventListener;
    var _removeEventListener;
    var support;

    detectEventModel(typeof window !== 'undefined' && window,
        typeof document !== 'undefined' && document);

    function addWheelListener(elem, callback, useCapture) {
        _addWheelListener(elem, support, callback, useCapture);

        // handle MozMousePixelScroll in older Firefox
        if (support == "DOMMouseScroll") {
            _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
        }
    }

    function removeWheelListener(elem, callback, useCapture) {
        _removeWheelListener(elem, support, callback, useCapture);

        // handle MozMousePixelScroll in older Firefox
        if (support == "DOMMouseScroll") {
            _removeWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
        }
    }

    // TODO: in theory this anonymous function may result in incorrect
    // unsubscription in some browsers. But in practice, I don't think we should
    // worry too much about it (those browsers are on the way out)
    function _addWheelListener(elem, eventName, callback, useCapture) {
        elem[_addEventListener](prefix + eventName, support == "wheel" ? callback : function(originalEvent) {
            !originalEvent && (originalEvent = window.event);

            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                deltaY: 0,
                deltaZ: 0,
                clientX: originalEvent.clientX,
                clientY: originalEvent.clientY,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                },
                stopPropagation: function() {
                    if (originalEvent.stopPropagation) { originalEvent.stopPropagation(); }
                },
                stopImmediatePropagation: function() {
                    if (originalEvent.stopImmediatePropagation) { originalEvent.stopImmediatePropagation(); }
                }
            };

            // calculate deltaY (and deltaX) according to the event
            if (support == "mousewheel") {
                event.deltaY = -1 / 40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
            } else {
                event.deltaY = originalEvent.detail;
            }

            // it's time to fire the callback
            return callback(event);

        }, useCapture || false);
    }

    function _removeWheelListener(elem, eventName, callback, useCapture) {
        elem[_removeEventListener](prefix + eventName, callback, useCapture || false);
    }

    function detectEventModel(window, document) {
        if (window && window.addEventListener) {
            _addEventListener = "addEventListener";
            _removeEventListener = "removeEventListener";
        } else {
            _addEventListener = "attachEvent";
            _removeEventListener = "detachEvent";
            prefix = "on";
        }

        if (document) {
            // detect available wheel event
            support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
                document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
        } else {
            support = "wheel";
        }
    }

    wheel.addWheelListener = addWheelListener_1;
    wheel.removeWheelListener = removeWheelListener_1;

    /**
     * https://github.com/gre/bezier-easing
     * BezierEasing - use bezier curve for transition easing function
     * by Gaëtan Renaudeau 2014 - 2015 – MIT License
     */

    // These values are established by empiricism with tests (tradeoff: performance VS precision)
    var NEWTON_ITERATIONS = 4;
    var NEWTON_MIN_SLOPE = 0.001;
    var SUBDIVISION_PRECISION = 0.0000001;
    var SUBDIVISION_MAX_ITERATIONS = 10;

    var kSplineTableSize = 11;
    var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

    var float32ArraySupported = typeof Float32Array === 'function';

    function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }

    function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }

    function C(aA1) { return 3.0 * aA1; }

    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

    function binarySubdivide(aX, aA, aB, mX1, mX2) {
        var currentX, currentT, i = 0;
        do {
            currentT = aA + (aB - aA) / 2.0;
            currentX = calcBezier(currentT, mX1, mX2) - aX;
            if (currentX > 0.0) {
                aB = currentT;
            } else {
                aA = currentT;
            }
        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
        return currentT;
    }

    function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
        for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
            var currentSlope = getSlope(aGuessT, mX1, mX2);
            if (currentSlope === 0.0) {
                return aGuessT;
            }
            var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
    }

    function LinearEasing(x) {
        return x;
    }

    var src = function bezier(mX1, mY1, mX2, mY2) {
        if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
            throw new Error('bezier x values must be in [0, 1] range');
        }

        if (mX1 === mY1 && mX2 === mY2) {
            return LinearEasing;
        }

        // Precompute samples table
        var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
        for (var i = 0; i < kSplineTableSize; ++i) {
            sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }

        function getTForX(aX) {
            var intervalStart = 0.0;
            var currentSample = 1;
            var lastSample = kSplineTableSize - 1;

            for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }
            --currentSample;

            // Interpolate to provide an initial guess for t
            var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
            var guessForT = intervalStart + dist * kSampleStepSize;

            var initialSlope = getSlope(guessForT, mX1, mX2);
            if (initialSlope >= NEWTON_MIN_SLOPE) {
                return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
            } else if (initialSlope === 0.0) {
                return guessForT;
            } else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
            }
        }

        return function BezierEasing(x) {
            // Because JavaScript number are imprecise, we should guarantee the extremes are right.
            if (x === 0) {
                return 0;
            }
            if (x === 1) {
                return 1;
            }
            return calcBezier(getTForX(x), mY1, mY2);
        };
    };

    // Predefined set of animations. Similar to CSS easing functions
    var animations = {
        ease: src(0.25, 0.1, 0.25, 1),
        easeIn: src(0.42, 0, 1, 1),
        easeOut: src(0, 0, 0.58, 1),
        easeInOut: src(0.42, 0, 0.58, 1),
        linear: src(0, 0, 1, 1)
    };


    var amator = animate;
    var makeAggregateRaf_1 = makeAggregateRaf;
    var sharedScheduler = makeAggregateRaf();


    function animate(source, target, options) {
        var start = Object.create(null);
        var diff = Object.create(null);
        options = options || {};
        // We let clients specify their own easing function
        var easing = (typeof options.easing === 'function') ? options.easing : animations[options.easing];

        // if nothing is specified, default to ease (similar to CSS animations)
        if (!easing) {
            if (options.easing) {
                console.warn('Unknown easing function in amator: ' + options.easing);
            }
            easing = animations.ease;
        }

        var step = typeof options.step === 'function' ? options.step : noop$1;
        var done = typeof options.done === 'function' ? options.done : noop$1;

        var scheduler = getScheduler(options.scheduler);

        var keys = Object.keys(target);
        keys.forEach(function(key) {
            start[key] = source[key];
            diff[key] = target[key] - source[key];
        });

        var durationInMs = typeof options.duration === 'number' ? options.duration : 400;
        var durationInFrames = Math.max(1, durationInMs * 0.06); // 0.06 because 60 frames pers 1,000 ms
        var previousAnimationId;
        var frame = 0;

        previousAnimationId = scheduler.next(loop);

        return {
            cancel: cancel
        }

        function cancel() {
            scheduler.cancel(previousAnimationId);
            previousAnimationId = 0;
        }

        function loop() {
            var t = easing(frame / durationInFrames);
            frame += 1;
            setValues(t);
            if (frame <= durationInFrames) {
                previousAnimationId = scheduler.next(loop);
                step(source);
            } else {
                previousAnimationId = 0;
                setTimeout(function() { done(source); }, 0);
            }
        }

        function setValues(t) {
            keys.forEach(function(key) {
                source[key] = diff[key] * t + start[key];
            });
        }
    }

    function noop$1() {}

    function getScheduler(scheduler) {
        if (!scheduler) {
            var canRaf = typeof window !== 'undefined' && window.requestAnimationFrame;
            return canRaf ? rafScheduler() : timeoutScheduler()
        }
        if (typeof scheduler.next !== 'function') { throw new Error('Scheduler is supposed to have next(cb) function') }
        if (typeof scheduler.cancel !== 'function') { throw new Error('Scheduler is supposed to have cancel(handle) function') }

        return scheduler
    }

    function rafScheduler() {
        return {
            next: window.requestAnimationFrame.bind(window),
            cancel: window.cancelAnimationFrame.bind(window)
        }
    }

    function timeoutScheduler() {
        return {
            next: function(cb) {
                return setTimeout(cb, 1000 / 60)
            },
            cancel: function(id) {
                return clearTimeout(id)
            }
        }
    }

    function makeAggregateRaf() {
        var frontBuffer = new Set();
        var backBuffer = new Set();
        var frameToken = 0;

        return {
            next: next,
            cancel: next,
            clearAll: clearAll
        }

        function clearAll() {
            frontBuffer.clear();
            backBuffer.clear();
            cancelAnimationFrame(frameToken);
            frameToken = 0;
        }

        function next(callback) {
            backBuffer.add(callback);
            renderNextFrame();
        }

        function renderNextFrame() {
            if (!frameToken) { frameToken = requestAnimationFrame(renderFrame); }
        }

        function renderFrame() {
            frameToken = 0;

            var t = backBuffer;
            backBuffer = frontBuffer;
            frontBuffer = t;

            frontBuffer.forEach(function(callback) {
                callback();
            });
            frontBuffer.clear();
        }


    }

    amator.makeAggregateRaf = makeAggregateRaf_1;
    amator.sharedScheduler = sharedScheduler;

    /**
     * Allows smooth kinetic scrolling of the surface
     */
    var kinetic_1 = kinetic;

    function kinetic(getPoint, scroll, settings) {
        if (typeof settings !== 'object') {
            // setting could come as boolean, we should ignore it, and use an object.
            settings = {};
        }

        var minVelocity = (typeof settings.minVelocity === 'number') ? settings.minVelocity : 5;
        var amplitude = (typeof settings.amplitude === 'number') ? settings.amplitude : 0.25;

        var lastPoint;
        var timestamp;
        var timeConstant = 342;

        var ticker;
        var vx, targetX, ax;
        var vy, targetY, ay;

        var raf;

        return {
            start: start,
            stop: stop,
            cancel: dispose
        }

        function dispose() {
            window.clearInterval(ticker);
            window.cancelAnimationFrame(raf);
        }

        function start() {
            lastPoint = getPoint();

            ax = ay = vx = vy = 0;
            timestamp = new Date();

            window.clearInterval(ticker);
            window.cancelAnimationFrame(raf);

            // we start polling the point position to accumulate velocity
            // Once we stop(), we will use accumulated velocity to keep scrolling
            // an object.
            ticker = window.setInterval(track, 100);
        }

        function track() {
            var now = Date.now();
            var elapsed = now - timestamp;
            timestamp = now;

            var currentPoint = getPoint();

            var dx = currentPoint.x - lastPoint.x;
            var dy = currentPoint.y - lastPoint.y;

            lastPoint = currentPoint;

            var dt = 1000 / (1 + elapsed);

            // moving average
            vx = 0.8 * dx * dt + 0.2 * vx;
            vy = 0.8 * dy * dt + 0.2 * vy;
        }

        function stop() {
            window.clearInterval(ticker);
            window.cancelAnimationFrame(raf);

            var currentPoint = getPoint();

            targetX = currentPoint.x;
            targetY = currentPoint.y;
            timestamp = Date.now();

            if (vx < -minVelocity || vx > minVelocity) {
                ax = amplitude * vx;
                targetX += ax;
            }

            if (vy < -minVelocity || vy > minVelocity) {
                ay = amplitude * vy;
                targetY += ay;
            }

            raf = window.requestAnimationFrame(autoScroll);
        }

        function autoScroll() {
            var elapsed = Date.now() - timestamp;

            var moving = false;
            var dx = 0;
            var dy = 0;

            if (ax) {
                dx = -ax * Math.exp(-elapsed / timeConstant);

                if (dx > 0.5 || dx < -0.5) { moving = true; } else { dx = ax = 0; }
            }

            if (ay) {
                dy = -ay * Math.exp(-elapsed / timeConstant);

                if (dy > 0.5 || dy < -0.5) { moving = true; } else { dy = ay = 0; }
            }

            if (moving) {
                scroll(targetX + dx, targetY + dy);
                raf = window.requestAnimationFrame(autoScroll);
            }
        }

    }

    /* global Event */
    var createEvent_1 = createEvent;

    var isIE = typeof Event !== 'function';

    /**
     * Constructs custom event. Works in IE too
     */
    function createEvent(name) {
        if (isIE) {
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(name, true, true, undefined);
            return evt
        } else {
            return new Event(name, {
                bubbles: true
            })
        }
    }

    /**
     * Disallows selecting text.
     */
    var textSelectionInterceptor = createTextSelectionInterceptor;

    function createTextSelectionInterceptor() {
        var dragObject;
        var prevSelectStart;
        var prevDragStart;

        return {
            capture: capture,
            release: release
        }

        function capture(domObject) {
            prevSelectStart = window.document.onselectstart;
            prevDragStart = window.document.ondragstart;

            window.document.onselectstart = disabled;

            dragObject = domObject;
            dragObject.ondragstart = disabled;
        }

        function release() {
            window.document.onselectstart = prevSelectStart;
            if (dragObject) { dragObject.ondragstart = prevDragStart; }
        }
    }

    function disabled(e) {
        e.stopPropagation();
        return false
    }

    var transform = Transform;

    function Transform() {
        this.x = 0;
        this.y = 0;
        this.scale = 1;
    }

    var svgController = makeSvgController;

    function makeSvgController(svgElement) {
        var elementValid = (svgElement instanceof SVGElement);
        if (!elementValid) {
            throw new Error('svg element is required for svg.panzoom to work')
        }

        var owner = svgElement.ownerSVGElement;
        if (!owner) {
            throw new Error(
                'Do not apply panzoom to the root <svg> element. ' +
                'Use its child instead (e.g. <g></g>). ' +
                'As of March 2016 only FireFox supported transform on the root element')
        }

        owner.setAttribute('tabindex', 1); // TODO: not sure if this is really polite

        var api = {
            getBBox: getBBox,
            getScreenCTM: getScreenCTM,
            getOwner: getOwner,
            applyTransform: applyTransform,
            initTransform: initTransform
        };

        return api

        function getOwner() {
            return owner
        }

        function getBBox() {
            var bbox = svgElement.getBBox();
            return {
                left: bbox.x,
                top: bbox.y,
                width: bbox.width,
                height: bbox.height,
            }
        }

        function getScreenCTM() {
            return owner.getScreenCTM()
        }

        function initTransform(transform) {
            var screenCTM = svgElement.getScreenCTM();
            transform.x = screenCTM.e;
            transform.y = screenCTM.f;
            transform.scale = screenCTM.a;
            owner.removeAttributeNS(null, 'viewBox');
        }

        function applyTransform(transform) {
            svgElement.setAttribute('transform', 'matrix(' +
                transform.scale + ' 0 0 ' +
                transform.scale + ' ' +
                transform.x + ' ' + transform.y + ')');
        }
    }

    var domController = makeDomController;

    function makeDomController(domElement) {
        var elementValid = (domElement instanceof HTMLElement);
        if (!elementValid) {
            throw new Error('svg element is required for svg.panzoom to work')
        }

        var owner = domElement.parentElement;
        if (!owner) {
            throw new Error(
                'Do not apply panzoom to the detached DOM element. '
            )
        }

        domElement.scrollTop = 0;
        owner.setAttribute('tabindex', 1); // TODO: not sure if this is really polite

        var api = {
            getBBox: getBBox,
            getOwner: getOwner,
            applyTransform: applyTransform,
        };

        return api

        function getOwner() {
            return owner
        }

        function getBBox() {
            // TODO: We should probably cache this?
            return {
                left: 0,
                top: 0,
                width: domElement.clientWidth,
                height: domElement.clientHeight
            }
        }

        function applyTransform(transform) {
            // TODO: Should we cache this?
            domElement.style.transformOrigin = '0 0 0';
            domElement.style.transform = 'matrix(' +
                transform.scale + ', 0, 0, ' +
                transform.scale + ', ' +
                transform.x + ', ' + transform.y + ')';
        }
    }

    /* globals SVGElement */
    /**
     * Allows to drag and zoom svg elements
     */




    var preventTextSelection = textSelectionInterceptor();




    var defaultZoomSpeed = 0.065;
    var defaultDoubleTapZoomSpeed = 1.75;
    var doubleTapSpeedInMS = 300;

    var panzoom = createPanZoom;

    /**
     * Creates a new instance of panzoom, so that an object can be panned and zoomed
     *
     * @param {DOMElement} domElement where panzoom should be attached.
     * @param {Object} options that configure behavior.
     */
    function createPanZoom(domElement, options) {
        options = options || {};

        var domController$$1 = options.controller;

        if (!domController$$1) {
            if (domElement instanceof SVGElement) {
                domController$$1 = svgController(domElement);
            }

            if (domElement instanceof HTMLElement) {
                domController$$1 = domController(domElement);
            }
        }

        if (!domController$$1) {
            throw new Error('Cannot create panzoom for the current type of dom element')
        }
        var owner = domController$$1.getOwner();
        // just to avoid GC pressure, every time we do intermediate transform
        // we return this object. For internal use only. Never give it back to the consumer of this library
        var storedCTMResult = { x: 0, y: 0 };

        var isDirty = false;
        var transform$$1 = new transform();

        if (domController$$1.initTransform) {
            domController$$1.initTransform(transform$$1);
        }

        var realPinch = typeof options.realPinch === 'boolean' ? options.realPinch : false;
        var bounds = options.bounds;
        var maxZoom = typeof options.maxZoom === 'number' ? options.maxZoom : Number.POSITIVE_INFINITY;
        var minZoom = typeof options.minZoom === 'number' ? options.minZoom : 0;

        var boundsPadding = typeof options.boundsPadding === 'number' ? options.boundsPadding : 0.05;
        var zoomDoubleClickSpeed = typeof options.zoomDoubleClickSpeed === 'number' ? options.zoomDoubleClickSpeed : defaultDoubleTapZoomSpeed;
        var beforeWheel = options.beforeWheel || noop;
        var speed = typeof options.zoomSpeed === 'number' ? options.zoomSpeed : defaultZoomSpeed;

        validateBounds(bounds);

        if (options.autocenter) {
            autocenter();
        }

        var frameAnimation;

        var lastTouchEndTime = 0;

        var touchInProgress = false;

        // We only need to fire panstart when actual move happens
        var panstartFired = false;

        // cache mouse coordinates here
        var mouseX;
        var mouseY;

        var pinchZoomLength;

        var smoothScroll;
        if ('smoothScroll' in options && !options.smoothScroll) {
            // If user explicitly asked us not to use smooth scrolling, we obey
            smoothScroll = rigidScroll();
        } else {
            // otherwise we use forward smoothScroll settings to kinetic API
            // which makes scroll smoothing.
            smoothScroll = kinetic_1(getPoint, scroll, options.smoothScroll);
        }

        var moveByAnimation;
        var zoomToAnimation;

        var multitouch;

        listenForEvents();

        return {
            dispose: dispose,
            moveBy: internalMoveBy,
            moveTo: moveTo,
            centerOn: centerOn,
            zoomTo: publicZoomTo,
            zoomAbs: zoomAbs,
            getTransform: getTransformModel,
            showRectangle: showRectangle
        }

        function showRectangle(rect) {
            // TODO: this duplicates autocenter. I think autocenter should go.
            var size = transformToScreen(owner.clientWidth, owner.clientHeight);

            var rectWidth = rect.right - rect.left;
            var rectHeight = rect.bottom - rect.top;
            if (!Number.isFinite(rectWidth) || !Number.isFinite(rectHeight)) {
                throw new Error('Invalid rectangle');
            }

            var dw = size.x / rectWidth;
            var dh = size.y / rectHeight;
            var scale = Math.min(dw, dh);
            transform$$1.x = -(rect.left + rectWidth / 2) * scale + size.x / 2;
            transform$$1.y = -(rect.top + rectHeight / 2) * scale + size.y / 2;
            transform$$1.scale = scale;
        }

        function transformToScreen(x, y) {
            if (domController$$1.getScreenCTM) {
                var parentCTM = domController$$1.getScreenCTM();
                var parentScaleX = parentCTM.a;
                var parentScaleY = parentCTM.d;
                var parentOffsetX = parentCTM.e;
                var parentOffsetY = parentCTM.f;
                storedCTMResult.x = x * parentScaleX - parentOffsetX;
                storedCTMResult.y = y * parentScaleY - parentOffsetY;
            } else {
                storedCTMResult.x = x;
                storedCTMResult.y = y;
            }

            return storedCTMResult
        }

        function autocenter() {
            var w; // width of the parent
            var h; // height of the parent
            var left = 0;
            var top = 0;
            var sceneBoundingBox = getBoundingBox();
            if (sceneBoundingBox) {
                // If we have bounding box - use it.
                left = sceneBoundingBox.left;
                top = sceneBoundingBox.top;
                w = sceneBoundingBox.right - sceneBoundingBox.left;
                h = sceneBoundingBox.bottom - sceneBoundingBox.top;
            } else {
                // otherwise just use whatever space we have
                w = owner.clientWidth;
                h = owner.clientHeight;
            }
            var bbox = domController$$1.getBBox();
            if (bbox.width === 0 || bbox.height === 0) {
                // we probably do not have any elements in the SVG
                // just bail out;
                return;
            }
            var dh = h / bbox.height;
            var dw = w / bbox.width;
            var scale = Math.min(dw, dh);
            transform$$1.x = -(bbox.left + bbox.width / 2) * scale + w / 2 + left;
            transform$$1.y = -(bbox.top + bbox.height / 2) * scale + h / 2 + top;
            transform$$1.scale = scale;
        }

        function getTransformModel() {
            // TODO: should this be read only?
            return transform$$1
        }

        function getPoint() {
            return {
                x: transform$$1.x,
                y: transform$$1.y
            }
        }

        function moveTo(x, y) {
            transform$$1.x = x;
            transform$$1.y = y;

            keepTransformInsideBounds();

            triggerEvent('pan');
            makeDirty();
        }

        function moveBy(dx, dy) {
            moveTo(transform$$1.x + dx, transform$$1.y + dy);
        }

        function keepTransformInsideBounds() {
            var boundingBox = getBoundingBox();
            if (!boundingBox) { return }

            var adjusted = false;
            var clientRect = getClientRect();

            var diff = boundingBox.left - clientRect.right;
            if (diff > 0) {
                transform$$1.x += diff;
                adjusted = true;
            }
            // check the other side:
            diff = boundingBox.right - clientRect.left;
            if (diff < 0) {
                transform$$1.x += diff;
                adjusted = true;
            }

            // y axis:
            diff = boundingBox.top - clientRect.bottom;
            if (diff > 0) {
                // we adjust transform, so that it matches exactly our bounding box:
                // transform.y = boundingBox.top - (boundingBox.height + boundingBox.y) * transform.scale =>
                // transform.y = boundingBox.top - (clientRect.bottom - transform.y) =>
                // transform.y = diff + transform.y =>
                transform$$1.y += diff;
                adjusted = true;
            }

            diff = boundingBox.bottom - clientRect.top;
            if (diff < 0) {
                transform$$1.y += diff;
                adjusted = true;
            }
            return adjusted
        }

        /**
         * Returns bounding box that should be used to restrict scene movement.
         */
        function getBoundingBox() {
            if (!bounds) { return } // client does not want to restrict movement

            if (typeof bounds === 'boolean') {
                // for boolean type we use parent container bounds
                var sceneWidth = owner.clientWidth;
                var sceneHeight = owner.clientHeight;

                return {
                    left: sceneWidth * boundsPadding,
                    top: sceneHeight * boundsPadding,
                    right: sceneWidth * (1 - boundsPadding),
                    bottom: sceneHeight * (1 - boundsPadding),
                }
            }

            return bounds
        }

        function getClientRect() {
            var bbox = domController$$1.getBBox();
            var leftTop = client(bbox.left, bbox.top);

            return {
                left: leftTop.x,
                top: leftTop.y,
                right: bbox.width * transform$$1.scale + leftTop.x,
                bottom: bbox.height * transform$$1.scale + leftTop.y
            }
        }

        function client(x, y) {
            return {
                x: (x * transform$$1.scale) + transform$$1.x,
                y: (y * transform$$1.scale) + transform$$1.y
            }
        }

        function makeDirty() {
            isDirty = true;
            frameAnimation = window.requestAnimationFrame(frame);
        }

        function zoomByRatio(clientX, clientY, ratio) {
            if (isNaN(clientX) || isNaN(clientY) || isNaN(ratio)) {
                throw new Error('zoom requires valid numbers')
            }

            var newScale = transform$$1.scale * ratio;

            if (newScale < minZoom) {
                if (transform$$1.scale === minZoom) { return; }

                ratio = minZoom / transform$$1.scale;
            }
            if (newScale > maxZoom) {
                if (transform$$1.scale === maxZoom) { return; }

                ratio = maxZoom / transform$$1.scale;
            }

            var size = transformToScreen(clientX, clientY);

            transform$$1.x = size.x - ratio * (size.x - transform$$1.x);
            transform$$1.y = size.y - ratio * (size.y - transform$$1.y);

            var transformAdjusted = keepTransformInsideBounds();
            if (!transformAdjusted) { transform$$1.scale *= ratio; }

            triggerEvent('zoom');

            makeDirty();
        }

        function zoomAbs(clientX, clientY, zoomLevel) {
            var ratio = zoomLevel / transform$$1.scale;
            zoomByRatio(clientX, clientY, ratio);
        }

        function centerOn(ui) {
            var parent = ui.ownerSVGElement;
            if (!parent) { throw new Error('ui element is required to be within the scene') }

            // TODO: should i use controller's screen CTM?
            var clientRect = ui.getBoundingClientRect();
            var cx = clientRect.left + clientRect.width / 2;
            var cy = clientRect.top + clientRect.height / 2;

            var container = parent.getBoundingClientRect();
            var dx = container.width / 2 - cx;
            var dy = container.height / 2 - cy;

            internalMoveBy(dx, dy, true);
        }

        function internalMoveBy(dx, dy, smooth) {
            if (!smooth) {
                return moveBy(dx, dy)
            }

            if (moveByAnimation) { moveByAnimation.cancel(); }

            var from = { x: 0, y: 0 };
            var to = { x: dx, y: dy };
            var lastX = 0;
            var lastY = 0;

            moveByAnimation = amator(from, to, {
                step: function(v) {
                    moveBy(v.x - lastX, v.y - lastY);

                    lastX = v.x;
                    lastY = v.y;
                }
            });
        }

        function scroll(x, y) {
            cancelZoomAnimation();
            moveTo(x, y);
        }

        function dispose() {
            wheel.removeWheelListener(owner, onMouseWheel);
            owner.removeEventListener('mousedown', onMouseDown);
            owner.removeEventListener('keydown', onKeyDown);
            owner.removeEventListener('dblclick', onDoubleClick);
            if (frameAnimation) {
                window.cancelAnimationFrame(frameAnimation);
                frameAnimation = 0;
            }

            smoothScroll.cancel();

            releaseDocumentMouse();
            releaseTouches();

            triggerPanEnd();
        }

        function listenForEvents() {
            owner.addEventListener('mousedown', onMouseDown);
            owner.addEventListener('dblclick', onDoubleClick);
            owner.addEventListener('touchstart', onTouch);
            owner.addEventListener('keydown', onKeyDown);

            // Need to listen on the owner container, so that we are not limited
            // by the size of the scrollable domElement
            wheel.addWheelListener(owner, onMouseWheel);

            makeDirty();
        }


        function frame() {
            if (isDirty) { applyTransform(); }
        }

        function applyTransform() {
            isDirty = false;

            // TODO: Should I allow to cancel this?
            domController$$1.applyTransform(transform$$1);

            triggerEvent('transform');
            frameAnimation = 0;
        }

        function onKeyDown(e) {
            var x = 0,
                y = 0,
                z = 0;
            if (e.keyCode === 38) {
                y = 1; // up
            } else if (e.keyCode === 40) {
                y = -1; // down
            } else if (e.keyCode === 37) {
                x = 1; // left
            } else if (e.keyCode === 39) {
                x = -1; // right
            } else if (e.keyCode === 189 || e.keyCode === 109) { // DASH or SUBTRACT
                z = 1; // `-` -  zoom out
            } else if (e.keyCode === 187 || e.keyCode === 107) { // EQUAL SIGN or ADD
                z = -1; // `=` - zoom in (equal sign on US layout is under `+`)
            }

            if (x || y) {
                e.preventDefault();
                e.stopPropagation();

                var clientRect = owner.getBoundingClientRect();
                // movement speed should be the same in both X and Y direction:
                var offset = Math.min(clientRect.width, clientRect.height);
                var moveSpeedRatio = 0.05;
                var dx = offset * moveSpeedRatio * x;
                var dy = offset * moveSpeedRatio * y;

                // TODO: currently we do not animate this. It could be better to have animation
                internalMoveBy(dx, dy);
            }

            if (z) {
                var scaleMultiplier = getScaleMultiplier(z);
                publicZoomTo(owner.clientWidth / 2, owner.clientHeight / 2, scaleMultiplier);
            }
        }

        function onTouch(e) {
            beforeTouch(e);
            if (e.touches.length === 1) {
                return handleSingleFingerTouch(e, e.touches[0])
            } else if (e.touches.length === 2) {
                // handleTouchMove() will care about pinch zoom.
                pinchZoomLength = getPinchZoomLength(e.touches[0], e.touches[1]);
                multitouch = true;
                startTouchListenerIfNeeded();
            }
        }

        function beforeTouch(e) {
            if (options.onTouch && !options.onTouch(e)) {
                // if they return `false` from onTouch, we don't want to stop
                // events propagation. Fixes https://github.com/anvaka/panzoom/issues/12
                return
            }

            e.stopPropagation();
            e.preventDefault();
        }

        function handleSingleFingerTouch(e) {
            var touch = e.touches[0];
            var offset = getTouchOffsetXY(touch, e.target);
            mouseX = offset.x;
            mouseY = offset.y;

            startTouchListenerIfNeeded();
        }

        function startTouchListenerIfNeeded() {
            if (!touchInProgress) {
                touchInProgress = true;
                document.addEventListener('touchmove', handleTouchMove);
                document.addEventListener('touchend', handleTouchEnd);
                document.addEventListener('touchcancel', handleTouchEnd);
            }
        }

        function handleTouchMove(e) {

            if (e.touches.length === 1) {
                e.stopPropagation();
                var touch = e.touches[0];

                var offset = getTouchOffsetXY(touch, e.target);

                var dx = offset.x - mouseX;
                var dy = offset.y - mouseY;

                if (dx !== 0 && dy !== 0) {
                    triggerPanStart();
                }
                mouseX = offset.x;
                mouseY = offset.y;
                var point = transformToScreen(dx, dy);
                internalMoveBy(point.x, point.y);
            } else if (e.touches.length === 2) {
                // it's a zoom, let's find direction
                multitouch = true;
                var t1 = e.touches[0];
                var t2 = e.touches[1];
                var currentPinchLength = getPinchZoomLength(t1, t2);

                var scaleMultiplier = 1;

                if (realPinch) {
                    scaleMultiplier = currentPinchLength / pinchZoomLength;
                } else {
                    var delta = 0;
                    if (currentPinchLength < pinchZoomLength) {
                        delta = 1;
                    } else if (currentPinchLength > pinchZoomLength) {
                        delta = -1;
                    }

                    scaleMultiplier = getScaleMultiplier(delta);
                }

                mouseX = (t1.clientX + t2.clientX) / 2;
                mouseY = (t1.clientY + t2.clientY) / 2;

                publicZoomTo(mouseX, mouseY, scaleMultiplier);

                pinchZoomLength = currentPinchLength;
                e.stopPropagation();
                e.preventDefault();
            }
        }

        function handleTouchEnd(e) {
            if (e.touches.length > 0) {
                var offset = getTouchOffsetXY(e.touches[0], e.target);
                mouseX = offset.x;
                mouseY = offset.y;
            } else {
                var now = new Date();
                if (now - lastTouchEndTime < doubleTapSpeedInMS) {
                    smoothZoom(mouseX, mouseY, zoomDoubleClickSpeed);
                }

                lastTouchEndTime = now;

                touchInProgress = false;
                triggerPanEnd();
                releaseTouches();
            }
        }

        function getPinchZoomLength(finger1, finger2) {
            return Math.sqrt((finger1.clientX - finger2.clientX) * (finger1.clientX - finger2.clientX) +
                (finger1.clientY - finger2.clientY) * (finger1.clientY - finger2.clientY))
        }

        function onDoubleClick(e) {
            var offset = getOffsetXY(e);
            smoothZoom(offset.x, offset.y, zoomDoubleClickSpeed);

            e.preventDefault();
            e.stopPropagation();
        }

        function onMouseDown(e) {
            if (touchInProgress) {
                // modern browsers will fire mousedown for touch events too
                // we do not want this: touch is handled separately.
                e.stopPropagation();
                return false
            }
            // for IE, left click == 1
            // for Firefox, left click == 0
            var isLeftButton = ((e.button === 1 && window.event !== null) || e.button === 0);
            if (!isLeftButton) { return }

            var offset = getOffsetXY(e);
            var point = transformToScreen(offset.x, offset.y);
            mouseX = point.x;
            mouseY = point.y;

            // We need to listen on document itself, since mouse can go outside of the
            // window, and we will loose it
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            preventTextSelection.capture(e.target || e.srcElement);

            return false
        }

        function onMouseMove(e) {
            // no need to worry about mouse events when touch is happening
            if (touchInProgress) { return }

            triggerPanStart();

            var offset = getOffsetXY(e);
            var point = transformToScreen(offset.x, offset.y);
            var dx = point.x - mouseX;
            var dy = point.y - mouseY;

            mouseX = point.x;
            mouseY = point.y;

            internalMoveBy(dx, dy);
        }

        function onMouseUp() {
            preventTextSelection.release();
            triggerPanEnd();
            releaseDocumentMouse();
        }

        function releaseDocumentMouse() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            panstartFired = false;
        }

        function releaseTouches() {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('touchcancel', handleTouchEnd);
            panstartFired = false;
            multitouch = false;
        }

        function onMouseWheel(e) {
            // if client does not want to handle this event - just ignore the call
            if (beforeWheel(e)) { return }

            smoothScroll.cancel();

            var scaleMultiplier = getScaleMultiplier(e.deltaY);

            if (scaleMultiplier !== 1) {
                var offset = getOffsetXY(e);
                publicZoomTo(offset.x, offset.y, scaleMultiplier);
                e.preventDefault();
            }
        }

        function getOffsetXY(e) {
            var offsetX = e.offsetX;
            var offsetY = e.offsetY;
            if (typeof offsetX === 'undefined') {
                var rect = e.target.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
            }

            return { x: offsetX, y: offsetY };
        }

        function getTouchOffsetXY(touch, el) {
            var rect = el.getBoundingClientRect();
            var offsetX = touch.clientX - rect.left;
            var offsetY = touch.clientY - rect.top;

            return { x: offsetX, y: offsetY };
        }

        function smoothZoom(clientX, clientY, scaleMultiplier) {
            var fromValue = transform$$1.scale;
            var from = { scale: fromValue };
            var to = { scale: scaleMultiplier * fromValue };

            smoothScroll.cancel();
            cancelZoomAnimation();

            // TODO: should consolidate this and publicZoomTo
            triggerEvent('zoom');

            zoomToAnimation = amator(from, to, {
                step: function(v) {
                    zoomAbs(clientX, clientY, v.scale);
                }
            });
        }

        function publicZoomTo(clientX, clientY, scaleMultiplier) {
            smoothScroll.cancel();
            cancelZoomAnimation();
            return zoomByRatio(clientX, clientY, scaleMultiplier)
        }

        function cancelZoomAnimation() {
            if (zoomToAnimation) {
                zoomToAnimation.cancel();
                zoomToAnimation = null;
            }
        }

        function getScaleMultiplier(delta) {
            var scaleMultiplier = 1;
            if (delta > 0) { // zoom out
                scaleMultiplier = (1 - speed);
            } else if (delta < 0) { // zoom in
                scaleMultiplier = (1 + speed);
            }

            return scaleMultiplier
        }

        function triggerPanStart() {
            if (!panstartFired) {
                triggerEvent('panstart');
                panstartFired = true;
                smoothScroll.start();
            }
        }

        function triggerPanEnd() {
            if (panstartFired) {
                // we should never run smooth scrolling if it was multitouch (pinch zoom animation):
                if (!multitouch) { smoothScroll.stop(); }
                triggerEvent('panend');
            }
        }

        function triggerEvent(name) {
            var event = createEvent_1(name);
            domElement.dispatchEvent(event);
        }
    }

    function noop() {}

    function validateBounds(bounds) {
        var boundsType = typeof bounds;
        if (boundsType === 'undefined' || boundsType === 'boolean') { return } // this is okay
        // otherwise need to be more thorough:
        var validBounds = isNumber(bounds.left) && isNumber(bounds.top) &&
            isNumber(bounds.bottom) && isNumber(bounds.right);

        if (!validBounds) {
            throw new Error('Bounds object is not valid. It can be: ' +
                'undefined, boolean (true|false) or an object {left, top, right, bottom}')
        }
    }

    function isNumber(x) {
        return Number.isFinite(x)
    }

    // IE 11 does not support isNaN:
    function isNaN(value) {
        if (Number.isNaN) {
            return Number.isNaN(value)
        }

        return value !== value
    }

    function rigidScroll() {
        return {
            start: noop,
            stop: noop,
            cancel: noop
        }
    }

    var ngraph_events$1 = function(subject) {
        validateSubject(subject);

        var eventsStorage = createEventsStorage(subject);
        subject.on = eventsStorage.on;
        subject.off = eventsStorage.off;
        subject.fire = eventsStorage.fire;
        return subject;
    };

    function createEventsStorage(subject) {
        // Store all event listeners to this hash. Key is event name, value is array
        // of callback records.
        //
        // A callback record consists of callback function and its optional context:
        // { 'eventName' => [{callback: function, ctx: object}] }
        var registeredEvents = Object.create(null);

        return {
            on: function(eventName, callback, ctx) {
                if (typeof callback !== 'function') {
                    throw new Error('callback is expected to be a function');
                }
                var handlers = registeredEvents[eventName];
                if (!handlers) {
                    handlers = registeredEvents[eventName] = [];
                }
                handlers.push({ callback: callback, ctx: ctx });

                return subject;
            },

            off: function(eventName, callback) {
                var wantToRemoveAll = (typeof eventName === 'undefined');
                if (wantToRemoveAll) {
                    // Killing old events storage should be enough in this case:
                    registeredEvents = Object.create(null);
                    return subject;
                }

                if (registeredEvents[eventName]) {
                    var deleteAllCallbacksForEvent = (typeof callback !== 'function');
                    if (deleteAllCallbacksForEvent) {
                        delete registeredEvents[eventName];
                    } else {
                        var callbacks = registeredEvents[eventName];
                        for (var i = 0; i < callbacks.length; ++i) {
                            if (callbacks[i].callback === callback) {
                                callbacks.splice(i, 1);
                            }
                        }
                    }
                }

                return subject;
            },

            fire: function(eventName) {
                var callbacks = registeredEvents[eventName];
                if (!callbacks) {
                    return subject;
                }

                var fireArguments;
                if (arguments.length > 1) {
                    fireArguments = Array.prototype.splice.call(arguments, 1);
                }
                for (var i = 0; i < callbacks.length; ++i) {
                    var callbackInfo = callbacks[i];
                    callbackInfo.callback.apply(callbackInfo.ctx, fireArguments);
                }

                return subject;
            }
        };
    }

    function validateSubject(subject) {
        if (!subject) {
            throw new Error('Eventify cannot use falsy object as events subject');
        }
        var reservedWords = ['on', 'fire', 'off'];
        for (var i = 0; i < reservedWords.length; ++i) {
            if (subject.hasOwnProperty(reservedWords[i])) {
                throw new Error("Subject cannot be eventified, since it already has property '" + reservedWords[i] + "'");
            }
        }
    }

    var Transform$2 = function Transform(scale, dx, dy) {
        scale = scale || 1;
        dx = dx || 0;
        dy = dy || 0;
        this._array = [
            scale, 0, 0, 0,
            0, scale, 0, 0,
            0, 0, 1, 0,
            dx, dy, 0, 1
        ];
    };

    var prototypeAccessors = { scale: {}, dx: {}, dy: {} };

    Transform$2.prototype.multiply = function multiply(a, b) {
        var scale = a.scale * b.scale;
        var dx = a.scale * b.dx + a.dx;
        var dy = a.scale * b.dy + a.dy;

        this.scale = scale;
        this.dx = dx;
        this.dy = dy;

        return this;
    };

    prototypeAccessors.scale.get = function() {
        return this._array[0];
    };

    prototypeAccessors.dx.get = function() {
        return this._array[12];
    };

    prototypeAccessors.dy.get = function() {
        return this._array[13];
    };

    prototypeAccessors.dx.set = function(newDx) {
        this._array[12] = newDx;
    };

    prototypeAccessors.dy.set = function(newDy) {
        this._array[13] = newDy;
    };

    prototypeAccessors.scale.set = function(newScale) {
        this._array[0] = newScale;
        this._array[5] = newScale;
    };

    Transform$2.prototype.copyTo = function copyTo(dst) {
        copyArray(this._array, dst._array);
        return this;
    };

    Transform$2.prototype.getArray = function getArray() {
        return this._array;
    };

    Object.defineProperties(Transform$2.prototype, prototypeAccessors);

    function copyArray(from, to) {
        if (from.length !== to.length) {
            throw new Error('Array length mismatch');
        }

        for (var i = 0; i < from.length; ++i) {
            to[i] = from[i];
        }
    }

    /**
     * represents a single element in the scene tree
     */
    var Element = function Element() {
        this.children = [];
        this.transform = new Transform$2();

        // Stores transformation to the "world" coordinates. If this element has
        // no parent, this object is equal to `this.transform`
        this.worldTransform = new Transform$2();
        this.worldTransformNeedsUpdate = true;
        this.type = 'Element';
        this.scene = null;
    };

    Element.prototype.appendChild = function appendChild(child, sendToBack) {
        child.parent = this;
        if (sendToBack) {
            // back of z-index
            this.children.unshift(child);
        } else {
            this.children.push(child);
        }
        if (child.bindScene) {
            child.bindScene(this.scene);
        }

        if (this.scene) { this.scene.renderFrame(); }
    };

    Element.prototype.bindScene = function bindScene(scene) {
        this.scene = scene;
    };

    Element.prototype.traverse = function traverse(enterCallback, exitCallback) {
        var this$1 = this;

        enterCallback(this);

        for (var i = 0; i < this.children.length; ++i) {
            var child = this$1.children[i];
            child.traverse(enterCallback, exitCallback);
        }

        if (exitCallback) { exitCallback(this); }
    };

    Element.prototype.removeChild = function removeChild(child) {
        // TODO: should this be faster?
        var childIdx = this.children.indexOf(child);
        if (childIdx > -1) {
            this.children.splice(childIdx, 1);
        }

        if (this.scene) { this.scene.renderFrame(); }
    };

    Element.prototype.updateWorldTransform = function updateWorldTransform(force) {
        if (this.worldTransformNeedsUpdate || force) {
            if (!this.parent) {
                this.transform.copyTo(this.worldTransform);
            } else {
                this.worldTransform.multiply(this.parent.worldTransform, this.transform);
            }

            this.worldTransformNeedsUpdate = false;
            force = true; // We have to update children now.
        }

        var wasDirty = force;

        var children = this.children;
        for (var i = 0; i < children.length; i++) {
            wasDirty = children[i].updateWorldTransform(force) || wasDirty;
        }

        return wasDirty;
    };

    Element.prototype.draw = function draw(gl, screen) {
        var this$1 = this;

        for (var i = 0; i < this.children.length; ++i) {
            var child = this$1.children[i];
            child.draw(gl, screen);
        }
    };

    Element.prototype.dispose = function dispose() {
        var this$1 = this;

        for (var i = 0; i < this.children.length; ++i) {
            var child = this$1.children[i];
            child.dispose();
        }
    };

    var config = {
        maxSingleTouchTime: 300, // ms
        singleTapDistanceSquared: 25 // within 5px we consider it as a single tap
    };

    function onClap$1(element, callback, ctx) {
        var touchStartTime = new Date();
        var startPos;

        element.addEventListener('click', invokeHandler);

        element.addEventListener('touchend', handleTouchEnd);
        element.addEventListener('touchstart', handleTouchStart);

        return disposePrevHandler;

        function handleTouchStart(e) {
            var touches = e.touches;

            if (touches.length === 1) {
                touchStartTime = new Date();
                startPos = {
                    x: e.touches[0].pageX,
                    y: e.touches[0].pageY
                };
            }
        }

        function handleTouchEnd(e) {
            // multitouch - ignore
            if (e.touches.length > 1) { return }

            // single touch - use time difference to determine if it was a touch or
            // a swipe
            var dt = new Date() - touchStartTime;

            // To long - ignore
            if (dt > config.maxSingleTouchTime) { return }
            var touch = e.changedTouches[0];

            var dx = touch.pageX - startPos.x;
            var dy = touch.pageY - startPos.y;

            if (dx * dx + dy * dy < config.singleTapDistanceSquared) {
                invokeHandler(touch);
            }
        }

        function disposePrevHandler() {
            element.removeEventListener('click', invokeHandler);
            element.removeEventListener('touchend', handleTouchEnd);
            element.removeEventListener('touchstart', handleTouchStart);
        }

        function invokeHandler(e) {
            callback.call(ctx, e);
        }
    }

    function makeScene$1(canvas, options) {
        var width;
        var height;
        var drawContext = { width: 0, height: 0 };
        var pixelRatio = window.devicePixelRatio;
        if (!options) { options = {}; }

        var wglContextOptions = options.wglContext;

        var gl = canvas.getContext('webgl', wglContextOptions) || canvas.getContext('experimental-webgl', wglContextOptions);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var frameToken = 0;
        var sceneRoot = new Element();
        updateCanvasSize();

        var api = ngraph_events$1({
            appendChild: appendChild,
            getSceneCoordinate: getSceneCoordinate,
            getClientCoordinate: getClientCoordinate,
            getTransform: getTransform,
            getRoot: getRoot,
            removeChild: removeChild,
            setViewBox: setViewBox,
            setClearColor: setClearColor,
            dispose: dispose,
            renderFrame: renderFrame,

            getPixelRatio: getPixelRatio,
            setPixelRatio: setPixelRatio
        });

        var wglController = wglPanZoom(canvas, sceneRoot, api);

        var panzoom$$1 = panzoom(canvas, {
            zoomSpeed: 0.025,
            controller: wglController
        });

        sceneRoot.bindScene(api);

        var disposeClick;
        listenToEvents();

        renderFrame();

        return api;

        function getPixelRatio() {
            return pixelRatio;
        }

        function setPixelRatio(newPixelRatio) {
            pixelRatio = newPixelRatio;
            updateCanvasSize();
        }

        function getRoot() {
            return sceneRoot;
        }

        function getTransform() {
            return sceneRoot.transform;
        }

        function setClearColor(r, g, b, a) {
            gl.clearColor(r, g, b, a);
        }

        function listenToEvents() {
            canvas.addEventListener('mousemove', onMouseMove);
            canvas.addEventListener('transform', onTransform);

            disposeClick = onClap$1(canvas, onMouseClick, this);

            window.addEventListener('resize', onResize, true);
        }

        function dispose() {
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('transform', onTransform);
            if (disposeClick) { disposeClick(); }

            window.removeEventListener('resize', onResize, true);

            panzoom$$1.dispose();
            sceneRoot.dispose();

            if (frameToken) {
                cancelAnimationFrame(frameToken);
                frameToken = 0;
            }
        }

        function onResize() {
            updateCanvasSize();
        }

        function updateCanvasSize() {
            if (options.size) {
                // Fixed size canvas doesn't update. We assume CSS does the scaling.
                width = canvas.width = options.size.width;
                height = canvas.height = options.size.height;
            } else {
                width = canvas.width = canvas.offsetWidth * pixelRatio;
                height = canvas.height = canvas.offsetHeight * pixelRatio;
            }

            gl.viewport(0, 0, width, height);

            drawContext.width = width;
            drawContext.height = height;
            sceneRoot.worldTransformNeedsUpdate = true;
            renderFrame();
        }

        function onTransform(e) {
            api.fire('transform', e);
        }

        function onMouseClick(e) {
            var p = getSceneCoordinate(e.clientX, e.clientY);
            api.fire('click', {
                originalEvent: e,
                sceneX: p.x,
                sceneY: p.y,
            });
        }

        function onMouseMove(e) {
            var p = getSceneCoordinate(e.clientX, e.clientY);
            api.fire('mousemove', {
                originalEvent: e,
                sceneX: p.x,
                sceneY: p.y,
            });
        }

        function getSceneCoordinate(clientX, clientY) {
            var t = sceneRoot.transform;
            var canvasX = clientX * pixelRatio;
            var canvasY = clientY * pixelRatio;
            var x = (canvasX - t.dx) / t.scale;
            var y = (canvasY - t.dy) / t.scale;

            return { x: x, y: y };
        }

        function getClientCoordinate(sceneX, sceneY) {
            var t = sceneRoot.transform;

            var x = (sceneX * t.scale + t.dx) / pixelRatio;
            var y = (sceneY * t.scale + t.dy) / pixelRatio;

            return { x: x, y: y };
        }

        function setViewBox(rect) {
            panzoom$$1.showRectangle(rect, {
                width: width,
                height: height
            });
            var newT = panzoom$$1.getTransform();
            wglController.applyTransform(newT);
        }

        function renderFrame() {
            if (!frameToken) { frameToken = requestAnimationFrame(frame); }
        }

        function frame() {
            gl.clear(gl.COLOR_BUFFER_BIT);
            drawContext.wasDirty = sceneRoot.updateWorldTransform();
            sceneRoot.draw(gl, drawContext);
            frameToken = 0;
        }

        function appendChild(child, sendToBack) {
            sceneRoot.appendChild(child, sendToBack);
        }

        function removeChild(child) {
            sceneRoot.removeChild(child);
        }

        function wglPanZoom(canvas, sceneRoot, scene) {
            var controller = {
                applyTransform: function applyTransform(newT) {
                    var transform = sceneRoot.transform;
                    var pixelRatio = scene.getPixelRatio();

                    transform.dx = newT.x * pixelRatio;
                    transform.dy = newT.y * pixelRatio;
                    transform.scale = newT.scale;
                    sceneRoot.worldTransformNeedsUpdate = true;
                    scene.renderFrame();
                },

                getOwner: function getOwner() {
                    return canvas
                }
            };

            if (options.size) {
                controller.getScreenCTM = customSizeCTM;
            }

            return controller;

            function customSizeCTM() {
                return {
                    a: (options.size.width / canvas.offsetWidth), //scale x
                    d: (options.size.height / canvas.offsetHeight), //scale y
                    e: 0,
                    f: 0
                }
            }
        }
    }

    var glUtils = {
        compile: compile,
        link: link,
        getLocations: getLocations,
        getAttributes: getAttributes,
        getUniforms: getUniforms,
        initBuffer: initBuffer
    };

    function compile(gl, type, shaderSrc) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, shaderSrc);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    function link(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program));
        }

        return program;
    }

    function getLocations(gl, program) {
        return {
            attributes: getAttributes(gl, program),
            uniforms: getUniforms(gl, program)
        }
    }

    function getAttributes(gl, program) {
        var attributes = Object.create(null);

        var numberOfAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (var i = 0; i < numberOfAttributes; ++i) {
            var name = gl.getActiveAttrib(program, i).name;
            attributes[name] = gl.getAttribLocation(program, name);
        }

        return attributes;
    }

    function getUniforms(gl, program) {
        var uniforms = Object.create(null);
        var numberOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (var i = 0; i < numberOfUniforms; ++i) {
            var name = gl.getActiveUniform(program, i).name;
            uniforms[name] = gl.getUniformLocation(program, name);
        }

        return uniforms;
    }

    function initBuffer(gl, data, elementsPerVertex, attribute) {
        var buffer = gl.createBuffer();
        if (!buffer) { throw new Error('Failed to create a buffer'); }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.vertexAttribPointer(attribute, elementsPerVertex, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribute);
    }

    var shaderGraph = {
        /**
         * Gets vertex shader code from a given array of shader graph nodes.
         */
        getVSCode: getVSCode
    };

    function getVSCode(nodes) {
        // We just generate shader code in multiple passes.
        var code = [];
        nodes.forEach(function(node) {
            if (node.globals) { code.push(node.globals()); }
        });
        code.push('void main() {');
        nodes.forEach(function(node) {
            if (node.mainBody) { code.push(node.mainBody()); }
        });
        code.push('}');

        return code.join('\n');
    }

    var panzoomVS = {
        globals: function globals() {
            return "\nattribute vec2 aPosition;\nuniform vec2 uScreenSize;\nuniform mat4 uTransform;\n";
        },
        mainBody: function mainBody() {
            return "\n  mat4 transformed = mat4(uTransform);\n\n  // Translate screen coordinates to webgl space\n  vec2 vv = 2.0 * uTransform[3].xy/uScreenSize;\n  transformed[3][0] = vv.x - 1.0;\n  transformed[3][1] = 1.0 - vv.y;\n  vec2 xy = 2.0 * aPosition/uScreenSize;\n  gl_Position = transformed * vec4(xy.x, -xy.y, 0.0, 1.0);\n"
        }
    };

    var pointVS = {
        globals: function globals() {
            return "\nattribute float aPointSize;\nattribute vec4 aColor;\nvarying vec4 vColor;\n";
        },
        mainBody: function mainBody() {
            return "\n  gl_PointSize = aPointSize * transformed[0][0];\n  vColor = aColor;\n";
        }
    };

    var vertexShaderSrc = shaderGraph.getVSCode([
        panzoomVS,
        pointVS
    ]);

    var fragmentShaderSrc = "\nprecision highp float;\nvarying vec4 vColor;\nuniform sampler2D texture;\n\nvoid main() {\n  vec4 tColor = texture2D( texture, gl_PointCoord );\n  gl_FragColor = vec4(vColor.rgb, tColor.a);\n  //gl_FragColor = vec4(vColor.rgb, 1.0);\n  // vec2 t = 2.0 * gl_PointCoord - 1.0;\n  // float a = 1.0 - pow(t.x, 2.0) - pow(t.y, 2.0);\n  // gl_FragColor = vec4(vColor.rgb, a);\n}\n";

    var vertexProgramCache = new Map(); // maps from GL context to program

    function makePointsProgram$1(gl, data) {
        var vertexProgram = vertexProgramCache.get(gl);
        if (!vertexProgram) {
            var vertexShader = glUtils.compile(gl, gl.VERTEX_SHADER, vertexShaderSrc);
            var fragmentShader = glUtils.compile(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
            vertexProgram = glUtils.link(gl, vertexShader, fragmentShader);
            vertexProgramCache.set(gl, vertexProgram);
        }

        var locations = glUtils.getLocations(gl, vertexProgram);

        var buffer = gl.createBuffer();
        if (!buffer) { throw new Error('failed to create a nodesBuffer'); }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.DYNAMIC_DRAW);

        var pointTexture = createCircleTexture(gl);

        var api = {
            draw: draw,
            updateData: updateData,
            dispose: dispose
        };
        return api;

        function updateData(newData) {
            data = newData;
        }

        function dispose() {
            // For some reason disposing the buffer results in unbindable
            // buffer for the lines program (that is created after this scene is disposed).
            // gl.deleteBuffer(buffer);
            gl.deleteProgram(vertexProgram);
            gl.deleteTexture(pointTexture);
            vertexProgramCache.delete(gl);
        }

        function draw(transform, screen, count) {
            gl.useProgram(vertexProgram);

            var bpe = data.BYTES_PER_ELEMENT;

            if (transform) {
                gl.uniformMatrix4fv(locations.uniforms.uTransform, false, transform.getArray());
            }
            gl.uniform2f(locations.uniforms.uScreenSize, screen.width, screen.height);
            gl.bindTexture(gl.TEXTURE_2D, pointTexture);

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

            gl.vertexAttribPointer(locations.attributes.aPosition, 2, gl.FLOAT, false, bpe * 6, 0);
            gl.enableVertexAttribArray(locations.attributes.aPosition);

            gl.vertexAttribPointer(locations.attributes.aPointSize, 1, gl.FLOAT, false, bpe * 6, 2 * bpe);
            gl.enableVertexAttribArray(locations.attributes.aPointSize);

            gl.vertexAttribPointer(locations.attributes.aColor, 3, gl.FLOAT, false, bpe * 6, 3 * bpe);
            gl.enableVertexAttribArray(locations.attributes.aColor);
            gl.drawArrays(gl.POINTS, 0, count);
        }
    }

    function createCircleTexture(gl) {
        var pointTexture = gl.createTexture();
        if (!pointTexture) { throw new Error('Failed to create circle texture'); }
        gl.bindTexture(gl.TEXTURE_2D, pointTexture);

        var size = 64;
        var image = circle(size);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);

        return pointTexture;

        function circle(size) {
            var result = new Uint8Array(size * size * 4);
            var r = (size - 8) / 2;
            for (var row = 0; row < size; ++row) {
                var offset = row * size;
                for (var col = 0; col < size; ++col) {
                    var rgbaCoord = (offset + col) * 4;
                    var cy = row - r;
                    var cx = col - r;
                    var distToCenter = Math.sqrt(cx * cx + cy * cy);
                    if (distToCenter < r) {
                        var ratio = (1 - distToCenter / r);
                        result[rgbaCoord + 3] = ratio > 0.3 ? 0xff : 0xff * ratio;
                    } else {
                        result[rgbaCoord + 3] = 0x00;
                    }
                }
            }
            return blur(result, size)

            //return result
        }
    }

    function blur(src, size) {
        var result = new Uint8Array(size * size * 4);
        for (var row = 0; row < size; ++row) {
            for (var col = 0; col < size; ++col) {
                result[(row * size + col) * 4 + 3] = sample(row, col, 3, src, size);
            }
        }

        return result;

    }

    function sample(row, col, depth, src, size) {
        var avg = 0;
        var count = 0;
        for (var y = row - depth; y < row + depth; ++y) {
            if (y < 0 || y >= size) { continue; }
            for (var x = col - depth; x < col + depth; ++x) {
                if (x < 0 || x >= size) { continue; }

                avg += src[(y * size + x) * 4 + 3];
                count += 1;
            }
        }

        return avg / count;
    }

    var Color = function Color(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a === undefined ? 1 : a;
    };

    var PointAccessor = function PointAccessor(buffer, offset, color, data) {
        this.offset = offset;
        this.buffer = buffer;
        this.color = color || new Color(1, 1, 1, 1);
        if (data !== undefined) {
            this.data = data;
        }
    };

    var prototypeAccessors$1 = { x: {}, y: {} };

    prototypeAccessors$1.x.get = function() {
        return this.buffer[this.offset];
    };

    prototypeAccessors$1.y.get = function() {
        return this.buffer[this.offset + 1];
    };

    PointAccessor.prototype.update = function update(point, defaults) {
        var offset = this.offset;
        var points = this.buffer;

        points[offset + 0] = point.x;
        points[offset + 1] = point.y;
        if (point.size || defaults) {
            points[offset + 2] = typeof point.size === 'number' ? point.size : defaults.size;
        }

        this.setColor(this.color);
    };

    PointAccessor.prototype.setColor = function setColor(color) {
        this.color = color;
        // TODO: This is waste, we can store rgba in 32 bits, not in the 3 * 3 * 8 bits?
        this.buffer[this.offset + 3] = color.r;
        this.buffer[this.offset + 4] = color.g;
        this.buffer[this.offset + 5] = color.b;
    };

    Object.defineProperties(PointAccessor.prototype, prototypeAccessors$1);

    var ITEMS_PER_POINT = 6; // x, y, size, r, g, b

    var PointCollection = (function(Element$$1) {
        function PointCollection(capacity) {
            Element$$1.call(this);
            this.type = 'PointCollection';

            // TODO: Not sure I like this too much. But otherwise how can I track interactivity?
            this.pointsAccessor = [];

            this.capacity = capacity;
            this.pointsBuffer = new Float32Array(capacity * ITEMS_PER_POINT);
            this.count = 0;
            this._program = null;
            this.color = new Color(1, 1, 1, 1);
            this.size = 1;
        }

        if (Element$$1) PointCollection.__proto__ = Element$$1;
        PointCollection.prototype = Object.create(Element$$1 && Element$$1.prototype);
        PointCollection.prototype.constructor = PointCollection;

        PointCollection.prototype.draw = function draw(gl, screen) {
            if (!this._program) {
                this._program = makePointsProgram$1(gl, this.pointsBuffer);
            }

            this._program.draw(this.worldTransform, screen, this.count);
        };

        PointCollection.prototype.dispose = function dispose() {
            if (this._program) {
                this._program.dispose();
                this._program = null;
            }
        };

        PointCollection.prototype.add = function add(point, data) {
            if (!point) { throw new Error('Point is required'); }

            if (this.count >= this.capacity) {
                this._extendArray();
            }
            var pointsBuffer = this.pointsBuffer;
            var internalNodeId = this.count;
            var offset = internalNodeId * ITEMS_PER_POINT;
            var pointAccessor = new PointAccessor(pointsBuffer, offset, point.color || this.color, data);

            this.pointsAccessor.push(pointAccessor);

            pointAccessor.update(point, this);

            this.count += 1;
            return pointAccessor
        };

        PointCollection.prototype._extendArray = function _extendArray() {
            // This is because we would have to track every created point accessor
            // TODO: Whelp, a week older you thinks that we should be tracking the points
            // for interactivity... So, might as well implement this stuff. Remember anything
            // about premature optimization?
            throw new Error('Cannot extend array at the moment :(')
        };

        return PointCollection;
    }(Element));

    var Point = function Point(x, y, size) {
        if (Number.isNaN(x)) { throw new Error('x is not a number'); }
        if (Number.isNaN(y)) { throw new Error('y is not a number'); }

        this.x = x;
        this.y = y;
        this.color = new Color(255, 255, 255);

        this.size = Number.isFinite(size) ? size : 4;
    };

    var BaseLineCollection = (function(Element$$1) {
        function BaseLineCollection(capacity, itemsPerLine) {
            Element$$1.call(this);

            this.itemsPerLine = itemsPerLine;
            this.capacity = capacity;
            this.count = 0;
            this._program = null;
            this.color = new Color(1, 1, 1, 1);
            this.buffer = new Float32Array(capacity * this.itemsPerLine);
        }

        if (Element$$1) BaseLineCollection.__proto__ = Element$$1;
        BaseLineCollection.prototype = Object.create(Element$$1 && Element$$1.prototype);
        BaseLineCollection.prototype.constructor = BaseLineCollection;

        BaseLineCollection.prototype.draw = function draw(gl, screen) {
            if (!this._program) {
                this._program = this._makeProgram(gl);
            }
            var transform = this.worldTransform;

            this._program.draw(transform, this.color, screen);
        };

        BaseLineCollection.prototype._makeProgram = function _makeProgram() {
            throw new Error('Not implemented');
        };

        BaseLineCollection.prototype._addInternal = function _addInternal() {
            throw new Error('Not implemented');
        };

        BaseLineCollection.prototype.add = function add(line) {
            if (!line) { throw new Error('Line is required'); }

            if (this.count >= this.capacity) {
                this._extendArray();
            }

            var offset = this.count * this.itemsPerLine;
            var ui = this._addInternal(line, offset);

            this.count += 1;
            return ui;
        };

        BaseLineCollection.prototype.dispose = function dispose() {
            if (this._program) {
                this._program.dispose();
                this._program = null;
            }
        };

        BaseLineCollection.prototype._extendArray = function _extendArray() {
            // Every time we run out of space create new array twice bigger.
            var newCapacity = this.capacity * this.itemsPerLine * 2;
            var extendedArray = new Float32Array(newCapacity);
            if (this.buffer) {
                extendedArray.set(this.buffer);
            }

            this.buffer = extendedArray;
            this.capacity = newCapacity;
        };

        return BaseLineCollection;
    }(Element));

    var lineVSSrc = shaderGraph.getVSCode([
        panzoomVS
    ]);

    var lineFSSrc = "\nprecision highp float;\nuniform vec4 uColor;\n\nvoid main() {\n  gl_FragColor = uColor;\n}\n";

    // TODO: this needs to be in a separate file, with proper resource management
    var lineProgramCache = new Map(); // maps from GL context to program

    function makeLineProgram$1(gl, data, drawTriangles) {
        var lineProgram = lineProgramCache.get(gl);
        if (!lineProgram) {
            var lineVSShader = glUtils.compile(gl, gl.VERTEX_SHADER, lineVSSrc);
            var lineFSShader = glUtils.compile(gl, gl.FRAGMENT_SHADER, lineFSSrc);
            lineProgram = glUtils.link(gl, lineVSShader, lineFSShader);
            lineProgramCache.set(gl, lineProgram);
        }

        var locations = glUtils.getLocations(gl, lineProgram);

        var lineBuffer = gl.createBuffer();
        var bpe = data.BYTES_PER_ELEMENT;
        var drawType = drawTriangles ? gl.TRIANGLES : gl.LINES;
        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);

        var api = {
            draw: draw,
            dispose: dispose
        };

        return api;

        function dispose() {
            gl.deleteBuffer(lineBuffer);
            gl.deleteProgram(lineProgram);
            lineProgramCache.delete(gl);
        }

        function draw(transform, color, screen) {
            if (data.length === 0) { return; }

            gl.useProgram(lineProgram);

            gl.uniformMatrix4fv(locations.uniforms.uTransform, false, transform.getArray());
            gl.uniform2f(locations.uniforms.uScreenSize, screen.width, screen.height);
            gl.uniform4f(locations.uniforms.uColor, color.r, color.g, color.b, color.a);

            gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
            gl.enableVertexAttribArray(locations.attributes.aPosition);
            // TODO: Avoid buffering, if data hasn't changed?
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            gl.vertexAttribPointer(locations.attributes.aPosition, 2, gl.FLOAT, false, bpe * 2, 0);

            gl.drawArrays(drawType, 0, data.length / 2);
        }
    }

    var LineAccessor = function LineAccessor(buffer, offset) {
        this.offset = offset;
        this.buffer = buffer;
        this.width = 1;
    };

    LineAccessor.prototype.setWidth = function setWidth(width) {
        this.width = width;
    };

    LineAccessor.prototype.update = function update(from, to) {
        var buffer = this.buffer;
        var offset = this.offset;

        var dx = to.x - from.x;
        var dy = to.y - from.y;
        if (dx === 0) { dx = 1e-4; }
        if (dy === 0) { dy = 1e-4; }

        var norm = Math.sqrt(dx * dx + dy * dy);
        var u = dx / norm;
        var v = dy / norm;

        var width = this.width;
        var uw = width * u;
        var vw = width * v;
        var x0 = from.x + vw;
        var y0 = from.y - uw;
        var x1 = to.x + vw;
        var y1 = to.y - uw;
        var x2 = from.x - vw;
        var y2 = from.y + uw;
        var x3 = to.x - vw;
        var y3 = to.y + uw;

        // Start
        buffer[offset + 0] = x0;
        buffer[offset + 1] = y0;

        buffer[offset + 2] = x1;
        buffer[offset + 3] = y1;

        buffer[offset + 4] = x2;
        buffer[offset + 5] = y2;

        offset += 6;

        // End
        buffer[offset + 0] = x1;
        buffer[offset + 1] = y1;

        buffer[offset + 2] = x2;
        buffer[offset + 3] = y2;

        buffer[offset + 4] = x3;
        buffer[offset + 5] = y3;
        // buffer[offset + 0] = from.x
        // buffer[offset + 1] = from.y

        // buffer[offset + 2] = to.x
        // buffer[offset + 3] = to.y
    };

    /**
     * Lines have varying thickness. That comes at extra price: Each line
     * requires additional space in buffer, as it is rendered as triangles
     */
    var LineCollection = (function(BaseLineCollection$$1) {
        function LineCollection(capacity) {
            BaseLineCollection$$1.call(this, capacity, 12); // items per thick line
            this.type = 'LineCollection';
        }

        if (BaseLineCollection$$1) LineCollection.__proto__ = BaseLineCollection$$1;
        LineCollection.prototype = Object.create(BaseLineCollection$$1 && BaseLineCollection$$1.prototype);
        LineCollection.prototype.constructor = LineCollection;

        LineCollection.prototype._makeProgram = function _makeProgram(gl) {
            return makeLineProgram$1(gl, this.buffer, /* drawTriangles = */ true);
        };

        LineCollection.prototype._addInternal = function _addInternal(line, offset) {
            // TODO: width
            var lineUI = new LineAccessor(this.buffer, offset);
            lineUI.update(line.from, line.to);
            return lineUI;
        };

        return LineCollection;
    }(BaseLineCollection));

    /**
     * Wire accessor provides access to the buffer that stores wires.
     * 
     * Wires are "lines" with 1.0 width.
     */
    var WireAccessor = function WireAccessor(buffer, offset) {
        this.offset = offset;
        this.buffer = buffer;
    };

    WireAccessor.prototype.update = function update(from, to) {
        var buffer = this.buffer;
        var offset = this.offset;

        buffer[offset + 0] = from.x;
        buffer[offset + 1] = from.y;

        buffer[offset + 2] = to.x;
        buffer[offset + 3] = to.y;
    };

    /**
     * Unlike lines, wires do not have width, and are always 1px wide, regardless
     * of resolution.
     */
    var WireCollection = (function(BaseLineCollection$$1) {
        function WireCollection(capacity) {
            BaseLineCollection$$1.call(this, capacity, 4); // items per wire

            this.type = 'WireCollection';
        }

        if (BaseLineCollection$$1) WireCollection.__proto__ = BaseLineCollection$$1;
        WireCollection.prototype = Object.create(BaseLineCollection$$1 && BaseLineCollection$$1.prototype);
        WireCollection.prototype.constructor = WireCollection;

        WireCollection.prototype._makeProgram = function _makeProgram(gl) {
            return makeLineProgram$1(gl, this.buffer, /* drawTriangles = */ false);
        };

        WireCollection.prototype._addInternal = function _addInternal(line, offset) {
            var lineUI = new WireAccessor(this.buffer, offset);
            lineUI.update(line.from, line.to);
            return lineUI;
        };

        return WireCollection;
    }(BaseLineCollection));

    var lineProgramCache$1 = new Map();

    function makeLineProgram$2(gl, data, allowColors) {
        // TODO: Cache on allow colors too
        var lineProgram = lineProgramCache$1.get(gl);
        var itemsPerVertex = allowColors ? 3 : 2;
        if (!lineProgram) {
            var ref = getShadersCode(allowColors);
            var lineFSSrc = ref.lineFSSrc;
            var lineVSSrc = ref.lineVSSrc;
            var lineVSShader = glUtils.compile(gl, gl.VERTEX_SHADER, lineVSSrc);
            var lineFSShader = glUtils.compile(gl, gl.FRAGMENT_SHADER, lineFSSrc);
            lineProgram = glUtils.link(gl, lineVSShader, lineFSShader);
            lineProgramCache$1.set(gl, lineProgram);
        }

        var locations = glUtils.getLocations(gl, lineProgram);

        var lineBuffer = gl.createBuffer();

        var api = {
            draw: draw,
            dispose: dispose
        };

        return api;

        function dispose() {
            gl.deleteBuffer(lineBuffer);
            gl.deleteProgram(lineProgram);
            lineProgramCache$1.delete(gl);
        }

        function draw(transform, color, screen, startFrom, madeFullCircle) {
            if (data.length === 0) { return; }

            gl.useProgram(lineProgram);

            var transformArray = transform.getArray();
            gl.uniformMatrix4fv(locations.uniforms.uTransform, false, transformArray);
            gl.uniform2f(locations.uniforms.uScreenSize, screen.width, screen.height);
            gl.uniform4f(locations.uniforms.uColor, color.r, color.g, color.b, color.a);

            gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
            gl.enableVertexAttribArray(locations.attributes.aPosition);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
            if (allowColors) {
                gl.vertexAttribPointer(
                    locations.attributes.aPosition,
                    2,
                    gl.FLOAT,
                    false,
                    3 * 4,
                    0
                );
                gl.enableVertexAttribArray(locations.attributes.aColor);
                gl.vertexAttribPointer(
                    locations.attributes.aColor,
                    4,
                    gl.UNSIGNED_BYTE,
                    true,
                    3 * 4,
                    2 * 4
                );
            } else {
                gl.vertexAttribPointer(
                    locations.attributes.aPosition,
                    2,
                    gl.FLOAT,
                    false,
                    0,
                    0
                );
            }

            if (madeFullCircle) {
                var elementsCount = data.byteLength / 4 / itemsPerVertex - startFrom;
                gl.drawArrays(gl.LINE_STRIP, startFrom, elementsCount);
                if (startFrom > 1) { gl.drawArrays(gl.LINE_STRIP, 0, startFrom - 1); }
            } else {
                gl.drawArrays(gl.LINE_STRIP, 1, startFrom - 1);
            }
        }
    }

    function getShadersCode(allowColors) {
        var lineFSSrc = "precision mediump float;\nvarying vec4 vColor;\nvoid main() {\n  gl_FragColor = vColor;\n}\n";
        var lineVSSrc = shaderGraph.getVSCode([{
            globals: function globals() {
                return ("\n  attribute vec2 aPosition;\n  varying vec4 vColor;\n  " + (allowColors ? 'attribute vec4 aColor;' : '') + "\n  uniform vec4 uColor;\n  uniform vec2 uScreenSize;\n  uniform mat4 uTransform;\n");
            },
            mainBody: function mainBody() {
                return ("\n  mat4 transformed = mat4(uTransform);\n\n  // Translate screen coordinates to webgl space\n  vec2 vv = 2.0 * uTransform[3].xy/uScreenSize;\n  transformed[3][0] = vv.x - 1.0;\n  transformed[3][1] = 1.0 - vv.y;\n  vec2 xy = 2.0 * aPosition.xy/uScreenSize;\n  gl_Position = transformed * vec4(xy.x, -xy.y, 0.0, 1.0);\n  vColor = " + (allowColors ? 'aColor.abgr' : 'uColor') + ";\n");
            }
        }]);
        return { lineVSSrc: lineVSSrc, lineFSSrc: lineFSSrc };
    }

    var LineStripCollection = (function(Element$$1) {
        function LineStripCollection(capacity, allowColors) {
            if (allowColors === void 0) allowColors = false;

            Element$$1.call(this);

            var bytesPerElement = 4;
            this.drawCount = 0;
            this.madeFullCircle = false;

            this.allowColors = allowColors;
            this.itemsPerLine = allowColors ? 2 + 1 : 2;
            this.capacity = capacity;
            this.nextElementIndex = 1;
            this._program = null;
            this.color = new Color(1, 1, 1, 1);
            this.buffer = new ArrayBuffer((capacity + 1) * this.itemsPerLine * bytesPerElement);
            this.positions = new Float32Array(this.buffer);
            if (allowColors) {
                this.colors = new Uint32Array(this.buffer);
            }
        }

        if (Element$$1) LineStripCollection.__proto__ = Element$$1;
        LineStripCollection.prototype = Object.create(Element$$1 && Element$$1.prototype);
        LineStripCollection.prototype.constructor = LineStripCollection;

        LineStripCollection.prototype.draw = function draw(gl, screen) {
            if (!this._program) {
                this._program = makeLineProgram$2(gl, this.buffer, this.allowColors);
            }
            var transform = this.worldTransform;

            this._program.draw(transform, this.color, screen, this.nextElementIndex, this.madeFullCircle);
        };

        LineStripCollection.prototype.add = function add(x, y, color) {
            var offset = this.nextElementIndex * this.itemsPerLine;
            var positions = this.positions;
            positions[offset] = x;
            positions[offset + 1] = y;

            if (this.allowColors) {
                this.colors[offset + 2] = color === undefined ? 0 : color;
            }
            this.nextElementIndex += 1;
            this.drawCount += 1;

            if (this.nextElementIndex > this.capacity) {
                this.nextElementIndex = 1;
                positions[0] = x;
                positions[0 + 1] = y;
                if (this.allowColors) {
                    this.colors[2] = this.colors[offset + 2];
                }
                this.madeFullCircle = true;
            }
        };

        LineStripCollection.prototype.dispose = function dispose() {
            if (this._program) {
                this._program.dispose();
                this._program = null;
            }
        };

        return LineStripCollection;
    }(Element));

    function isWebGLEnabled$1(canvas) {
        try {
            if (!window.WebGLRenderingContext) { return false; }
            if (!canvas) { canvas = document.createElement('canvas'); }
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }

    exports.scene = makeScene$1;
    exports.PointCollection = PointCollection;
    exports.Point = Point;
    exports.LineCollection = LineCollection;
    exports.WireCollection = WireCollection;
    exports.LineStripCollection = LineStripCollection;
    exports.Element = Element;
    exports.isWebGLEnabled = isWebGLEnabled$1;
    exports.utils = glUtils;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}]},{},[2]);
