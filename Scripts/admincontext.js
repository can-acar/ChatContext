(function ($, window, admin) {

    window.hubReady = false;
    if (!window.hubReady) {
        window.hubReady = $.connection.hub.start();
    }
    window.hubReady.done(function (params) {
        
            admin.server.getClientList().done(function (response) {
                ChatContext.init(params, admin, response);
            });
       


    });
    admin.client.bodyList = function (response) {
       ChatContext.ClientList(response);
        
        return true;
    };

    var ChatContext = {

        init: function (params, admin, done) {
            var _this = this;
            _this.admin = admin;
            _this.userList = done;
            //_this._bodyList(done, _this);
            return this;
        },
        sendMessage: function () {
            this.client.sendMessage(text).done(function (message) {

            })
        },
        ClientList: function (list) {
            this._bodyList(list, this);
        },
        _bodyList: function (list, _this) {

            _this.bodyList = $(".body-list");
            _this.bodyList.header = $(_this.bodyList).find(".area-header");
            _this.bodyList.content = $(_this.bodyList).find(".content");
            _this.bodyList.ul = $('<ul></ul>');


            if (list !== null) {



                $.each(list, function (i, client) {

                    _this.bodyList.li = $('<li></li>');

                    var href = '<a  user-id="' + client.ID + '"  data-userid="' + client.ID + '" ><i class="glyphicon glyphicon-comment hidden"></i><i class="glyphicon glyphicon-user"></i>' + client.UserName + '</a>';
                    _this.bodyList.li.attr("data-id", client.ID);
                    _this.bodyList.li.append(href);
                    _this.bodyList.li.appendTo(_this.bodyList.ul);

                    $(_this.bodyList.li).on("click", function () {

                        if (isUserChatOpen(client.ID) === "false" || isUserChatOpen(client.ID) === undefined) {
                            admin.server.getUserHistory(client.ID);
                            MessageBox(client.ID, client.UserName);
                            var $message = $(".message-board").filter('div[id="' + client.ID + '"]');

                            $(this).children().children().eq(0).addClass("hidden");

                        }
                    });
                });
            } else {
                var li = $('<li></li>');
                $(li).html("<span>Kullanıcı yok</span>");
                $(li).appendTo(_this.bodyList.ul);
                $(document).find(".message-board").remove();
                rightOffset = 10;
            }

            _this.bodyList.ul.addClass("body-list-menu");
            _this.bodyList.ul.appendTo(_this.bodyList.content);
        }

    };

})(jQuery, window, $.connection.admin);