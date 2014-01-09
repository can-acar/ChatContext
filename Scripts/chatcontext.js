(function ($, window, client) {

    window.hubReady = false;
    var tryingToReconnect = false;
    if (!window.hubReady) {
        window.hubReady = $.connection.hub.start();
    }

    window.hubReady.done(function (params) {

        var isAuthenticated = $("body").data("isauthenticated");
        var ClientMeta = $("body").data("clientinfo");


        if (isAuthenticated === "True") {

            client.server.join(JSON.stringify(ClientMeta)).done(function (response) {
                ChatContext.init(params, client, response);
            });

        }
    });

    $.connection.hub.disconnected(function () {
        if (tryingToReconnect) {

            client.server.GetOut();
            $.connection.hub.stop();

        }
    }
    )


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