// ==UserScript==
// @name         shanbay hunter
// @namespace    https://github.com/helitools/shanbayhunter
// @version      0.1
// @description  在词典中添加按钮，直接添加单词到扇贝的生词本中
// @author       zhangheli https://github.com/zhangheli/
// @require      http://cdn.bootcss.com/jquery/1.11.3/jquery.min.js
// @match        http://*.dict.cn/*
//@grant GM_xmlhttpRequest
//@grant GM_openInTab
// ==/UserScript==

function fetchWord(word, callback){
    var url = "http://www.shanbay.com/api/v1/bdc/search/?word=" + word;
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(xhr) {
            var response = eval("(" + xhr.responseText + ")");
            //console.log(xhr.responseText);
            if (response.msg == "SUCCESS"){
                var obj_id = response.data.object_id;
                callback(obj_id);
            } else {
            }
        }
    });
}

function addBook(obj_id) {
    var url = "http://www.shanbay.com/api/v1/bdc/learning/";
    var data = JSON.parse('{"id": ' + obj_id.toString() + ',"content_type":"vocabulary"}');
    //console.log("data: " + JSON.stringify(data));
    GM_xmlhttpRequest({
        method: "POST",
        data: JSON.stringify(data),
        url: url,
        headers: {
            "content-type": "application/json",
            "x-requested-with": "XMLHttpRequest"
        },
        onload: function(xhr) {
            var response = eval("(" + xhr.responseText + ")");
            //console.log(response);
            if (response.msg == "SUCCESS"){
                var req_id = response.data.id;
                var newtab = "http://www.shanbay.com/review/learning/" + req_id;
                GM_openInTab(newtab);
            } else {
                var url = "";
            }
        }
    });
}

$(document).ready(function(){
    var node = $('ul.dict-basic li')[0];
    if (node == undefined) {
        node = $("ul.dict-basic-ul li")[0];
    }
    var root = node.parentElement;
    var btnAction = "<button id='shanbayAction'>添加到扇贝词库</button>";
    root.innerHTML = btnAction + root.innerHTML;
    var child = root.childNodes[0];
    $(child).css({
        "padding": "7px 5px",
        "margin": "10px",
        "color": "#fff",
        "background": "#00a9b8",
        "font-size": "14px",
        "text-decoration": "none"
    });
    $(child).click(function(){
        var word = $("h1.word").html();
        if (word == undefined) {
            word = $("h1.keyword").html();
        }
        fetchWord(word, addBook);
    });

});