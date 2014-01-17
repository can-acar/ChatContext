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

    UsersModels user = UsersModels.Instance;
    Admin AdminInstance = Admin.Instance;


    static IHubContext context = GlobalHost.ConnectionManager.GetHubContext<Client>();
    public void GetOut()
    {
        var db = user.ListUsers.FirstOrDefault(n => n.ConnectionID == Context.ConnectionId);

        user.Remove(db);

        Admin.Notify();
    }
    public Users Join(string meta)
    {
        var UserData = JsonConvert.DeserializeObject<Users>(meta);

        UserData.ConnectionID = Context.ConnectionId;

        user.Add(UserData);

        Admin.Notify();

        return UserData;
    }

    public void sendMessage(string messageText, string UserID)
    {

        Admin.getMessage(messageText, UserID);
    }
    public static void getMessage(string messageText, string UserID)
    {
        dynamic user = UsersModels.List.FirstOrDefault(n => n.ID == UserID).ConnectionID;

        context.Clients.Client(user.ToString()).sendMessage(messageText);
    }

    public static void isTyping(string UserID)
    {

        dynamic user = UsersModels.List.FirstOrDefault(n=>n.ID == UserID).ConnectionID;

        context.Clients.Client(user.ToString()).isTyping(UserID);
    }

    public void sendTypingSignal(string userID)
    {
        Admin.sendTypingSignal(userID);
    }

    public override async Task OnConnected()
    {

        await base.OnConnected();
    }


    public override Task OnDisconnected()
    {

        var db = user.ListUsers.FirstOrDefault(n => n.ConnectionID == Context.ConnectionId);

        user.Remove(db);

        Admin.Notify();

        return base.OnDisconnected();
    }


}
