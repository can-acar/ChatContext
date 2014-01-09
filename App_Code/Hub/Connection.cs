using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
/// <summary>
/// Summary description for Connection
/// </summary>
public class Connection : Hub
{
    public static string ConnectionID { get; set; }
    public static string UserAgent { get; set; }
    public static bool Connected { get; set; }
}