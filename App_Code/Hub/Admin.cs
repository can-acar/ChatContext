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
    private static UsersModels client;
    private static MessageModels messages;

    private static object syncRoot = new Object();
    private static Admin instance;// = new Admin();
    protected string ConnectionID { set; get; }

    protected Users adminClient
    {
        get
        {
            var client_ = new Users
            {
                ID = "qazwsx",
                ConnectionID = Context.ConnectionId,
                status = Users.isOnline.online,
                UserName = "Administrator"
            };


            return client_;

        }

    }

    public static Admin Instance
    {
        get
        {
            if (instance == null)
            {
                lock (syncRoot)
                {
                    if (null == instance)
                    {
                        instance = new Admin();
                    }
                }
            }
            return instance;
        }
    }


    public Admin()
    {
        OnConnectedUser = new AdminListener(GetBodyList);
        client = UsersModels.Instance;
        messages = MessageModels.Instance;
        
    }


    public void sendMessage(string UserID, string message)
    {
        string AdminID = adminClient.ID;//client.ListUsers.FirstOrDefault<Users>(n => n.ConnectionID == Context.ConnectionId).ID;

        messages.Add(message, AdminID, UserID);

        Client.getMessage(message, UserID);
    }

    public static void getMessage(string message, string UserID)
    {
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<Admin>();

        string AdminID = "qazwsx";//client.ListUsers.FirstOrDefault<Users>(n => n.ConnectionID == Context.ConnectionId).ID;

        messages.Add(message, UserID, AdminID);

        context.Clients.All.sendMessage(message, UserID);
    }

    public void isTyping(string UserID)
    {
        Client.isTyping(UserID);
    }

    public static void sendTypingSignal(string userID)
    {
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<Admin>();

        context.Clients.All.isTyping(userID);
    }

    public static void Notify()
    {

        OnConnectedUser();
    }

    public List<Message> GetMessageHistory(string FromUserID)
    {
        //IHubContext context = GlobalHost.ConnectionManager.GetHubContext<Admin>();
        var messageDB = new List<Message>();
        if (messages.ListMessage == null)
        {
            messageDB = messages.ListMessage;

        }
        else
        {//.Where(p => p.ConnectionID != Context.ConnectionId)
            messageDB.AddRange(messages.ListMessage.Where(m =>
                                   (m.UserTo == "qazwsx" && m.UserFrom == FromUserID) ||
                                   (m.UserTo == FromUserID && m.UserFrom == "qazwsx")).Select(n => new Message
            {
                ID = n.ID,
                MessageText = n.MessageText,
                Timestamp = n.Timestamp,
                UserFrom = n.UserFrom,
                UserTo = n.UserTo

            }).OrderByDescending(m => m.Timestamp).Take(30).ToList());
        }
        messageDB.Reverse();
        //Clients.All.getMessageHistory(messageDB);
        return messageDB;
    }


    public List<Users> GetBodyList()               // Dictionary<string, object>
    {
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<Admin>();

        //Dictionary<string, object>  bodyList = new Dictionary<string, object>();
        var bodyList = new List<Users>();


        if (client.ListUsers == null)
        {

            bodyList = client.ListUsers;
        }
        else
        {

            bodyList.AddRange(client.ListUsers.Select(n => new Users
            {
                ID = n.ID,
                status = n.status,
                UserName = n.UserName
            }));
        }
        context.Clients.All.getBodyList(bodyList);
        // var _list = JsonConvert.SerializeObject(json).ToString();
        return bodyList;
    }

    public override Task OnConnected()
    {

        return base.OnConnected();
    }



    public override Task OnDisconnected()
    {

        return base.OnDisconnected();
    }





}
