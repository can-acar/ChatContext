using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

/// <summary>
/// Summary description for BasePage
/// </summary>
public abstract class BasePage  :System.Web.UI.Page
{
   
    protected readonly Lazy<IHubContext> ClientContext = new Lazy<IHubContext>(() => GlobalHost.ConnectionManager.GetHubContext<Client>());
    protected readonly Lazy<IHubContext> AdminContext = new Lazy<IHubContext>(() => GlobalHost.ConnectionManager.GetHubContext<Admin>());

}