using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

/// <summary>
/// Summary description for Message
/// </summary>
///
[DataContract]
public class Message
{
    [DataMember]
    public string ID { set; get; }
    [DataMember]
    public string MessageText { get; set; }
    [DataMember]
    public DateTime Timestamp { get; set; }
    [DataMember]
    public string UserFrom { get; set; }
    [DataMember]
    public string UserTo { get; set; }

    public Message()
    {
        //UserTo = new Users();
        //UserFrom = new Users();
    }

}