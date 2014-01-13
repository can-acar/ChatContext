using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class Client : Hub
{

    public void GetOut()
    {
        var user = UsersModels.List;

        user.Remove(user.FirstOrDefault(n => n.ConnectionID == Context.ConnectionId));

        Admin.Notify();
    }
    public Users Join(string meta)
    {
        var UserData = JsonConvert.DeserializeObject<Users>(meta);
        UserData.ConnectionID = Context.ConnectionId;

        UsersModels.AddUser(UserData);

        Admin.Notify();

        return UserData; //"Connection Done!.";
    }

    public override async Task OnConnected()
    {
        Admin.Notify();
        await base.OnConnected();
    }

    public override async Task OnReconnected()
    {
        await OnConnected();
    }
    public override async Task OnDisconnected()
    {
        var user = UsersModels.List;

        user.Remove(user.FirstOrDefault(n => n.ConnectionID == Context.ConnectionId));

        Admin.Notify();

        await base.OnDisconnected();
    }


}
