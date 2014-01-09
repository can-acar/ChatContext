<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap-theme.min.css"> 
    <link href="Style/signin.css" rel="stylesheet" />
    <link href="Style/chat.css" rel="stylesheet" />
    <script src="https://code.jquery.com/jquery.js"></script>
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>

    <script src="Scripts/jquery.signalR-2.0.1.js"></script>
    <script src="/signalr/hubs" type="text/javascript"></script>
    <script src="Scripts/chatcontext.js"></script>
   
</head>
<body  data-isauthenticated ="<%=this.IsUserAuthenticated%>" data-clientinfo =<%=this.ClientInfo%>>
    <form runat="server" id="frmsignin" >
        <asp:PlaceHolder ID="signin" runat="server" Visible="true">
            <div class="container">
                <div class="row">
                    <div class="col-sm-6 col-md-4 col-md-offset-4">

                        <div class="account-wall">
                            <img class="profile-img" src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                                alt="">
                            <div class="form-signin">

                                <input type="text" class="form-control" placeholder="kullanıcı adı" name="username" required autofocus>
                                <br />

                                <asp:Button ID="btnJoingChat" runat="server" Text="Giriş" CssClass="btn btn-lg btn-primary btn-block" OnClick="btnJoingChat_Click" />

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </asp:PlaceHolder>
        <asp:PlaceHolder ID="messageboard" runat="server" Visible="false">
            <div class="message-board" id="">
                <div class="area clearfix">
                    <div class="area-header clearfix">
                        <div class="buttonwrapper fright">
                            <a class="close button btn btn-default btn-xs"><span class="glyphicon glyphicon-remove"></span></a>
                        </div>
                        <h4 class="area-title">Administrator</h4>

                    </div>
                    <div class="area-body clearfix">

                        <div class="content  scrollable">
                        </div>
                    </div>
                    <div class="area-footer clearfix">
                        <div class="text-content">
                            <textarea class="textareagrow" id="textarea"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </asp:PlaceHolder>
    </form>

    <!-- Include all compiled plugins (below), or include individual files as needed -->

</body>
</html>
