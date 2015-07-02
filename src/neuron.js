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

function sigmoid(z) {
  return 1.0/(1.0+Math.pow(Math.E, -z));
}


function Neuron() {
  this.ID = 0;
  this.inputs = [];
  this.bias = 0.0;
  this.output = 0.1;
  this.weightChange = [];
  this.biasChange = 0;
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
