using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class Client : Connection
{

    public Users Join(string meta)
    {
        var UserData = JsonConvert.DeserializeObject<Users>(meta);
        UserData.ConnectionID = Context.ConnectionId;
        
        UsersModels.AddUser(UserData);


        return UserData; //"Connection Done!.";
    }

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
