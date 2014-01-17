using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;

/// <summary>
/// Summary description for UsersModels
/// </summary>
public class UsersModels
{
    public static string COOKIE_NAME = "ism";

    private static UsersModels instance = new UsersModels();
    private static object syncRoot = new Object();
    protected static ICollection<Users> UserDB;
    public static List<Users> List
    {
        get
        {
            if (UserDB.Count != 0)
            {

                return UserDB.ToList<Users>();

            }
            else
            {
                return null;
            }
        }

    }
    public List<Users> ListUsers
    {
        get
        {
            if (UserDB.Count != 0)
            {


                return UserDB.ToList<Users>();

            }
            else
            {
                return null;
            }
        }
        
    }
    public UsersModels()
    {
        UserDB = new List<Users>();

    }

    public static UsersModels Instance
    {
        get
        {
            if (instance == null)
            {
                lock (syncRoot)
                {
                    if (instance == null)
                    {

                        instance = new UsersModels();
                    }
                }
            }

            return instance;
        }
    }

    public string ClientID()
    {
        dynamic id = Guid.NewGuid().ToString().Split('-')[0].ToString();
        return id;
        //UserDB.GetHashCode().ToString();
    }

    public void Add(Users user)
    {
        UserDB.Add(user);
    }

    public static void AddUser(Users user)
    {
        UserDB.Add(user);

    }

    public void Remove(string ID)
    {
        var user = UserDB.FirstOrDefault(n => n.ID == ID);

        UserDB.Remove(user);
    }

    public void Remove(Users user)
    {
        UserDB.Remove(user);
    }
    public static bool isUserExist(HttpRequestWrapper request)
    {
        if (request == null)
        {
            throw new ArgumentNullException("request");
        }
        HttpCookie cookie = request.Cookies[COOKIE_NAME];

        if (cookie == null)
        {
            return false;
        }

        byte[] bytes = Convert.FromBase64String(cookie.Value);

        string input = Encoding.UTF8.GetString(bytes);

        var user = new JavaScriptSerializer().Deserialize<Users>(input);

        return Convert.ToBoolean(UserDB.Where(a => a.ID == user.ID && a.UserName == user.UserName).Any());

    }




}