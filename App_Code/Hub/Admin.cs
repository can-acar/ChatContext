using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

public class Admin : Connection
{


    public override Task OnConnected()
    {
        Connection.ConnectionID = Context.ConnectionId;

        return base.OnConnected();
    }

    public override Task OnDisconnected()
    {
        return base.OnDisconnected();
    }


    public override Task OnReconnected()
    {
        return base.OnReconnected();
    }
}
