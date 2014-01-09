using System;
using System.Runtime.Serialization;

/// <summary>
/// Summary description for Users
/// </summary>
/// 
[DataContract]
public class Users
{
    [DataMember]
    public string ConnectionID { get; set; }
    [DataMember]
    public string UserName { get; set; }
    [DataMember]
    public string ID { set; get; }
    public enum isOnline
    {
        online = 1,
        offline = 0
    }
    [DataMember]
    public isOnline status
    {
        get;
        set;
    }

    public Users()
    {
        this.status = isOnline.offline;
    }
}