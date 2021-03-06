module.exports = {
  stub: function(cozyHandler, options){
    if (!options.hostname) {
      options.hostname = 'localhost';
    }
    if (!options.port) {
      options.port = 8080;
    }
    if (!options.getPort) {
      var basePort = options.port;
      options.getPort = function(){
        return ++basePort;
      };
    }
    cozyHandler.start(options, function(appErr, app, server){
      if (appErr) {
        console.error(appErr.stack);
      }
      console.log('http://' + options.hostname + ':' + options.port + '/');
      console.log('ready!');

      var done = function(){
        /*eslint-disable */
        process.exit();
        /*eslint-enable */
      };

      process.on('uncaughtException', function(err){
        if (err) {
          console.error(err.stack);
        }
        server.close();
        cozyHandler.stop(done);
      });

      process.on('SIGINT', function(){
        server.close();
        cozyHandler.stop(done);
      });
    });
  }
};
