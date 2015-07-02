/*
 Copyright (c) 2015, Marko 'Fador' Viitanen
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var Neuron = require('./neuron');

var printf = require('util').format;

function Network() {
  this.layers = 0;

  this.nodeArray = [];
}


Network.prototype.init = function(layers) {
  this.layers = layers.length;
  this.nodeArray = new Array(this.layers);
  for(var layer = 0; layer < this.layers; layer++) {
    this.nodeArray[layer] = [];
    for(var node = 0; node < layers[layer]; node++) {
      var newNode = new Neuron();
      if(layer > 0) {
        for(var conn = 0; conn < layers[layer-1]; conn++) {
          newNode.connect(this.nodeArray[layer-1][conn], (Math.random()-0.5)*10);
        }
      }
      this.nodeArray[layer].push(newNode);
    }
  }
};

Network.prototype.tune = function(rates, biasRate) {
  for(var layer = 1; layer < this.layers; layer++) {
    for(var node = 0; node < this.nodeArray[layer].length; node++) {
      this.nodeArray[layer][node].weightChange = [];
      for(var conn = 0; conn < this.nodeArray[layer-1].length; conn++) {
        var change = (Math.random()-0.5)*rates[layer-1];
        this.nodeArray[layer][node].inputs[conn].weight += change;
        this.nodeArray[layer][node].weightChange[conn] = change;
      }

      var biasChange = (Math.random()-0.5)*biasRate;
      this.nodeArray[layer][node].biasChange = biasChange;
      this.nodeArray[layer][node].bias += biasChange;
    }
  }
};

Network.prototype.retune = function() {
  for(var layer = 1; layer < this.layers; layer++) {
    for(var node = 0; node < this.nodeArray[layer].length; node++) {
      for(var conn = 0; conn < this.nodeArray[layer-1].length; conn++) {
        var change = this.nodeArray[layer][node].weightChange[conn];
        this.nodeArray[layer][node].inputs[conn].weight += change;
      }
      this.nodeArray[layer][node].bias += this.nodeArray[layer][node].biasChange;
    }
  }
};

Network.prototype.restore = function() {
  for(var layer = 1; layer < this.layers; layer++) {
    for(var node = 0; node < this.nodeArray[layer].length; node++) {
      for(var conn = 0; conn < this.nodeArray[layer-1].length; conn++) {
        var change = this.nodeArray[layer][node].weightChange[conn];
        this.nodeArray[layer][node].inputs[conn].weight -= change;
      }
      this.nodeArray[layer][node].bias -= this.nodeArray[layer][node].biasChange;
    }
  }
};


Network.prototype.propagate = function(input) {

  // Init input vector
  for(var node = 0; node < this.nodeArray[0].length; node++) {
    this.nodeArray[0][node].output = input[node];
  }

  for(var layer = 1; layer < this.layers; layer++) {
    for(var node = 0; node < this.nodeArray[layer].length; node++) {
      this.nodeArray[layer][node].calculate();
    }
  }
  var out = [];
  for(var i = 0; i < this.nodeArray[this.layers-1].length; i++) {
    out.push(this.nodeArray[this.layers-1][i].output);
  }

  return out;
};

Network.prototype.save = function() {
  var out = "";
  var netsize = [];

  // Store network size on the first line
  for(var i = 0; i < this.nodeArray.length; i++) {
   netsize.push(this.nodeArray[i].length);
  }
  out += netsize.join(' ')+'\n';

  // Input network doesn't have anything to save
  // Start from the inner networks
  for(var layer = 1; layer < this.nodeArray.length; layer++) {
    for(var node = 0; node < this.nodeArray[layer].length; node++) {

      // Bias for each node
      out += this.nodeArray[layer][node].bias+'\n';

      var nodeConnections = [];

      for(var conn = 0; conn < this.nodeArray[layer][node].inputs.length; conn++) {
        nodeConnections.push(this.nodeArray[layer][node].inputs[conn].weight);
      }
      out += nodeConnections.join(' ')+'\n';
    }
    out += '\n';
  }


  return out;
};

Network.prototype.load = function(datain) {

  var lines = datain.split("\n");
  // Init input vector
  this.init(lines[0].split(' '));

  var curline = 1;

  for(var layer = 1; layer < this.nodeArray.length; layer++) {
    for(var node = 0; node < this.nodeArray[layer].length; node++) {

      // Bias for each node
      this.nodeArray[layer][node].bias = parseFloat(lines[curline++]);

      var weights = lines[curline++].split(' ');
      for(var conn = 0; conn < this.nodeArray[layer][node].inputs.length; conn++) {
        this.nodeArray[layer][node].inputs[conn].weight = parseFloat(weights[conn]);
      }
    }
    curline++;
  }
};

if (module) module.exports = Network;