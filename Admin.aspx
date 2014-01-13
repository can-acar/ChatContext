<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Admin.aspx.cs" Inherits="Admin" %>

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

    <script src='<%: ResolveClientUrl("~/Scripts/jquery.signalR-2.0.1.js") %>'></script>
    <script src='<%: ResolveClientUrl("~/signalr/hubs") %>'></script>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container wrap">

            <div class="body-list" style="width: 220px;">
                <div class="area clearfix">
                    <div class="area-header clearfix">
                        <div class="buttonwrapper fright">
                            <a class="close button btn btn-default btn-xs"><span class="glyphicon glyphicon-remove"></span></a>
                        </div>
                        <h4 class="area-title">Kişiler</h4>

                    </div>
                    <div class="area-body">
                        <div class="content  scrollable">
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </form>
        <script src='<%: ResolveClientUrl("~/Scripts/admincontext.js") %>'></script>

</body>
</html>
