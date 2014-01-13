<%@ Application Language="C#" %>
<%@ Import Namespace="Microsoft.AspNet.SignalR" %>
<%@ Import Namespace="System" %>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="System.Web" %>
<%@ Import Namespace="System.Web.Routing" %>


<script RunAt="server">

    void Application_Start(object sender, EventArgs e)
    {
        // Code that runs on application startup
        // RouteTable.Routes.MapHubs();
        GlobalHost.Configuration.ConnectionTimeout = TimeSpan.FromSeconds(110);

        // Wait a maximum of 30 seconds after a transport connection is lost
        // before raising the Disconnected event to terminate the SignalR connection.
        GlobalHost.Configuration.DisconnectTimeout = TimeSpan.FromSeconds(6);

        // For transports other than long polling, send a keepalive packet every
        // 10 seconds. 
        // This value must be no more than 1/3 of the DisconnectTimeout value.
        //GlobalHost.Configuration.KeepAlive = TimeSpan.FromSeconds(10);
        

    }
    
  
       
</script>
