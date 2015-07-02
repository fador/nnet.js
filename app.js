/**
 * Created with IntelliJ IDEA.
 * User: Fador
 * Date: 1.7.2015
 * Time: 2:22
 */

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
//var out = net.propagate(input_test);

//console.log(out);
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
  if(new_target < 0.05) proper = 1;

  // Output current target error
  count++;
  if(!(count % 1000)) console.log(last_target);
}

console.log(last_target);

var almost_three = [
    0, 1, 1, 1, 0,
    1, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    0, 1, 1, 1, 0,
    0, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    0, 1, 1, 1, 0,
  ];

// print output for each test
for(var i = 0; i < 10; i++) {
  var out = net.propagate(input_testset[i]);
  console.log(out);
}





