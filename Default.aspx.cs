using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    protected bool IsUserAuthenticated { get; set; }

    protected string ClientInfo { set; get; }

    protected UsersModels user;
    protected void Page_Load(object sender, EventArgs e)
    {
        user = UsersModels.Instance;
    }
    protected void btnJoingChat_Click(object sender, EventArgs e)
    {
        var existclient = UsersModels.isUserExist(new HttpRequestWrapper(this.Request));

        if (existclient == false)
        {


            var request = new HttpRequestWrapper(this.Request);

            string ID = user.ClientID();
            Dictionary<string, object> meta = new Dictionary<string, object>();
            meta.Add("username", request.Form["username"].ToString());
            meta.Add("ID", ID.ToString());
            meta.Add("status", global::Users.isOnline.online.ToString());


            ClientInfo = string.Format(@"data-clientinfo='{0}'", JsonConvert.SerializeObject(meta, Formatting.Indented).ToString());
    
            IsUserAuthenticated = true;
            signin.Visible = false;
            messageboard.Visible = true;
        }
    }
}