(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[13],{"881e":function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"q-pa-lg fit"},[n("div",{staticStyle:{"max-width":"400px"}},[n("q-input",{staticClass:"q-mb-md",attrs:{"stack-label":"",type:"text",label:"用户名",filled:""},model:{value:e.usernameModel,callback:function(t){e.usernameModel=t},expression:"usernameModel"}}),n("q-input",{staticClass:"q-mb-md",attrs:{"stack-label":"",type:"password",label:"密码",filled:""},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}}),n("q-btn",{attrs:{color:"primary",icon:"save",label:"保存",stretch:""},on:{click:e.onSubmit}})],1)])},s=[],a=(n("8e6e"),n("8a81"),n("ac6a"),n("cadf"),n("06db"),n("456d"),n("967e")),c=n.n(a),o=(n("96cf"),n("fa84")),u=n.n(o),l=n("c47a"),i=n.n(l),p=n("3fa5"),d=n("2f62");function f(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function m(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?f(Object(n),!0).forEach((function(t){i()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var b={name:"SettingsUser",data:function(){return{usernameModel:null,password:null}},computed:m({},Object(d["d"])("user",{username:function(e){return e.username}})),watch:{username:function(e){this.usernameModel=e}},methods:{onSubmit:function(){var e=this;return u()(c.a.mark((function t(){return c.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.$apis.settings.user.updateUserInfo(e.usernameModel,e.password);case 3:e.$store.dispatch("user/info"),e.password=null,p["a"].success({message:"保存成功"}),t.next=11;break;case 8:t.prev=8,t.t0=t["catch"](0),p["a"].error({message:"保存成功",caption:t.t0.message});case 11:case"end":return t.stop()}}),t,null,[[0,8]])})))()}},mounted:function(){this.usernameModel=this.username}},w=b,O=n("2877"),h=n("eebe"),v=n.n(h),y=n("27f9"),g=n("9c40"),j=Object(O["a"])(w,r,s,!1,null,null,null);t["default"]=j.exports;v()(j,"components",{QInput:y["a"],QBtn:g["a"]})}}]);