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

var fs = require('fs');

var Network = require("./src/network");

var net = new Network();


var input_testset = [
  [
    0, 1, 1, 1, 0,
    1, 0, 0, 0, 1,
    1, 0, 0, 1, 1,
    1, 0, 1, 0, 1,
    1, 1, 0, 0, 1,
    1, 0, 0, 0, 1,
    0, 1, 1, 1, 0,
  ],
  [
    0, 0, 1, 0, 0,
    0, 1, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    1, 1, 1, 1, 1,
  ],
  [
    0, 1, 1, 1, 0,
    1, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    0, 0, 1, 1, 0,
    0, 1, 0, 0, 0,
    1, 0, 0, 0, 0,
    1, 1, 1, 1, 1,
  ],
  [
    0, 1, 1, 1, 0,
    1, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    0, 0, 1, 1, 0,
    0, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    0, 1, 1, 1, 0,
  ],
  [
    0, 0, 0, 1, 1,
    0, 0, 1, 0, 1,
    0, 1, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
  ],
  [
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 0,
    1, 1, 1, 1, 0,
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    0, 1, 1, 1, 0,
  ],
  [
    0, 0, 1, 1, 0,
    0, 1, 0, 0, 0,
    1, 0, 0, 0, 0,
    1, 1, 1, 1, 0,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    0, 1, 1, 1, 0,
  ],
  [
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 1, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
  ],
  [
    0, 1, 1, 1, 0,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    0, 1, 1, 1, 0,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    0, 1, 1, 1, 0,
  ],
  [
    0, 1, 1, 1, 0,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    0, 1, 1, 1, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 1, 0,
    0, 1, 1, 0, 0,
  ]
];
var target_testset = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
];

// Calculate single result difference against target
function calc_target(result, target) {
  var diff = 0;
  for(var i = 0; i < result.length; i++) {
    diff += Math.abs(result[i] - target[i]);
  }
  return diff*diff;
};

// Calculate the whole testset difference against target
function calc_testset(testnet, input_testset, target_testset) {
  var totaldiff = 0;
  for(var test = 0; test < input_testset.length; test++) {
    var out = testnet.propagate(input_testset[test]);
    totaldiff += calc_target(out, target_testset[test]);
  }
  return totaldiff;
};

console.log("Init network..");

// Init network with 35 inputs, 100 + 50 inner layers and 10 outputs
net.init([35, 100, 50, 10]);

console.log("Propagate..");

var proper = 0;
var count = 0;
// Calculate initial error to target
var last_target = calc_testset(net, input_testset, target_testset);
while(!proper) {
  // Tune amounts for two inner networks and output
  net.tune([0.1, 0.1, 0.1], 0.01);

  var new_target=0;
  // If the new tuned network is worse than the previous, restore previous
  new_target = calc_testset(net, input_testset, target_testset);

  if(last_target < new_target)  {net.restore(); }
  else {
    while(new_target <= last_target)
    {
      last_target = new_target;
      net.retune();
      new_target = calc_testset(net, input_testset, target_testset);
    }
    net.restore();
  }

  // Termination condition
  if(new_target < 0.01) proper = 1;

  // Output current target error
  count++;
  if(!(count % 1000)) console.log(last_target);

  // Make backup of the network on every 10 000 tunings
  if(!(count%10000)) fs.writeFileSync("net.backup.txt", net.save(),{ endoding: 'utf8', flags: 'w'});
}

console.log(last_target);

// Do a saving and loading test
fs.writeFileSync("net.backup_end.txt", net.save(),{ encoding: 'utf8', flags: 'w'});
var netData = fs.readFileSync("net.backup_end.txt",{ encoding: 'utf8', flags: 'w'});
net.load(netData);

// print output for each test
for(var i = 0; i < 10; i++) {
  var out = net.propagate(input_testset[i]);
  console.log(out);
}

// Catch interrupt and save network
process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  fs.writeFileSync("savedNet.txt", net.save(),{ endoding: 'utf8', flags: 'w'});
  process.exit();
});


