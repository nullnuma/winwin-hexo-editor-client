(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{"0ae5":function(t,e,n){t.exports=n.p+"img/hexo-editor-logo.de328791.png"},5022:function(t,e,n){"use strict";var a=n("7102"),r=n.n(a);r.a},7102:function(t,e,n){},"713b":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("q-layout",{attrs:{view:"lHh Lpr lFf"}},[n("q-header",{attrs:{elevated:!t.isLoginPage}},[n("q-toolbar",[n("q-btn",{attrs:{flat:"",dense:"",round:"",icon:"menu","aria-label":"Menu"},on:{click:function(e){t.leftDrawerOpen=!t.leftDrawerOpen}}}),n("q-toolbar-title",[t._v("\n        Hexo Editor\n      ")]),n("q-btn-dropdown",{attrs:{flat:"",label:"服务器地址","dropdown-icon":"code"}},[n("q-img",{staticClass:"bg-grey-2",attrs:{src:t.qrcode,ratio:1,"spinner-color":"primary"}})],1),n("q-btn",{directives:[{name:"show",rawName:"v-show",value:!t.isLoginPage,expression:"!isLoginPage"}],staticClass:"q-ml-md",attrs:{flat:"",label:"退出"},on:{click:t.onLogout}})],1)],1),n("q-drawer",{attrs:{bordered:"",behavior:"mobile","content-class":"bg-grey-1"},model:{value:t.leftDrawerOpen,callback:function(e){t.leftDrawerOpen=e},expression:"leftDrawerOpen"}},[n("app-sidebar")],1),n("q-page-container",[n("router-view")],1)],1)},r=[],i=n("967e"),o=n.n(i),s=(n("96cf"),n("fa84")),c=n.n(s),l=n("d055");function u(t){return p.apply(this,arguments)}function p(){return p=c()(o.a.mark((function t(e){return o.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",l["toDataURL"](e));case 1:case"end":return t.stop()}}),t)}))),p.apply(this,arguments)}var d=n("823b"),f=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"fit overflow-hidden relative-position"},[a("q-list",{staticClass:"q-pt-xl"},[a("img",{staticClass:"bgimg",attrs:{src:n("0ae5"),alt:"logo"}}),a("div",{staticClass:"absolute fit"}),t._l(t.essentialLinks,(function(e){return a("EssentialLink",t._b({key:e.title},"EssentialLink",e,!1))})),a("q-item",[a("q-item-section",{attrs:{avatar:""}}),a("q-item-section",[a("q-item-label",[t._v("向右拖动文章以编辑")]),a("q-item-label",{attrs:{caption:"",lines:"2"}},[t._v("更多功能请自行探索")])],1)],1),a("q-item",[a("q-item-section",{attrs:{avatar:""}}),a("q-item-section",[a("q-item-label",[a("q-chip",{staticClass:"q-ml-none no-border-radius",staticStyle:{"font-family":"consolas"},attrs:{square:"",size:"10px",color:"primary","text-color":"white"}},[a("q-avatar",{staticClass:"no-border-radius",staticStyle:{width:"auto"},attrs:{color:"grey-8"}},[a("span",{staticStyle:{padding:"0 6px"}},[t._v("\n                winwin-hexo-editor\n              ")])]),a("span",{staticStyle:{"padding-left":"3px"}},[t._v("\n              "+t._s(t.currentVersion)+"\n            ")])],1)],1),a("q-item-label",{attrs:{caption:"",lines:"2"}},[t._v("当前主程序版本")])],1)],1)],2)],1)},m=[],w=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("q-item",{attrs:{clickable:"",tag:"a",target:"_blank",href:t.link}},[t.icon?n("q-item-section",{attrs:{avatar:""}},[n("q-icon",{attrs:{name:t.icon}})],1):t._e(),n("q-item-section",[n("q-item-label",[t._v(t._s(t.title))]),n("q-item-label",{attrs:{caption:""}},[t._v("\n      "+t._s(t.caption)+"\n    ")])],1)],1)},b=[],v={name:"EssentialLink",props:{title:{type:String,required:!0},caption:{type:String,default:""},link:{type:String,default:"#"},icon:{type:String,default:""}}},h=v,g=n("2877"),q=n("eebe"),x=n.n(q),k=n("66e5"),_=n("4074"),y=n("0016"),Q=n("0170"),L=Object(g["a"])(h,w,b,!1,null,null,null),S=L.exports;x()(L,"components",{QItem:k["a"],QItemSection:_["a"],QIcon:y["a"],QItemLabel:Q["a"]});var C=n("365c"),D={name:"AppSidebar",components:{EssentialLink:S},beforeMount:function(){var t=this;return c()(o.a.mark((function e(){return o.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,C["a"].info.version();case 3:e.t0=e.sent,t.currentVersion="v"+e.t0,e.next=10;break;case 7:e.prev=7,e.t1=e["catch"](0),t.currentVersion="获取失败";case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))()},data:function(){return{currentVersion:"加载中",essentialLinks:[{title:"项目主页",caption:"@winwin",icon:"home",link:"https://winwin_2011.gitee.io/winwin-hexo-editor/"},{title:"获取源码",caption:"@winwin",icon:"code",link:"https://gitee.com/winwin_2011/winwin-hexo-editor"}]}}},O=D,E=(n("5022"),n("1c1c")),I=n("b047"),$=n("cb32"),P=Object(g["a"])(O,f,m,!1,null,"b3a58338",null),V=P.exports;x()(P,"components",{QList:E["a"],QItem:k["a"],QItemSection:_["a"],QItemLabel:Q["a"],QChip:I["a"],QAvatar:$["a"]});var j={name:"MainLayout",components:{AppSidebar:V},data:function(){return{qrcode:"",leftDrawerOpen:!1}},computed:{isLoginPage:function(){return"/login"===this.$route.path}},created:function(){var t=this;return c()(o.a.mark((function e(){var n;return o.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=new d["a"]({prefix:"QRCode"}),e.prev=1,n.log(window.location.origin+"/hexoeditorserver"),e.next=5,u(window.location.origin+"/hexoeditorserver");case 5:t.qrcode=e.sent,e.next=10;break;case 8:e.prev=8,e.t0=e["catch"](1);case 10:case"end":return e.stop()}}),e,null,[[1,8]])})))()},methods:{onLogout:function(){var t=this;return c()(o.a.mark((function e(){return o.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$store.dispatch("logout");case 2:t.$router.push("/login");case 3:case"end":return e.stop()}}),e)})))()}}},A=j,H=n("4d5a"),M=n("e359"),T=n("65c6"),B=n("9c40"),J=n("6ac5"),R=n("f20b"),z=n("068f"),F=n("9404"),N=n("09e3"),U=Object(g["a"])(A,a,r,!1,null,null,null);e["default"]=U.exports;x()(U,"components",{QLayout:H["a"],QHeader:M["a"],QToolbar:T["a"],QBtn:B["a"],QToolbarTitle:J["a"],QBtnDropdown:R["a"],QImg:z["a"],QDrawer:F["a"],QPageContainer:N["a"]})}}]);