

function sigmoid(z) {
  return 1.0/(1.0+Math.pow(Math.E, -z));
}


function Neuron() {
  this.ID = 0;
  this.inputs = [];
  this.bias = 0.0;
  this.output = 0.1;
  this.weightChange = [];
}

Neuron.prototype.calculate = function() {

  this.output = 0;
  for (var i = 0; i < this.inputs.length; i++) {
    this.output += this.inputs[i].neuron.output * this.inputs[i].weight;
  }
  this.output += this.bias;
  this.output = sigmoid(this.output);
  return this.output;
};

Neuron.prototype.connect = function(node, weight) {
  this.inputs.push({neuron: node, weight: weight});
};

if (module) module.exports = Neuron;
