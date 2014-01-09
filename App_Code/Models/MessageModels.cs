using System;


/// <summary>
/// Summary description for MessageModels
/// </summary>
public class MessageModels
{
    public string ID { set; get; }
    public string MessageText { get; set; }
    public DateTime Timestamp { get; set; }
    public Users UserFrom { get; set; }
    public Users UserTo { get; set; }
}