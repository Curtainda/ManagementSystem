/**
 * Loading 框设置
 * @constructor
 */
function ShowLoading() {
    layer.load(2);
}
function HideLoading() {
    layer.closeAll('loading');
}

/**
 * Alert 框设置
 * @constructor
 */
function ShowAlert(Text) {
    layer.msg(Text);
}
function ShowAlert2(Text,Icon) {
    if(Icon == null){
        layer.alert(Text);
    }else{
        layer.alert(Text,{icon: Icon});
    }
}

/**
 * localStorage  缓存通用方法
 * @param key
 * @param value
 * @constructor
 */
function SetVal(key,value) {
   return localStorage.setItem(key,value);
}
function GetVal(key){
    var Val ;
    if(localStorage.getItem(key) != null){
        Val = localStorage.getItem(key);
    }
    return Val;
}
function clearVal(key) {
    localStorage.removeItem(key);
}
function ClearAllVal() {
    localStorage.clear();
}
function IsVal(key) {
  return localStorage.hasOwnProperty(key);
}



/**
 * 页面跳转
 * @param Url
 */
function OpenUrl(Url) {
    location.href = Url;
}
/**
 *页面刷新
 */
function Refresh () {
    location.reload();
}
/**
 * Iframe页面加载
 */
function IframeLoad(Url,iframeName) {
    window.open(Url,iframeName,'');
}

/**
 * Socket.io 配置
 */
var socket =  io.connect(BaseUrl);
function SocketSend(Method,Msg) {
    socket.emit(Method, Msg);
    socket.on('listen'+Method, function(data) {
    SocketIoMonitor(data);
});//同服务器端XXXX事件
}
socket.on('connect', function () {
    SocketIoConnect()
});//连接成功
socket.on('connecting', function () {
    SocketIoConnecting()
});//正在连接
socket.on('connect_failed',function () {
    SocketIoConnect_failed()
});//连接失败
socket.on('disconnect',function (){
    SocketIoDisconnect()
});//断开连接
socket.on('error',function (){
    SocketIoError()
});//错误发生，并且无法被其他事件类型所处理
socket.on('reconnect_failed',function (){
    SocketIoReconnect_failed()
});//重连失败
socket.on('reconnect',function (){
    SocketIoReconnect()
});//成功重连
socket.on('reconnecting',function (){
    SocketIoReconnecting()
});//正在重连
function SocketIoConnect() {
    // console.log("链接成功！");
}
function SocketIoConnecting() {
    console.log("正在连接....");
}
function SocketIoDisconnect() {
    console.log("断开链接！");
}
function SocketIoConnect_failed() {
     ShowAlert("链接失败请检查网络");
}
function SocketIoError() {
     ShowAlert("发生未知错误，请联系管理员!");
}
function SocketIoReconnect_failed() {
    ShowAlert("链接失败请检查网络");
}
function SocketIoReconnect() {
    ShowAlert("服务器已恢复正常");
}
function SocketIoReconnecting() {
    ShowAlert("服务器异常，正在重连....");
}

/**
 * 生成UUID 可以指定长度和基数
 * 8 character ID (base=2)  uuid(8, 2)
 * 8 character ID (base=10) uuid(8, 10)
 * 8 character ID (base=16) uuid(8, 16)
 * @param len
 * @param radix
 * @returns {string}
 */
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

/**
 * 解析json
 * @param strdoc
 * @param strname
 * @param num
 * @constructor
 */
function DocJson(strdoc,strname,num) {
    var res = '';
    var firstChar = strdoc.substring(0,1);
    var NUM = -1;
    if(num != null){
        NUM = parseInt(num);
    }
    if(firstChar == '{'){//json数据
        var json = eval('(' + strdoc + ')');
        res = json[strname];
    }else if(firstChar == '['){//json数组
        var json = eval('(' + strdoc + ')');
        if(NUM != -1){
            if((NUM-1) <= json.length){
                console.log(NUM-1);
                res = json[NUM-1][strname];
            }else{
                return "-2";//获取的值超过了数组长度的值
            }
        }else{
            for (var i = 0; i < json.length; i++) {
                if(i == (json.length-1)){
                    res = res+ json[i][strname];
                }else{
                    res = res+ json[i][strname]+",";
                }
            }
        }
    }else{
        return '-3'; //不是json文本字符串
    }
    return res;
}

