(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{"07a2":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"q-pa-lg fit"},[n("div",{staticStyle:{"max-width":"400px"}},[n("q-input",{staticClass:"q-mb-md",attrs:{"stack-label":"",type:"text",label:"用于登陆加密的密钥",hint:"建议：随机字符串",filled:""},model:{value:t.JWT_SECRET,callback:function(e){t.JWT_SECRET=e},expression:"JWT_SECRET"}}),n("q-input",{staticClass:"q-mb-md",attrs:{"stack-label":"",type:"number",label:"密钥过期时间(小时)",hint:"建议：1-3，默认：1",filled:""},on:{change:function(e){return t.onJWT_EXPIREChange(t.JWT_EXPIRE)}},model:{value:t.JWT_EXPIRE,callback:function(e){t.JWT_EXPIRE=t._n(e)},expression:"JWT_EXPIRE"}}),n("q-input",{staticClass:"q-mb-md",attrs:{"stack-label":"",type:"number",label:"密钥彻底过期的时间(天)",hint:"建议：5-7，默认：7",filled:""},on:{change:function(e){return t.onJWT_REFRESHChange(t.JWT_REFRESH)}},model:{value:t.JWT_REFRESH,callback:function(e){t.JWT_REFRESH=t._n(e)},expression:"JWT_REFRESH"}}),n("q-input",{staticClass:"q-mb-md",attrs:{"stack-label":"",type:"text",label:"用于设备授权的密钥",hint:"建议：随机字符串",filled:""},model:{value:t.APIKEY_SECRET,callback:function(e){t.APIKEY_SECRET=e},expression:"APIKEY_SECRET"}}),n("q-btn",{attrs:{color:"primary",icon:"save",label:"保存",stretch:"",disable:!t.changed},on:{click:t.onSubmit}})],1)])},E=[],s=n("967e"),i=n.n(s),c=(n("96cf"),n("fa84")),r=n.n(c),l=n("0238"),u=n("7641"),o=n("3fa5"),R={name:"SettingsSecurity",data:function(){return{JWT_SECRET:"",JWT_EXPIRE:"",JWT_REFRESH:"",APIKEY_SECRET:""}},computed:{changed:function(){return this.JWT_SECRET||this.JWT_EXPIRE||this.JWT_REFRESH||this.APIKEY_SECRET}},methods:{onJWT_EXPIREChange:function(t){this.JWT_EXPIRE=t>0?t:""},onJWT_REFRESHChange:function(t){this.JWT_REFRESH=t>0?t:""},onSubmit:function(){var t=this;return r()(i.a.mark((function e(){var n,a;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!t.changed){e.next=22;break}return e.next=3,u["a"].create(u["b"].ConfirmDialog,{title:"保存确认",message:"你可能需要重新登陆，要继续么？"});case 3:if(n=e.sent,a=n.type,"ok"===a){e.next=7;break}return e.abrupt("return");case 7:return e.prev=7,e.next=10,t.$apis.settings.security.setSecurity({JWT_SECRET:t.JWT_SECRET,JWT_EXPIRE:t.JWT_EXPIRE,JWT_REFRESH:t.JWT_REFRESH,APIKEY_SECRET:t.APIKEY_SECRET});case 10:e.next=15;break;case 12:e.prev=12,e.t0=e["catch"](7),o["a"].error({message:"保存失败",caption:e.t0.message});case 15:return e.next=17,l["a"].destory();case 17:t.JWT_SECRET="",t.JWT_EXPIRE="",t.JWT_REFRESH="",t.APIKEY_SECRET="",t.$router.push("/");case 22:case"end":return e.stop()}}),e,null,[[7,12]])})))()}}},T=R,_=n("2877"),p=n("27f9"),J=n("9c40"),S=n("eebe"),b=n.n(S),W=Object(_["a"])(T,a,E,!1,null,null,null);e["default"]=W.exports;b()(W,"components",{QInput:p["a"],QBtn:J["a"]})}}]);