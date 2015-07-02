/**
 * Created with IntelliJ IDEA.
 * User: Fador
 * Date: 29.6.2015
 * Time: 20:35
 */

var Neuron = require('./neuron');

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

if (module) module.exports = Network;