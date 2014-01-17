using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using Microsoft.AspNet.SignalR;

[assembly: OwinStartup(typeof(Startup))]

public class Startup
{
    public void Configuration(IAppBuilder app)
    {
        // RouteTable.Routes.MapHubs();
        GlobalHost.Configuration.ConnectionTimeout = TimeSpan.FromSeconds(110);

        // Wait a maximum of 30 seconds after a transport connection is lost
        // before raising the Disconnected event to terminate the SignalR connection.
        GlobalHost.Configuration.DisconnectTimeout = TimeSpan.FromSeconds(6);

        // For transports other than long polling, send a keepalive packet every
        // 10 seconds. 
        // This value must be no more than 1/3 of the DisconnectTimeout value.
        GlobalHost.Configuration.KeepAlive = TimeSpan.FromSeconds(2);
        app.MapSignalR();
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
    }
}
