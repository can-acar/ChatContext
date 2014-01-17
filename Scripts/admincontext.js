(function ($) {
    function ChatController(model) {
        var self = this;
        self.model = model;
        return self
    };
    ChatController.prototype = {
        init: function (chat) {
            var self = this;
            self.hub = $.connection.admin;
            if (!window.hubReady) window.hubReady = $.connection.hub.start();
            window.hubReady.done(function () {
                self.model.onReady()
            });
            self.hub.client.sendMessage = function (message, UserID) {
                self.model.client.sendMessage(message, UserID)
            };
            self.hub.client.isTyping = function (User) {
                self.model.client.isTyping(User)
            };
            self.hub.client.getBodyList = function (UserList) {
                self.model.client.getBodyList(UserList)
            };


            self.sendMessage = function (UserId, messageText, done) {
                self.hub.server.sendMessage(UserId, messageText).done(function (result) {
                    if (done) done(result)
                })
            };
            self.isTyping = function (UserId, done) {
                self.hub.server.isTyping(UserId).done(function (result) {
                    if (done) done(result)
                })
            };
            self.getMessageHistory = function (UserId, done) {
                self.hub.server.getMessageHistory(UserId).done(function (result) {
                    if (done) done(result)
                })
            };
            self.getBodyList = function (done) {
                self.hub.server.getBodyList().done(function (result) {
                    if (done) done(result)
                })
            };
            self.getFile = function (file, done) {
                self.hub.server.getFile(file).done(function (result) {
                    if (done) done(result)
                })
            }
        }
    };

    function ChatModel() {
        var self = this;

    };
    ChatModel.prototype = {
        init: function (chat) {
            var self = this;
            self.chat = chat;
            self.ListCollection = null;
            self.client = new Object();
            self.client.sendMessage = function (message, UserID) {
                if (self.view.chatWindowContainer[UserID])
                    self.view.chatWindowContainer[UserID].showMessage(message)

                self.view.incomingMessage(UserID);
            };
            self.client.isTyping = function (UserID) {
                if (self.view.chatWindowContainer[UserID])
                    self.view.chatWindowContainer[UserID].showTypingSignal()
            };
            self.client.getBodyList = function (UserList) {
                self.ListCollection = UserList;
                self.view.ShowUserList(UserList)
            };
            self.client.getFile = function (file) { }
        },
        onReady: function () {
            var self = this;
            self.chat.controller.getBodyList()
        }
    };

    function ChatView(controller, model) {
        var self = this;
        self.controller = controller;
        self.model = model;
        model.view = self;

        self.chatWindowContainer = new Object();
        self.Container = $(".container");
        self.Bodylist = $(".body-list");

        self.BodylistContainer = self.Bodylist.find(".content");



        chatWindow = function (data, view) {
            var self = this;
            self.Window = null;
            self.windowTitle = null;
            self.windowContent = null;

            self.Window = $('\<div class="message-board" id="">                        <div class="area clearfix">                            <div class="area-header clearfix">                                <div class="buttonwrapper fright">                                    <a class="toggle button btn btn-default btn-xs pull-left"><span class="glyphicon glyphicon-minus"></span></a>                                    <a class="close button btn btn-default btn-xs"><span class="glyphicon glyphicon-remove"></span></a>                                </div>                                <h4 class="area-title"></h4>                            </div>                            <div class="area-body">                                <div class="content  scrollable">                                                                 </div>                            </div>                            <div class="area-footer">                                <div class="text-content">                                    <textarea class="textareagrow" id="textarea"></textarea>                                </div>                            </div>                        </div>                    </div>');
            self.windowTitle = self.Window.find('.area-header');
            self.windowContent = self.Window.find('.content');
            self.textArea = self.Window.find('.textareagrow');
            self.Window.attr({
                "id": data.ID,
                "data-id": data.ID
            });
            self.closeButton = self.Window.find('.close');
            self.toggleButton = self.Window.find('.toggle');
            $("h4[class=area-title]", self.windowTitle).text(data.UserName);

            self.textArea.keypress(function (e) {
                if (self.$sendTypingSignalTimeout == undefined) {
                    self.$sendTypingSignalTimeout = setTimeout(function () {
                        self.$sendTypingSignalTimeout = undefined
                    }, 3000);
                    self.sendTypingSignal(data.ID)
                }
                if (e.which == 13) {
                    e.preventDefault();
                    if ($(this).val()) {
                        self.sendMessage(data.ID, $(this).val());
                        $(this).val('')
                    }
                }
                textGrow()
            });
            self.sendTypingSignal = function (userID) {
                var serlf = this;
                view.controller.isTyping(userID)
            };
            self.sendMessage = function (userID, message) {
                var serlf = this;
                self.$message = '<div class="message clearfix">' + '<div class="user-block thumbnail  fright left "><img class="media-object" src="http://critterapp.gopagoda.com/img/user.jpg" /></div>' + '<div class="popover fade in fright left">' + '<div class="popover-content">' + '<div class="triangle"></div>' + message + '</div></div></div>';
                $(self.$message).appendTo($(self.Window).filter("div[id=" + userID + "]").find(self.windowContent));
                self.windowContent.scrollTop(self.windowContent[0].scrollHeight);
                view.controller.sendMessage(userID, message)
            };
            self.closeButton.click(function (e) {
                e.stopPropagation();
                for (var i = 0; i < $.Containers.length; i++) {
                    if ($.Containers[i].Window == self.Window) {

                        $.Containers.splice(i, 1);
                        console.log($.Containers, self)
                        break
                    }
                }
                delete view.chatWindowContainer[data.ID];
                self.Window.remove();
                view.organizeChatContainers();

            });
            self.toggleButton.click(function () {
                self.textArea.focus();

                self.windowContent.toggle();

                if (self.Window.hasClass('minimized')) {
                    self.Window.removeClass("minimized");
                    $(this).children().eq(0).removeClass("glyphicon-plus").addClass("glyphicon-minus");

                } else {

                    self.Window.addClass("minimized");
                    $(this).children().eq(0).removeClass("glyphicon-minus").addClass("glyphicon-plus");

                };
            });

            if (!$.Containers)
                $.Containers = new Array();

            $.Containers.push(self);

            var textGrow = function () {
                var $textContent = self.textArea.closest(self.textArea);
                self.textArea.css({
                    'height': '0',
                    'padding': '0'
                });
                self.textArea.css({
                    'height': self.textArea[0].scrollHeight
                });
                self.textArea.scrollTop(self.textArea[0].scrollHeight);
                $textContent.css({
                    "height": self.textArea[0].scrollHeight
                });
                $textContent.scrollTop(self.textArea[0].scrollHeight)
            }

            view.controller.getMessageHistory(data.ID, function (response) {
                for (var i = 0; i < response.length; i++) {

                    var _class = (data.ID == response[i].UserFrom) ?  "fleft right":"fright left";
                    console.log(response[i]);
                    self.$message = '<div class="message clearfix">' +
                                    '<div class="user-block thumbnail ' + _class + '"><img class="media-object" src="http://critterapp.gopagoda.com/img/user.jpg" /></div>' +
                                    '<div class="popover fade in ' + _class + '">' +
                                    '<div class="popover-content">' +
                                    '<div class="triangle"></div>'
                                    + (response[i].MessageText) +
                                    '</div></div></div>';
                    $(self.$message).appendTo(self.windowContent);
                    self.windowContent.scrollTop(self.windowContent[0].scrollHeight)


                }
            });
            view.organizeChatContainers();

            self.Window.appendTo(view.Container);

            return self;
        };
        chatWindow.prototype = {
            focus: function () {
                var self = this;
                self.textArea.focus()
            },
            show: function () {
                var self = this;
                return self
            },
            showMessage: function (message) {
                var self = this;
                self.removeTypingSignal();
                self.$message = '<div class="message clearfix">' + '<div class="user-block thumbnail  fleft right"><img class="media-object" src="http://critterapp.gopagoda.com/img/user.jpg" /></div>' + '<div class="popover fade in fleft right">' + '<div class="popover-content">' + '<div class="triangle"></div>' + message + '</div></div></div>';
                $(self.$message).appendTo(self.windowContent);
                self.windowContent.scrollTop(self.windowContent[0].scrollHeight)
            },
            showTypingSignal: function (UserId) {
                var self = this;
                if (self.$typingSignal) $(self.windowContent).find('.typing').remove();
                self.$typingSignal = '<div class="message clearfix typing ">' + '<div class="user-block thumbnail  fleft right"><img class="media-object" src="http://critterapp.gopagoda.com/img/user.jpg" alt="admin" title="admin"/></div>' + '<div class="popover fade in fleft right">' + '<div class="popover-content">' + '<div class="triangle"></div><img class="media-object" src="img/typing.gif" style="   vertical-align: bottom;margin-top: 10px;"/></div></div></div>';
                self.windowContent.append(self.$typingSignal);
                self.windowContent.scrollTop(self.windowContent[0].scrollHeight);
                if (self.typingSignalTimeout) clearTimeout(self.typingSignalTimeout);
                self.typingSignalTimeout = setTimeout(function () {
                    self.removeTypingSignal()
                }, 5000)
            },
            removeTypingSignal: function () {
                var self = this;
                if (self.$typingSignal) $(self.windowContent).find('.typing').remove();
                if (self.typingSignalTimeout) clearTimeout(self.typingSignalTimeout)
            }
        };

        self.CreateChatWindow = function (data) {
            var self = this;

            delete self.chatWindowContainer[data.ID];

            var newWindow = new chatWindow(data, self);

            self.chatWindowContainer[data.ID] = newWindow;
            console.log(self.chatWindowContainer);
            self.organizeChatContainers();
            return self
        };
        self.organizeChatContainers = function () {
            var rightOffset = 320;
            var deltaOffset = 10;
            for (var i = 0; i < $.Containers.length; i++) {
                $.Containers[i].Window.css("right", rightOffset);
                rightOffset += $.Containers[i].Window.outerWidth() + deltaOffset
            }
        };
        self.controller.init(self);
        self.model.init(self);

    };
    ChatView.prototype = {
        render: function () {
            var self = this
        },
        ShowUserList: function (UserList) {
            var self = this;
            self.BodylistContainer.html('');
            var ul = $("<ul/>", {
                "class": "body-list-menu"
            });
            if (UserList != null) {
                for (var i = 0; i < UserList.length; i++) {
                    var li = $("<li/>", {
                        id: UserList[i].ID,
                        "data-id": UserList[i].ID,
                        "title": UserList[i].UserName,
                        "class": "user"
                    });
                    var aHref = $("<a/>", {
                        id: UserList[i].ID,
                        "data-id": UserList[i].ID,
                        "data-status": (UserList[i].status == 1) ? "online" : "offline",
                        "data-username": UserList[i].UserName,
                        title: UserList[i].UserName,
                        text: UserList[i].UserName,
                    });
                    aHref.prepend('<i class="glyphicon glyphicon-comment hidden"></i><i class="glyphicon glyphicon-user"></i>');
                    aHref.appendTo(li);
                    li.appendTo(ul);
                    (function (i) {
                        li.click(function () {

                            if (self.chatWindowContainer[UserList[i].ID]) {
                                self.chatWindowContainer[UserList[i].ID].focus()
                            } else {
                                self.CreateChatWindow(UserList[i]);
                            }
                        })
                    })(i)
                }
            }
            ul.appendTo(self.BodylistContainer)
        },
        incomingMessage: function (userID) {
            var self = this;
            var currentUser = $("li[id=" + userID + "]", self.BodylistContainer);


        }


    };
    var model = new ChatModel();
    var controller = new ChatController(model);
    var view = new ChatView(controller, model);
    view.render()
})(jQuery);