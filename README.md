nnet.js
=============

Simple Neural Network implementation in pure JavaScript

The license is permissive BSD, check LICENSE file

### Usage example

Include the Network `var Network = require("./src/network")`

Create a new net `var net = new Network()`

Initialize a simple network with 10 inputs, internal layer with 10 neurons and 10 outputs `net.init([10, 10, 10])`

Currently the only option for learning is randomized tuning.
Tune the net until it's ready, tune function take two parameters: an array for each layer minus the input and bias.
These values define the randomized tuning rate.
`net.tune([0.1, 0.1], 0.01)`

If the tuning makes things worse, restore to previous state and try again `net.restore()`

The Network can be saved and loaded with `var netData = net.save()` `net.load(netData)`

