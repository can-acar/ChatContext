$(function () {

    var clientHub = $.connection.client;

    window.hubReady = false;
    var tryingToReconnect = false;
    if (!window.hubReady) {
        window.hubReady = $.connection.hub.start({ transport: 'longPolling' });
    }
    var isAuthenticated = $("body").data("isauthenticated");


    window.hubReady.done(function (params) {
        if (isAuthenticated === "True") {
            var ClientMeta = $("body").data("clientinfo");

            clientHub.server.join(JSON.stringify(ClientMeta)).done(function (response) {

                chat.init(params, clientHub, response);

            }).fail(function () {
                alert("connection not found");

            });
        }

    }).fail(function () {
        alert("connection not found");

    });

    $.connection.hub.reconnecting(function () {
        tryingToReconnect = true;
    });

    $.connection.hub.reconnected(function () {
        tryingToReconnect = false;
    });


    $.connection.hub.disconnected(function () {
        if (tryingToReconnect) {

            clientHub.server.getOut();
            $.connection.hub.stop();

        }
    });
    clientHub.client.stopClient = function () {
        $.connection.hub.stop();
    };


    clientHub.client.sendMessage = function (messageText) {
        chat.showMessage(messageText);
    };


    clientHub.client.isTyping = function (userID) {
        chat.isTyping(userID);
    };



    function ChatContext() {
        var self = this;
        self.$window = null;
        self.$windowsContent = null;
        self.$textArea = null;


    }

    ChatContext.prototype = {
        init: function (params, hub, done) {
            var self = this;
            self.Hub = hub;
            self.UserID = done.ID;
            self.UserName = done.de;
            self.UserStatus = (done.status == 1) ? "online" : "offline";
            self.$window = $('.message-board');
            self.$windowContent = self.$window.find('.content');
            self.$textArea = $(".textareagrow");
            self.$textArea.keypress(function (e) {

                if (self.$sendTypingSignalTimeout == undefined) {
                    self.$sendTypingSignalTimeout = setTimeout(function () {
                        self.$sendTypingSignalTimeout = undefined;
                    }, 3000);
                    self.sendTypingSignal();
                }
                if (e.which === 13) {
                    e.preventDefault();
                    if ($(this).val()) {
                        self.sendMessage($(this).val());
                        $(this).val('');
                    }
                }
                textGrow();
            });

            var textGrow = function () {

                var $textContent = self.$textArea.closest(self.$textArea);
                self.$textArea.css({ 'height': '0', 'padding': '0' });
                self.$textArea.css({ 'height': self.$textArea[0].scrollHeight });
                self.$textArea.scrollTop(self.$textArea[0].scrollHeight);
                $textContent.css({ "height": self.$textArea[0].scrollHeight });
                $textContent.scrollTop(self.$textArea[0].scrollHeight);
                console.log(self.$textArea[0].scrollHeight);
            }

        },

        sendMessage: function (messageText) {
            var self = this;
            self.$message = '<div class="message clearfix">' +
                '<div class="user-block thumbnail  fright left "><img class="media-object" src="http://critterapp.gopagoda.com/img/user.jpg" /></div>' +
                '<div class="popover fade in fright left">' +
                '<div class="popover-content">' +
                '<div class="triangle"></div>' +
                      messageText +
                '</div></div></div>';
            $(self.$message).appendTo(self.$windowContent);
            self.$windowContent.scrollTop(self.$windowContent[0].scrollHeight);
            self.Hub.server.sendMessage(messageText, self.UserID);
        },
        showMessage: function (message) {
            var self = this;
            self.removeTypingSignal();
            self.$message = '<div class="message clearfix">' +
                 '<div class="user-block thumbnail  fleft right"><img class="media-object" src="http://critterapp.gopagoda.com/img/user.jpg" /></div>' +
                 '<div class="popover fade in fleft right">' +
                 '<div class="popover-content">' +
                 '<div class="triangle"></div>' +
                       message +
                 '</div></div></div>';
            $(self.$message).appendTo(self.$windowContent);
            self.$windowContent.scrollTop(self.$windowContent[0].scrollHeight);
        },
        showTypingSignal: function (UserId) {
            var self = this;

            if (self.$typingSignal)
                $(self.$windowContent).find('.typing').remove();
            self.$typingSignal = '<div class="message clearfix typing ">' +
                '<div class="user-block thumbnail fleft right"><img class="media-object" src="http://critterapp.gopagoda.com/img/user.jpg" alt="admin" title="admin"/></div>' +
                '<div class="popover fade in fleft right">' +
                '<div class="popover-content">' +
                '<div class="triangle"></div><img class="media-object" src="img/typing.gif" style="   vertical-align: bottom;margin-top: 10px;"/></div></div></div>';


            self.$windowContent.append(self.$typingSignal);
            self.$windowContent.scrollTop(self.$windowContent[0].scrollHeight);

            if (self.typingSignalTimeout)
                clearTimeout(self.typingSignalTimeout);
            self.typingSignalTimeout = setTimeout(function () {
                self.removeTypingSignal();
            }, 5000);

        },
        removeTypingSignal: function () {


            var self = this;

            if (self.$typingSignal)
                $(self.$windowContent).find('.typing').remove();
            if (self.typingSignalTimeout)
                clearTimeout(self.typingSignalTimeout);
        },
        isTyping: function (userID) {
            var self = this;
            self.showTypingSignal(userID);
        },
        sendTypingSignal: function () {
            var self = this;

            self.Hub.server.sendTypingSignal(self.UserID);
        }

    };
    var chat = new ChatContext();

});