using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;


/// <summary>
/// Summary description for MessageModels
/// </summary>
public class MessageModels
{

    private static MessageModels instance = new MessageModels();
    private static object syncRoot = new Object();
    protected static ICollection<Message> MessageDB;

    public MessageModels()
    {
        MessageDB = new List<Message>();
    }

    public static MessageModels Instance
    {
        get
        {
            if (instance == null)
            {
                lock (syncRoot)
                {
                    if (instance == null)
                    {
                        instance = new MessageModels();
                    }
                }
            }
            return instance;
        }
    }

    public void Add(string MessageText, string FromUserID, string ToUserID)
    {
        MessageDB.Add(new Message
        {
            ID = (MessageDB.Where(m =>(m.UserTo == "qazwsx" && m.UserFrom == FromUserID)).Count()+1).ToString(),//(MessageDB.Count + 1).ToString(),
            MessageText = MessageText,
            Timestamp = DateTime.UtcNow,
            UserFrom = FromUserID,//UsersModels.List.FirstOrDefault<Users>(n=>n.ID == FromUserID),
            UserTo = ToUserID//UsersModels.List.FirstOrDefault<Users>(n=>n.ID == ToUserID)
        });

    }
    public static void AddMessage(string MessageText, string FromUserID, string ToUserID)
    {
        MessageDB.Add(new Message
        {
            ID = (MessageDB.Count + 1).ToString(),
            MessageText = MessageText,
            Timestamp = DateTime.UtcNow,
            UserFrom = FromUserID,// UsersModels.List.FirstOrDefault<Users>(n => n.ID == FromUserID),
            UserTo = ToUserID// UsersModels.List.FirstOrDefault<Users>(n => n.ID == ToUserID)
        });

    }



    public static List<Message> List
    {
        get
        {
            if (MessageDB.Count != 0)
            {
                return MessageDB.ToList<Message>();
            }
            else
            {
                return null;
            }
        }
    }

    public List<Message> ListMessage
    {
        get
        {
            if (MessageDB.Count != 0)
            {
                return MessageDB.ToList<Message>();
            }
            else
            {
                return null;
            }
        }

    }




}