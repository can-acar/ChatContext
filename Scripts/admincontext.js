(function ($) {
    function ChatController() {
    };

    ChatController.prototype = {
        init: function (model) {
            var self = this;
            self.hub = $.connection.admin;

            self.hub.client.sendMessage = function (message) {
                model.client.sendMessage(message);
            };

            self.hub.client.isTyping = function (User) {
                model.client.isTyping(User);
            };

            self.hub.client.getBodyList = function (UserList) {
                model.client.getBodyList(UserList);
            };


            if (!window.hubReady)
                window.hubReady = $.connection.hub.start();

            window.hubReady.done(function () {
                model.onReady();
            });

            self.server = new Object();

            self.server.sendMessage = function (UserId, messageText, done) {
                self.hub.server.sendMessage(UserId, messageText).done(function (result) {
                    if (done)
                        done(result);
                });
            };

            self.server.isTyping = function (UserId, done) {
                self.server.hub.server.isTyping(UserId).done(function (result) {
                    if (done)
                        done(result);
                });
            };
            self.getMessageHistory = function (UserId, done) {
                self.server.hub.server.getMessageHistory(UserId).done(function (result) {
                    if (done)
                        done(result);
                });
            };
            self.server.getBodyList = function (done) {
                self.hub.server.getBodyList().done(function (result) {
                    if (done)
                        done(result);
                });
            }
        }

    };
    function ChatView(controller, model) {
        var self = this;

        self.$el = null;
        self.$container = null;
        self.$bodyList = null;
        self.$bodyListContent = null;
        self.$window = null;
        self.$windowTitle = null;
        self.$windowContent = null;
        self.$windowInnerContent = null;
        self.$textArea = null;
        self.$controller = controller;
        self.$model = model;
        model.$view = self;

    };
    ChatView.prototype = {
        init: function () {


            var self = this;

            if (!$.Containers)
                $.Containers = new Array();

            self.$container = $(".container");
            self.$bodyList = $(".body-list");
            self.$bodyListContent = self.$bodyList.children().find(".content");
            self.ToggleState = 'maximized';
            self.$window = $('\
        <div class="message-board" id="">\
                    <div class="area clearfix">\
                        <div class="area-header clearfix">\
                            <div class="buttonwrapper fright">\
                                <a class="toggle button btn btn-default btn-xs pull-left"><span class="glyphicon glyphicon-minus"></span></a>\
                                <a class="close button btn btn-default btn-xs"><span class="glyphicon glyphicon-remove"></span></a>\
                            </div>\
                            <h4 class="area-title"></h4>\
                        </div>\
                        <div class="area-body">\
                            <div class="content  scrollable maximized">\
                            </div>\
                        </div>\
                        <div class="area-footer">\
                            <div class="text-content">\
                                <textarea class="textareagrow" id="textarea"></textarea>\
                            </div>\
                        </div>\
                    </div>\
                </div>');
            var $closeButton = self.$window.find('.close');
            var $toggleButton = self.$window.find('.toggle');
            self.$windowTitle = self.$window.find('.area-header');
            self.$windowContent = self.$window.find('.content');
            self.$textArea = self.$window.find('.textareagrow');

            $closeButton.click(function (e) {
                e.stopPropagation();
                for (var i = 0; i < $.Containers.length; i++) {
                    if ($.Containers[i] == this) {
                        $.Containers.splice(i, 1);
                        break;
                    }
                }
                $.organizeChatContainers();
                self.$window.remove();
            });

            if (self.ToggleState == "minimized")
                self.$windowContent.hide();

            $toggleButton.click(function () {

                self.$windowContent.toggle();
                if (self.$windowContent.is(':visible'))

                    self.$textArea.focus();

                if (self.$windowContent.is(':visible')) {
                    self.$window.removeClass("minimized");

                } else {

                    self.$window.addClass("minimized");
                };

            });



            self.$model.init(self);
            return self;
        },
        setTitle: function (title) {
            var self = this;
           
            $("h4[class=area-title]", self.$windowTitle).text(title);
        },
        setVisible: function (visible) {
            var self = this;
            if (visible)
                self.$window.show();
            else
                self.$window.hide();
        },
        getToggleState: function () {
            var self = this;
            return self.$windowContent.is(":visible") ? "maximized" : "minimized";
        },
        setToggleState: function (state) {
            var self = this;
            if (state == "minimized")
                self.$windowContent.hide();
            else if (state == "maximized")
                self.$windowContent.show();
        },
        PopUp: function () {
            var self = this;
            self.$window.appendTo(self.$container);
        }
    };

    $.organizeChatContainers = function () {

        var rightOffset = 10;
        var deltaOffset = 10;
        for (var i = 0; i < $.Containers.length; i++) {

            rightOffset += $.Containers[i].$window.outerWidth() + deltaOffset;
            $.Containers[i].$window.css("right", rightOffset);
        }
    };

    function ChatModel(controller, view) {

        var self = this;

        self.$chatWindow = new Object();

        self.$controller = controller;

        self.$view = view;


        self.createWindow = function (data, toggleState, focusState) {

            if (!toggleState) {
                toggleState = "maximized";
            }
            if (!focusState) {
                focusState = "focused";
            }
            self.$view.setTitle(data.UserName);

            self.$view.setToggleState(toggleState);


            self.$view.PopUp();

            self.$chatWindow[data.ID] = self.$view.$window;

            $.Containers.push(self.$view);

            $.organizeChatContainers();
            console.log("create window");
        };

        self.populateUserList = function () {

            var self = this;

            self.$view.$bodyListContent.html('');
            self.Ul = $("<ul/>");
            if (self.userList == null) {

                self.$view.$bodyListContent.append("<p>Kullanıcı Yok</p>");

            } else {
                $.each(self.userList, function (i, p) {
                    var Li = $("<li/>");
                    var Link = $("<a/>", {
                        id: "user-" + p.ID,
                        "data-id": p.ID,
                        "data-status": (p.status == 1) ? "online" : "offline",
                        "data-username": p.UserName,
                        title: p.UserName,
                        href: "#" + p.UserName,
                        text: p.UserName
                    });
                    Li.addClass("user");
                    Li.appendTo(self.Ul);
                    Link.appendTo(Li);
                    Link.prepend('<i class="glyphicon glyphicon-comment hidden"></i><i class="glyphicon glyphicon-user"></i>');
                    (function (userID) {
                        Li.click(function () {
                            console.log(userID);
                            if (self.$chatWindow[p.ID]) {
                                self.$chatWindow[p.ID].focus();
                            } else {
                                self.createWindow(self.userList[userID]);

                            }

                        });
                    })(i);
                });
                self.Ul.addClass("body-list-menu");
                self.Ul.appendTo(self.$view.$bodyListContent);
            }
        };


    };

    ChatModel.prototype = {
        init: function () {
            var self = this;

            self.userList = new Object();
            self.client = new Object();

            self.client.getBodyList = function (userList) {

                self.userList = userList;
                self.populateUserList();
            }


            self.$controller.init(self);
        },
        onReady: function () {
            var self = this;
            self.$controller.server.getBodyList();

        }

    };

    var controller = new ChatController();
    var model = new ChatModel(controller);
    var view = new ChatView(controller, model);
    view.init();



})(jQuery);
$(function () {


});