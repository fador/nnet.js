/**
 * Created with IntelliJ IDEA.
 * User: Fador
 * Date: 1.7.2015
 * Time: 2:22
 */

var Network = require("./src/network");

var net = new Network();


var input_test = [
  0, 0, 1, 1, 0, 0,
  0, 1, 1, 1, 0, 0,
  1, 1, 1, 1, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 1, 0,
];


function calc_target(result, target) {
  var diff = 0;
  for(var i = 0; i < result.length; i++) {
    diff += Math.abs(result[i] - target[i]);
  }
  return diff;
};

console.log("Init network..");
net.init([60, 15, 10]);

var target = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

console.log("Propagate..");
var out = net.propagate(input_test);

console.log(out);
var proper = 0;
var last_target = calc_target(out, target);
while(!proper) {
  net.tune([0.1, 0.1]);
  var out = net.propagate(input_test);
  if(out[0] >  0.7) {
    proper = 1;
    for (var i = 1; i < 10; i++) {
      if (out[i] > 0.3) {
        proper = 0;
        break;
      }
    }
  }
  var new_target = calc_target(out, target);
  if(last_target < new_target)  {net.restore(); }
  else {
    last_target = new_target;
  }

}
console.log(out);


