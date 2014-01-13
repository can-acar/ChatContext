using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class Admin : Hub
{
    public delegate List<Users> AdminListener();
    public static event AdminListener OnConnectedUser;
    protected static UsersModels client;

    public Admin()
    {
        client = UsersModels.Instance;
    }
    public static void Notify()
    {
        OnConnectedUser();
    }

    public List<Users> GetBodyList()               // Dictionary<string, object>
    {
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<Admin>();

        //Dictionary<string, object>  bodyList = new Dictionary<string, object>();
        var bodyList = new List<Users>();

        if (UsersModels.List == null)
        {
           //bodyList.Add("bodyList", new JArray());
            bodyList = UsersModels.List;
        }
        else
        {
            //bodyList.Add("bodyList", UsersModels.List);
            bodyList.AddRange(UsersModels.List);
        }
        Clients.All.getBodyList(bodyList);
       // var _list = JsonConvert.SerializeObject(json).ToString();
        return bodyList;
    }

    public override Task OnConnected()
    {
        client = UsersModels.Instance;

        OnConnectedUser = new AdminListener(GetBodyList);

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
