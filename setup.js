var exec = require('child_process').exec;
var sysPath = require('path');
var fs = require('fs');

// Cross-platform node.js postinstall & test script for coffeescript projects.

var mode = process.argv[2];

var fsExists = fs.exists || sysPath.exists;

var getBinaryPath = function(binary) {
  return sysPath.join('node_modules', '.bin', binary);
};

var execute = function(path, params, callback) {
  if (callback == null) callback = function() {};
  var command = 'node ' + path + ' ' + params;
  console.log('Executing', command);
  exec(command, function(error, stdout, stderr) {
    if (error != null) return process.stderr.write(stderr.toString());
    console.log(stdout.toString());
  });
};

var togglePostinstall = function(add) {
  var pkg = require('./package.json');

  if (add) {
    if (!pkg.scripts) pkg.scripts = {};
    pkg.scripts.postinstall = 'node setup.js test';
  } else if (pkg.scripts && pkg.scripts.postinstall) {
    delete pkg.scripts.postinstall;
  }

  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
};

switch (mode) {
  // Remove `.postinstall` script to prevent stupid npm bugs.
  case 'prepublish':
    togglePostinstall(false);
    execute(getBinaryPath('coffee'), '-o lib/ src/');
    break;

  // Bring back `.postinstall` script.
  case 'postpublish':
    togglePostinstall(true);
    break;

  // Compile coffeescript for git users.
  case 'postinstall':
    fsExists(sysPath.join(__dirname, 'lib'), function(exists) {
      if (exists) return;
      execute(getBinaryPath('coffee'), '-o lib/ src/');
    });
    break;

  // Run tests.
  case 'test':
      execute(
        getBinaryPath('mocha'),
        '--compilers coffee:coffee-script/register --require test/common.js --colors'
      );
    break;
}
