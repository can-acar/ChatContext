(function ($, window, client) {

    window.hubReady = false;
    if (!window.hubReady) {
        window.hubReady = $.connection.hub.start();
    }
    window.hubReady.done(function (params) {
      
        var isAuthenticated = $("body").data("isauthenticated");
        var ClientMeta = $("body").data("clientinfo");
          
        console.log(isAuthenticated, ClientMeta);

        if (isAuthenticated === "True") {

            client.server.join(JSON.stringify(ClientMeta)).done(function (response) {
                ChatContext.init(params, client, response);
            });

        }
    });


    var ChatContext = {
        init: function (params, client, done) {
            var _this = this;
            this.client = client;
            
            console.log(arguments);

        },
        sendMessage: function () {
            this.client.sendMessage(text).done(function (message) {
                
            })
        }

    };

})(jQuery, window, $.connection.client);