function kt(t,o){for(var r=0;r<o.length;r++){const n=o[r];if(typeof n!="string"&&!Array.isArray(n)){for(const s in n)if(s!=="default"&&!(s in t)){const c=Object.getOwnPropertyDescriptor(n,s);c&&Object.defineProperty(t,s,c.get?c:{enumerable:!0,get:()=>n[s]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}function wt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var rt={exports:{}},d={};var ct;function Ct(){if(ct)return d;ct=1;var t=Symbol.for("react.transitional.element"),o=Symbol.for("react.portal"),r=Symbol.for("react.fragment"),n=Symbol.for("react.strict_mode"),s=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),f=Symbol.for("react.context"),v=Symbol.for("react.forward_ref"),_=Symbol.for("react.suspense"),T=Symbol.for("react.memo"),E=Symbol.for("react.lazy"),L=Symbol.for("react.activity"),P=Symbol.iterator;function S(e){return e===null||typeof e!="object"?null:(e=P&&e[P]||e["@@iterator"],typeof e=="function"?e:null)}var N={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},k=Object.assign,b={};function g(e,a,y){this.props=e,this.context=a,this.refs=b,this.updater=y||N}g.prototype.isReactComponent={},g.prototype.setState=function(e,a){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,a,"setState")},g.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function l(){}l.prototype=g.prototype;function u(e,a,y){this.props=e,this.context=a,this.refs=b,this.updater=y||N}var m=u.prototype=new l;m.constructor=u,k(m,g.prototype),m.isPureReactComponent=!0;var A=Array.isArray;function $(){}var i={H:null,A:null,T:null,S:null},x=Object.prototype.hasOwnProperty;function M(e,a,y){var p=y.ref;return{$$typeof:t,type:e,key:a,ref:p!==void 0?p:null,props:y}}function j(e,a){return M(e.type,a,e.props)}function H(e){return typeof e=="object"&&e!==null&&e.$$typeof===t}function W(e){var a={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(y){return a[y]})}var B=/\/+/g;function F(e,a){return typeof e=="object"&&e!==null&&e.key!=null?W(""+e.key):a.toString(36)}function tt(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then($,$):(e.status="pending",e.then(function(a){e.status==="pending"&&(e.status="fulfilled",e.value=a)},function(a){e.status==="pending"&&(e.status="rejected",e.reason=a)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function U(e,a,y,p,h){var w=typeof e;(w==="undefined"||w==="boolean")&&(e=null);var R=!1;if(e===null)R=!0;else switch(w){case"bigint":case"string":case"number":R=!0;break;case"object":switch(e.$$typeof){case t:case o:R=!0;break;case E:return R=e._init,U(R(e._payload),a,y,p,h)}}if(R)return h=h(e),R=p===""?"."+F(e,0):p,A(h)?(y="",R!=null&&(y=R.replace(B,"$&/")+"/"),U(h,a,y,"",function(xt){return xt})):h!=null&&(H(h)&&(h=j(h,y+(h.key==null||e&&e.key===h.key?"":(""+h.key).replace(B,"$&/")+"/")+R)),a.push(h)),1;R=0;var Y=p===""?".":p+":";if(A(e))for(var D=0;D<e.length;D++)p=e[D],w=Y+F(p,D),R+=U(p,a,y,w,h);else if(D=S(e),typeof D=="function")for(e=D.call(e),D=0;!(p=e.next()).done;)p=p.value,w=Y+F(p,D++),R+=U(p,a,y,w,h);else if(w==="object"){if(typeof e.then=="function")return U(tt(e),a,y,p,h);throw a=String(e),Error("Objects are not valid as a React child (found: "+(a==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":a)+"). If you meant to render a collection of children, use an array instead.")}return R}function X(e,a,y){if(e==null)return e;var p=[],h=0;return U(e,p,"","",function(w){return a.call(y,w,h++)}),p}function G(e){if(e._status===-1){var a=e._result;a=a(),a.then(function(y){(e._status===0||e._status===-1)&&(e._status=1,e._result=y)},function(y){(e._status===0||e._status===-1)&&(e._status=2,e._result=y)}),e._status===-1&&(e._status=0,e._result=a)}if(e._status===1)return e._result.default;throw e._result}var lt=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var a=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(a))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Et={map:X,forEach:function(e,a,y){X(e,function(){a.apply(this,arguments)},y)},count:function(e){var a=0;return X(e,function(){a++}),a},toArray:function(e){return X(e,function(a){return a})||[]},only:function(e){if(!H(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};return d.Activity=L,d.Children=Et,d.Component=g,d.Fragment=r,d.Profiler=s,d.PureComponent=u,d.StrictMode=n,d.Suspense=_,d.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,d.__COMPILER_RUNTIME={__proto__:null,c:function(e){return i.H.useMemoCache(e)}},d.cache=function(e){return function(){return e.apply(null,arguments)}},d.cacheSignal=function(){return null},d.cloneElement=function(e,a,y){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var p=k({},e.props),h=e.key;if(a!=null)for(w in a.key!==void 0&&(h=""+a.key),a)!x.call(a,w)||w==="key"||w==="__self"||w==="__source"||w==="ref"&&a.ref===void 0||(p[w]=a[w]);var w=arguments.length-2;if(w===1)p.children=y;else if(1<w){for(var R=Array(w),Y=0;Y<w;Y++)R[Y]=arguments[Y+2];p.children=R}return M(e.type,h,p)},d.createContext=function(e){return e={$$typeof:f,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:c,_context:e},e},d.createElement=function(e,a,y){var p,h={},w=null;if(a!=null)for(p in a.key!==void 0&&(w=""+a.key),a)x.call(a,p)&&p!=="key"&&p!=="__self"&&p!=="__source"&&(h[p]=a[p]);var R=arguments.length-2;if(R===1)h.children=y;else if(1<R){for(var Y=Array(R),D=0;D<R;D++)Y[D]=arguments[D+2];h.children=Y}if(e&&e.defaultProps)for(p in R=e.defaultProps,R)h[p]===void 0&&(h[p]=R[p]);return M(e,w,h)},d.createRef=function(){return{current:null}},d.forwardRef=function(e){return{$$typeof:v,render:e}},d.isValidElement=H,d.lazy=function(e){return{$$typeof:E,_payload:{_status:-1,_result:e},_init:G}},d.memo=function(e,a){return{$$typeof:T,type:e,compare:a===void 0?null:a}},d.startTransition=function(e){var a=i.T,y={};i.T=y;try{var p=e(),h=i.S;h!==null&&h(y,p),typeof p=="object"&&p!==null&&typeof p.then=="function"&&p.then($,lt)}catch(w){lt(w)}finally{a!==null&&y.types!==null&&(a.types=y.types),i.T=a}},d.unstable_useCacheRefresh=function(){return i.H.useCacheRefresh()},d.use=function(e){return i.H.use(e)},d.useActionState=function(e,a,y){return i.H.useActionState(e,a,y)},d.useCallback=function(e,a){return i.H.useCallback(e,a)},d.useContext=function(e){return i.H.useContext(e)},d.useDebugValue=function(){},d.useDeferredValue=function(e,a){return i.H.useDeferredValue(e,a)},d.useEffect=function(e,a){return i.H.useEffect(e,a)},d.useEffectEvent=function(e){return i.H.useEffectEvent(e)},d.useId=function(){return i.H.useId()},d.useImperativeHandle=function(e,a,y){return i.H.useImperativeHandle(e,a,y)},d.useInsertionEffect=function(e,a){return i.H.useInsertionEffect(e,a)},d.useLayoutEffect=function(e,a){return i.H.useLayoutEffect(e,a)},d.useMemo=function(e,a){return i.H.useMemo(e,a)},d.useOptimistic=function(e,a){return i.H.useOptimistic(e,a)},d.useReducer=function(e,a,y){return i.H.useReducer(e,a,y)},d.useRef=function(e){return i.H.useRef(e)},d.useState=function(e){return i.H.useState(e)},d.useSyncExternalStore=function(e,a,y){return i.H.useSyncExternalStore(e,a,y)},d.useTransition=function(){return i.H.useTransition()},d.version="19.2.4",d}var ut;function It(){return ut||(ut=1,rt.exports=Ct()),rt.exports}var O=It();const I=wt(O),le=kt({__proto__:null,default:I},[O]);function yt(t){var o,r,n="";if(typeof t=="string"||typeof t=="number")n+=t;else if(typeof t=="object")if(Array.isArray(t)){var s=t.length;for(o=0;o<s;o++)t[o]&&(r=yt(t[o]))&&(n&&(n+=" "),n+=r)}else for(r in t)t[r]&&(n&&(n+=" "),n+=r);return n}function K(){for(var t,o,r=0,n="",s=arguments.length;r<s;r++)(t=arguments[r])&&(o=yt(t))&&(n&&(n+=" "),n+=o);return n}var Z=t=>typeof t=="number"&&!isNaN(t),Q=t=>typeof t=="string",q=t=>typeof t=="function",Rt=t=>Q(t)||Z(t),nt=t=>Q(t)||q(t)?t:null,Ot=(t,o)=>t===!1||Z(t)&&t>0?t:o,st=t=>O.isValidElement(t)||Q(t)||q(t)||Z(t);function At(t,o,r=300){let{scrollHeight:n,style:s}=t;requestAnimationFrame(()=>{s.minHeight="initial",s.height=n+"px",s.transition=`all ${r}ms`,requestAnimationFrame(()=>{s.height="0",s.padding="0",s.margin="0",setTimeout(o,r)})})}function Lt({enter:t,exit:o,appendPosition:r=!1,collapse:n=!0,collapseDuration:s=300}){return function({children:c,position:f,preventExitTransition:v,done:_,nodeRef:T,isIn:E,playToast:L}){let P=r?`${t}--${f}`:t,S=r?`${o}--${f}`:o,N=O.useRef(0);return O.useLayoutEffect(()=>{let k=T.current,b=P.split(" "),g=l=>{l.target===T.current&&(L(),k.removeEventListener("animationend",g),k.removeEventListener("animationcancel",g),N.current===0&&l.type!=="animationcancel"&&k.classList.remove(...b))};k.classList.add(...b),k.addEventListener("animationend",g),k.addEventListener("animationcancel",g)},[]),O.useEffect(()=>{let k=T.current,b=()=>{k.removeEventListener("animationend",b),n?At(k,_,s):_()};E||(v?b():(N.current=1,k.className+=` ${S}`,k.addEventListener("animationend",b)))},[E]),I.createElement(I.Fragment,null,c)}}function dt(t,o){return{content:mt(t.content,t.props),containerId:t.props.containerId,id:t.props.toastId,theme:t.props.theme,type:t.props.type,data:t.props.data||{},isLoading:t.props.isLoading,icon:t.props.icon,reason:t.removalReason,status:o}}function mt(t,o,r=!1){return O.isValidElement(t)&&!Q(t.type)?O.cloneElement(t,{closeToast:o.closeToast,toastProps:o,data:o.data,isPaused:r}):q(t)?t({closeToast:o.closeToast,toastProps:o,data:o.data,isPaused:r}):t}function Pt({closeToast:t,theme:o,ariaLabel:r="close"}){return I.createElement("button",{className:`Toastify__close-button Toastify__close-button--${o}`,type:"button",onClick:n=>{n.stopPropagation(),t(!0)},"aria-label":r},I.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},I.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}function St({delay:t,isRunning:o,closeToast:r,type:n="default",hide:s,className:c,controlledProgress:f,progress:v,rtl:_,isIn:T,theme:E}){let L=s||f&&v===0,P={animationDuration:`${t}ms`,animationPlayState:o?"running":"paused"};f&&(P.transform=`scaleX(${v})`);let S=K("Toastify__progress-bar",f?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${E}`,`Toastify__progress-bar--${n}`,{"Toastify__progress-bar--rtl":_}),N=q(c)?c({rtl:_,type:n,defaultClassName:S}):K(S,c),k={[f&&v>=1?"onTransitionEnd":"onAnimationEnd"]:f&&v<1?null:()=>{T&&r()}};return I.createElement("div",{className:"Toastify__progress-bar--wrp","data-hidden":L},I.createElement("div",{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${E} Toastify__progress-bar--${n}`}),I.createElement("div",{role:"progressbar","aria-hidden":L?"true":"false","aria-label":"notification timer","aria-valuenow":f?Math.round(v*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:N,style:P,...k}))}var $t=1,_t=()=>`${$t++}`;function Nt(t,o,r){let n=1,s=0,c=[],f=[],v=o,_=new Map,T=new Set,E=l=>(T.add(l),()=>T.delete(l)),L=()=>{f=Array.from(_.values()),T.forEach(l=>l())},P=({containerId:l,toastId:u,updateId:m})=>{let A=l?l!==t:t!==1,$=_.has(u)&&m==null;return A||$},S=(l,u)=>{_.forEach(m=>{var A;(u==null||u===m.props.toastId)&&((A=m.toggle)==null||A.call(m,l))})},N=l=>{var u,m;l.isActive&&((m=(u=l.props)==null?void 0:u.onClose)==null||m.call(u,l.removalReason),l.isActive=!1,r(dt(l,"removed")))},k=l=>{if(l==null)_.forEach(N);else{let u=_.get(l);u&&N(u)}L()},b=()=>{s-=c.length,c=[]},g=l=>{var u,m;let{toastId:A,updateId:$}=l.props,i=$==null;l.staleId&&_.delete(l.staleId),l.isActive=!0,_.set(A,l),L(),r(dt(l,i?"added":"updated")),i&&((m=(u=l.props).onOpen)==null||m.call(u))};return{id:t,props:v,observe:E,toggle:S,removeToast:k,toasts:_,clearQueue:b,buildToast:(l,u)=>{if(P(u))return;let{toastId:m,updateId:A,data:$,staleId:i,delay:x}=u,M=A==null;M&&s++;let j={...v,style:v.toastStyle,key:n++,...Object.fromEntries(Object.entries(u).filter(([W,B])=>B!=null)),toastId:m,updateId:A,data:$,isIn:!1,className:nt(u.className||v.toastClassName),progressClassName:nt(u.progressClassName||v.progressClassName),autoClose:u.isLoading?!1:Ot(u.autoClose,v.autoClose),closeToast(W){let B=_.get(m);B&&(B.removalReason=W,k(m))},deleteToast(){if(_.get(m)!=null){if(_.delete(m),s--,s<0&&(s=0),c.length>0){g(c.shift());return}L()}}};j.closeButton=v.closeButton,u.closeButton===!1||st(u.closeButton)?j.closeButton=u.closeButton:u.closeButton===!0&&(j.closeButton=st(v.closeButton)?v.closeButton:!0);let H={content:l,props:j,staleId:i};v.limit&&v.limit>0&&s>v.limit&&M?c.push(H):Z(x)?setTimeout(()=>{g(H)},x):g(H)},setProps(l){v=l},setToggle:(l,u)=>{let m=_.get(l);m&&(m.toggle=u)},isToastActive:l=>{var u;return(u=_.get(l))==null?void 0:u.isActive},getSnapshot:()=>f}}var z=new Map,V=[],it=new Set,Mt=t=>it.forEach(o=>o(t)),gt=()=>z.size>0;function zt(){V.forEach(t=>Tt(t.content,t.options)),V=[]}var Dt=(t,{containerId:o})=>{var r;return(r=z.get(o||1))==null?void 0:r.toasts.get(t)};function vt(t,o){var r;if(o)return!!((r=z.get(o))!=null&&r.isToastActive(t));let n=!1;return z.forEach(s=>{s.isToastActive(t)&&(n=!0)}),n}function Ht(t){if(!gt()){V=V.filter(o=>t!=null&&o.options.toastId!==t);return}if(t==null||Rt(t))z.forEach(o=>{o.removeToast(t)});else if(t&&("containerId"in t||"id"in t)){let o=z.get(t.containerId);o?o.removeToast(t.id):z.forEach(r=>{r.removeToast(t.id)})}}var jt=(t={})=>{z.forEach(o=>{o.props.limit&&(!t.containerId||o.id===t.containerId)&&o.clearQueue()})};function Tt(t,o){st(t)&&(gt()||V.push({content:t,options:o}),z.forEach(r=>{r.buildToast(t,o)}))}function Bt(t){var o;(o=z.get(t.containerId||1))==null||o.setToggle(t.id,t.fn)}function bt(t,o){z.forEach(r=>{(o==null||!(o!=null&&o.containerId)||o?.containerId===r.id)&&r.toggle(t,o?.id)})}function Yt(t){let o=t.containerId||1;return{subscribe(r){let n=Nt(o,t,Mt);z.set(o,n);let s=n.observe(r);return zt(),()=>{s(),z.delete(o)}},setProps(r){var n;(n=z.get(o))==null||n.setProps(r)},getSnapshot(){var r;return(r=z.get(o))==null?void 0:r.getSnapshot()}}}function Ut(t){return it.add(t),()=>{it.delete(t)}}function qt(t){return t&&(Q(t.toastId)||Z(t.toastId))?t.toastId:_t()}function J(t,o){return Tt(t,o),o.toastId}function et(t,o){return{...o,type:o&&o.type||t,toastId:qt(o)}}function ot(t){return(o,r)=>J(o,et(t,r))}function C(t,o){return J(t,et("default",o))}C.loading=(t,o)=>J(t,et("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...o}));function Xt(t,{pending:o,error:r,success:n},s){let c;o&&(c=Q(o)?C.loading(o,s):C.loading(o.render,{...s,...o}));let f={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},v=(T,E,L)=>{if(E==null){C.dismiss(c);return}let P={type:T,...f,...s,data:L},S=Q(E)?{render:E}:E;return c?C.update(c,{...P,...S}):C(S.render,{...P,...S}),L},_=q(t)?t():t;return _.then(T=>v("success",n,T)).catch(T=>v("error",r,T)),_}C.promise=Xt;C.success=ot("success");C.info=ot("info");C.error=ot("error");C.warning=ot("warning");C.warn=C.warning;C.dark=(t,o)=>J(t,et("default",{theme:"dark",...o}));function Kt(t){Ht(t)}C.dismiss=Kt;C.clearWaitingQueue=jt;C.isActive=vt;C.update=(t,o={})=>{let r=Dt(t,o);if(r){let{props:n,content:s}=r,c={delay:100,...n,...o,toastId:o.toastId||t,updateId:_t()};c.toastId!==t&&(c.staleId=t);let f=c.render||s;delete c.render,J(f,c)}};C.done=t=>{C.update(t,{progress:1})};C.onChange=Ut;C.play=t=>bt(!0,t);C.pause=t=>bt(!1,t);function Qt(t){var o;let{subscribe:r,getSnapshot:n,setProps:s}=O.useRef(Yt(t)).current;s(t);let c=(o=O.useSyncExternalStore(r,n,n))==null?void 0:o.slice();function f(v){if(!c)return[];let _=new Map;return t.newestOnTop&&c.reverse(),c.forEach(T=>{let{position:E}=T.props;_.has(E)||_.set(E,[]),_.get(E).push(T)}),Array.from(_,T=>v(T[0],T[1]))}return{getToastToRender:f,isToastActive:vt,count:c?.length}}function Wt(t){let[o,r]=O.useState(!1),[n,s]=O.useState(!1),c=O.useRef(null),f=O.useRef({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:v,pauseOnHover:_,closeToast:T,onClick:E,closeOnClick:L}=t;Bt({id:t.toastId,containerId:t.containerId,fn:r}),O.useEffect(()=>{if(t.pauseOnFocusLoss)return P(),()=>{S()}},[t.pauseOnFocusLoss]);function P(){document.hasFocus()||g(),window.addEventListener("focus",b),window.addEventListener("blur",g)}function S(){window.removeEventListener("focus",b),window.removeEventListener("blur",g)}function N(i){if(t.draggable===!0||t.draggable===i.pointerType){l();let x=c.current;f.canCloseOnClick=!0,f.canDrag=!0,x.style.transition="none",t.draggableDirection==="x"?(f.start=i.clientX,f.removalDistance=x.offsetWidth*(t.draggablePercent/100)):(f.start=i.clientY,f.removalDistance=x.offsetHeight*(t.draggablePercent===80?t.draggablePercent*1.5:t.draggablePercent)/100)}}function k(i){let{top:x,bottom:M,left:j,right:H}=c.current.getBoundingClientRect();i.pointerType==="mouse"&&t.pauseOnHover&&i.clientX>=j&&i.clientX<=H&&i.clientY>=x&&i.clientY<=M?g():b()}function b(){r(!0)}function g(){r(!1)}function l(){f.didMove=!1,document.addEventListener("pointermove",m),document.addEventListener("pointerup",A)}function u(){document.removeEventListener("pointermove",m),document.removeEventListener("pointerup",A)}function m(i){let x=c.current;if(f.canDrag&&x){f.didMove=!0,o&&g(),t.draggableDirection==="x"?f.delta=i.clientX-f.start:f.delta=i.clientY-f.start,f.start!==i.clientX&&(f.canCloseOnClick=!1);let M=t.draggableDirection==="x"?`${f.delta}px, var(--y)`:`0, calc(${f.delta}px + var(--y))`;x.style.transform=`translate3d(${M},0)`,x.style.opacity=`${1-Math.abs(f.delta/f.removalDistance)}`}}function A(){u();let i=c.current;if(f.canDrag&&f.didMove&&i){if(f.canDrag=!1,Math.abs(f.delta)>f.removalDistance){s(!0),t.closeToast(!0),t.collapseAll();return}i.style.transition="transform 0.2s, opacity 0.2s",i.style.removeProperty("transform"),i.style.removeProperty("opacity")}}let $={onPointerDown:N,onPointerUp:k};return v&&_&&($.onMouseEnter=g,t.stacked||($.onMouseLeave=b)),L&&($.onClick=i=>{E&&E(i),f.canCloseOnClick&&T(!0)}),{playToast:b,pauseToast:g,isRunning:o,preventExitTransition:n,toastRef:c,eventHandlers:$}}var ht=typeof window<"u"?O.useLayoutEffect:O.useEffect,at=({theme:t,type:o,isLoading:r,...n})=>I.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:t==="colored"?"currentColor":`var(--toastify-icon-color-${o})`,...n});function Gt(t){return I.createElement(at,{...t},I.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))}function Ft(t){return I.createElement(at,{...t},I.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))}function Vt(t){return I.createElement(at,{...t},I.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))}function Zt(t){return I.createElement(at,{...t},I.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))}function Jt(){return I.createElement("div",{className:"Toastify__spinner"})}var ft={info:Ft,warning:Gt,success:Vt,error:Zt,spinner:Jt},te=t=>t in ft;function ee({theme:t,type:o,isLoading:r,icon:n}){let s=null,c={theme:t,type:o};return n===!1||(q(n)?s=n({...c,isLoading:r}):O.isValidElement(n)?s=O.cloneElement(n,c):r?s=ft.spinner():te(o)&&(s=ft[o](c))),s}var oe=t=>{let{isRunning:o,preventExitTransition:r,toastRef:n,eventHandlers:s,playToast:c}=Wt(t),{closeButton:f,children:v,autoClose:_,onClick:T,type:E,hideProgressBar:L,closeToast:P,transition:S,position:N,className:k,style:b,progressClassName:g,updateId:l,role:u,progress:m,rtl:A,toastId:$,deleteToast:i,isIn:x,isLoading:M,closeOnClick:j,theme:H,ariaLabel:W}=t,B=K("Toastify__toast",`Toastify__toast-theme--${H}`,`Toastify__toast--${E}`,{"Toastify__toast--rtl":A},{"Toastify__toast--close-on-click":j}),F=q(k)?k({rtl:A,position:N,type:E,defaultClassName:B}):K(B,k),tt=ee(t),U=!!m||!_,X={closeToast:P,type:E,theme:H},G=null;return f===!1||(q(f)?G=f(X):O.isValidElement(f)?G=O.cloneElement(f,X):G=Pt(X)),I.createElement(S,{isIn:x,done:i,position:N,preventExitTransition:r,nodeRef:n,playToast:c},I.createElement("div",{id:$,tabIndex:0,onClick:T,"data-in":x,className:F,...s,style:b,ref:n,...x&&{role:u,"aria-label":W}},tt!=null&&I.createElement("div",{className:K("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!M})},tt),mt(v,t,!o),G,!t.customProgressBar&&I.createElement(St,{...l&&!U?{key:`p-${l}`}:{},rtl:A,theme:H,delay:_,isRunning:o,isIn:x,closeToast:P,hide:L,type:E,className:g,controlledProgress:U,progress:m||0})))},ae=(t,o=!1)=>({enter:`Toastify--animate Toastify__${t}-enter`,exit:`Toastify--animate Toastify__${t}-exit`,appendPosition:o}),re=Lt(ae("bounce",!0)),ne={position:"top-right",transition:re,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:"touch",draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light","aria-label":"Notifications Alt+T",hotKeys:t=>t.altKey&&t.code==="KeyT"};function se(t){let o={...ne,...t},r=t.stacked,[n,s]=O.useState(!0),c=O.useRef(null),{getToastToRender:f,isToastActive:v,count:_}=Qt(o),{className:T,style:E,rtl:L,containerId:P,hotKeys:S}=o;function N(b){let g=K("Toastify__toast-container",`Toastify__toast-container--${b}`,{"Toastify__toast-container--rtl":L});return q(T)?T({position:b,rtl:L,defaultClassName:g}):K(g,nt(T))}function k(){r&&(s(!0),C.play())}return ht(()=>{var b;if(r){let g=c.current.querySelectorAll('[data-in="true"]'),l=12,u=(b=o.position)==null?void 0:b.includes("top"),m=0,A=0;Array.from(g).reverse().forEach(($,i)=>{let x=$;x.classList.add("Toastify__toast--stacked"),i>0&&(x.dataset.collapsed=`${n}`),x.dataset.pos||(x.dataset.pos=u?"top":"bot");let M=m*(n?.2:1)+(n?0:l*i),j=Math.max(.5,1-(n?A:0));x.style.setProperty("--y",`${u?M:M*-1}px`),x.style.setProperty("--g",`${l}`),x.style.setProperty("--s",`${j}`),m+=x.offsetHeight,A+=.025})}},[n,_,r]),O.useEffect(()=>{function b(g){var l;let u=c.current;S(g)&&((l=u?.querySelector('[tabIndex="0"]'))==null||l.focus(),s(!1),C.pause()),g.key==="Escape"&&(document.activeElement===u||u!=null&&u.contains(document.activeElement))&&(s(!0),C.play())}return document.addEventListener("keydown",b),()=>{document.removeEventListener("keydown",b)}},[S]),I.createElement("section",{ref:c,className:"Toastify",id:P,onMouseEnter:()=>{r&&(s(!1),C.pause())},onMouseLeave:k,"aria-live":"polite","aria-atomic":"false","aria-relevant":"additions text","aria-label":o["aria-label"]},f((b,g)=>{let l=g.length?{...E}:{...E,pointerEvents:"none"};return I.createElement("div",{tabIndex:-1,className:N(b),"data-stacked":r,style:l,key:`c-${b}`},g.map(({content:u,props:m})=>I.createElement(oe,{...m,stacked:r,collapseAll:k,isIn:v(m.toastId,m.containerId),key:`t-${m.key}`},u)))}))}var ie=`:root {
  --toastify-color-light: #fff;
  --toastify-color-dark: #121212;
  --toastify-color-info: #3498db;
  --toastify-color-success: #07bc0c;
  --toastify-color-warning: #f1c40f;
  --toastify-color-error: hsl(6, 78%, 57%);
  --toastify-color-transparent: rgba(255, 255, 255, 0.7);

  --toastify-icon-color-info: var(--toastify-color-info);
  --toastify-icon-color-success: var(--toastify-color-success);
  --toastify-icon-color-warning: var(--toastify-color-warning);
  --toastify-icon-color-error: var(--toastify-color-error);

  --toastify-container-width: fit-content;
  --toastify-toast-width: 320px;
  --toastify-toast-offset: 16px;
  --toastify-toast-top: max(var(--toastify-toast-offset), env(safe-area-inset-top));
  --toastify-toast-right: max(var(--toastify-toast-offset), env(safe-area-inset-right));
  --toastify-toast-left: max(var(--toastify-toast-offset), env(safe-area-inset-left));
  --toastify-toast-bottom: max(var(--toastify-toast-offset), env(safe-area-inset-bottom));
  --toastify-toast-background: #fff;
  --toastify-toast-padding: 14px;
  --toastify-toast-min-height: 64px;
  --toastify-toast-max-height: 800px;
  --toastify-toast-bd-radius: 6px;
  --toastify-toast-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  --toastify-font-family: sans-serif;
  --toastify-z-index: 9999;
  --toastify-text-color-light: #757575;
  --toastify-text-color-dark: #fff;

  /* Used only for colored theme */
  --toastify-text-color-info: #fff;
  --toastify-text-color-success: #fff;
  --toastify-text-color-warning: #fff;
  --toastify-text-color-error: #fff;

  --toastify-spinner-color: #616161;
  --toastify-spinner-color-empty-area: #e0e0e0;
  --toastify-color-progress-light: linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55);
  --toastify-color-progress-dark: #bb86fc;
  --toastify-color-progress-info: var(--toastify-color-info);
  --toastify-color-progress-success: var(--toastify-color-success);
  --toastify-color-progress-warning: var(--toastify-color-warning);
  --toastify-color-progress-error: var(--toastify-color-error);
  /* used to control the opacity of the progress trail */
  --toastify-color-progress-bgo: 0.2;
}

.Toastify__toast-container {
  z-index: var(--toastify-z-index);
  -webkit-transform: translate3d(0, 0, var(--toastify-z-index));
  position: fixed;
  width: var(--toastify-container-width);
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.Toastify__toast-container--top-left {
  top: var(--toastify-toast-top);
  left: var(--toastify-toast-left);
}
.Toastify__toast-container--top-center {
  top: var(--toastify-toast-top);
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}
.Toastify__toast-container--top-right {
  top: var(--toastify-toast-top);
  right: var(--toastify-toast-right);
  align-items: end;
}
.Toastify__toast-container--bottom-left {
  bottom: var(--toastify-toast-bottom);
  left: var(--toastify-toast-left);
}
.Toastify__toast-container--bottom-center {
  bottom: var(--toastify-toast-bottom);
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}
.Toastify__toast-container--bottom-right {
  bottom: var(--toastify-toast-bottom);
  right: var(--toastify-toast-right);
  align-items: end;
}

.Toastify__toast {
  --y: 0px;
  position: relative;
  touch-action: none;
  width: var(--toastify-toast-width);
  min-height: var(--toastify-toast-min-height);
  box-sizing: border-box;
  margin-bottom: 1rem;
  padding: var(--toastify-toast-padding);
  border-radius: var(--toastify-toast-bd-radius);
  box-shadow: var(--toastify-toast-shadow);
  max-height: var(--toastify-toast-max-height);
  font-family: var(--toastify-font-family);
  /* webkit only issue #791 */
  z-index: 0;
  /* inner swag */
  display: flex;
  flex: 1 auto;
  align-items: center;
  word-break: break-word;
}

@media only screen and (max-width: 480px) {
  .Toastify__toast-container {
    width: 100vw;
    left: env(safe-area-inset-left);
    margin: 0;
  }
  .Toastify__toast-container--top-left,
  .Toastify__toast-container--top-center,
  .Toastify__toast-container--top-right {
    top: env(safe-area-inset-top);
    transform: translateX(0);
  }
  .Toastify__toast-container--bottom-left,
  .Toastify__toast-container--bottom-center,
  .Toastify__toast-container--bottom-right {
    bottom: env(safe-area-inset-bottom);
    transform: translateX(0);
  }
  .Toastify__toast-container--rtl {
    right: env(safe-area-inset-right);
    left: initial;
  }
  .Toastify__toast {
    --toastify-toast-width: 100%;
    margin-bottom: 0;
    border-radius: 0;
  }
}

.Toastify__toast-container[data-stacked='true'] {
  width: var(--toastify-toast-width);
}

@media only screen and (max-width: 480px) {
  .Toastify__toast-container[data-stacked='true'] {
    width: 100vw;
  }
}

.Toastify__toast--stacked {
  position: absolute;
  width: 100%;
  transform: translate3d(0, var(--y), 0) scale(var(--s));
  transition: transform 0.3s;
}

.Toastify__toast--stacked[data-collapsed] .Toastify__toast-body,
.Toastify__toast--stacked[data-collapsed] .Toastify__close-button {
  transition: opacity 0.1s;
}

.Toastify__toast--stacked[data-collapsed='false'] {
  overflow: visible;
}

.Toastify__toast--stacked[data-collapsed='true']:not(:last-child) > * {
  opacity: 0;
}

.Toastify__toast--stacked:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: calc(var(--g) * 1px);
  bottom: 100%;
}

.Toastify__toast--stacked[data-pos='top'] {
  top: 0;
}

.Toastify__toast--stacked[data-pos='bot'] {
  bottom: 0;
}

.Toastify__toast--stacked[data-pos='bot'].Toastify__toast--stacked:before {
  transform-origin: top;
}

.Toastify__toast--stacked[data-pos='top'].Toastify__toast--stacked:before {
  transform-origin: bottom;
}

.Toastify__toast--stacked:before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  transform: scaleY(3);
  z-index: -1;
}

.Toastify__toast--rtl {
  direction: rtl;
}

.Toastify__toast--close-on-click {
  cursor: pointer;
}

.Toastify__toast-icon {
  margin-inline-end: 10px;
  width: 22px;
  flex-shrink: 0;
  display: flex;
}

.Toastify--animate {
  animation-fill-mode: both;
  animation-duration: 0.5s;
}

.Toastify--animate-icon {
  animation-fill-mode: both;
  animation-duration: 0.3s;
}

.Toastify__toast-theme--dark {
  background: var(--toastify-color-dark);
  color: var(--toastify-text-color-dark);
}

.Toastify__toast-theme--light {
  background: var(--toastify-color-light);
  color: var(--toastify-text-color-light);
}

.Toastify__toast-theme--colored.Toastify__toast--default {
  background: var(--toastify-color-light);
  color: var(--toastify-text-color-light);
}

.Toastify__toast-theme--colored.Toastify__toast--info {
  color: var(--toastify-text-color-info);
  background: var(--toastify-color-info);
}

.Toastify__toast-theme--colored.Toastify__toast--success {
  color: var(--toastify-text-color-success);
  background: var(--toastify-color-success);
}

.Toastify__toast-theme--colored.Toastify__toast--warning {
  color: var(--toastify-text-color-warning);
  background: var(--toastify-color-warning);
}

.Toastify__toast-theme--colored.Toastify__toast--error {
  color: var(--toastify-text-color-error);
  background: var(--toastify-color-error);
}

.Toastify__progress-bar-theme--light {
  background: var(--toastify-color-progress-light);
}

.Toastify__progress-bar-theme--dark {
  background: var(--toastify-color-progress-dark);
}

.Toastify__progress-bar--info {
  background: var(--toastify-color-progress-info);
}

.Toastify__progress-bar--success {
  background: var(--toastify-color-progress-success);
}

.Toastify__progress-bar--warning {
  background: var(--toastify-color-progress-warning);
}

.Toastify__progress-bar--error {
  background: var(--toastify-color-progress-error);
}

.Toastify__progress-bar-theme--colored.Toastify__progress-bar--info,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--success,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--error {
  background: var(--toastify-color-transparent);
}

.Toastify__close-button {
  color: #fff;
  position: absolute;
  top: 6px;
  right: 6px;
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.3s ease;
  z-index: 1;
}

.Toastify__toast--rtl .Toastify__close-button {
  left: 6px;
  right: unset;
}

.Toastify__close-button--light {
  color: #000;
  opacity: 0.3;
}

.Toastify__close-button > svg {
  fill: currentColor;
  height: 16px;
  width: 14px;
}

.Toastify__close-button:hover,
.Toastify__close-button:focus {
  opacity: 1;
}

@keyframes Toastify__trackProgress {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0);
  }
}

.Toastify__progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.7;
  transform-origin: left;
}

.Toastify__progress-bar--animated {
  animation: Toastify__trackProgress linear 1 forwards;
}

.Toastify__progress-bar--controlled {
  transition: transform 0.2s;
}

.Toastify__progress-bar--rtl {
  right: 0;
  left: initial;
  transform-origin: right;
  border-bottom-left-radius: initial;
}

.Toastify__progress-bar--wrp {
  position: absolute;
  overflow: hidden;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  border-bottom-left-radius: var(--toastify-toast-bd-radius);
  border-bottom-right-radius: var(--toastify-toast-bd-radius);
}

.Toastify__progress-bar--wrp[data-hidden='true'] {
  opacity: 0;
}

.Toastify__progress-bar--bg {
  opacity: var(--toastify-color-progress-bgo);
  width: 100%;
  height: 100%;
}

.Toastify__spinner {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: var(--toastify-spinner-color-empty-area);
  border-right-color: var(--toastify-spinner-color);
  animation: Toastify__spin 0.65s linear infinite;
}

@keyframes Toastify__bounceInRight {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translate3d(3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0);
  }
  75% {
    transform: translate3d(10px, 0, 0);
  }
  90% {
    transform: translate3d(-5px, 0, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutRight {
  20% {
    opacity: 1;
    transform: translate3d(-20px, var(--y), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(2000px, var(--y), 0);
  }
}

@keyframes Toastify__bounceInLeft {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: translate3d(-3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(25px, 0, 0);
  }
  75% {
    transform: translate3d(-10px, 0, 0);
  }
  90% {
    transform: translate3d(5px, 0, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutLeft {
  20% {
    opacity: 1;
    transform: translate3d(20px, var(--y), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(-2000px, var(--y), 0);
  }
}

@keyframes Toastify__bounceInUp {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translate3d(0, 3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }
  75% {
    transform: translate3d(0, 10px, 0);
  }
  90% {
    transform: translate3d(0, -5px, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes Toastify__bounceOutUp {
  20% {
    transform: translate3d(0, calc(var(--y) - 10px), 0);
  }
  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, calc(var(--y) + 20px), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }
}

@keyframes Toastify__bounceInDown {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: translate3d(0, -3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, 25px, 0);
  }
  75% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, 5px, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutDown {
  20% {
    transform: translate3d(0, calc(var(--y) - 10px), 0);
  }
  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, calc(var(--y) + 20px), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, 2000px, 0);
  }
}

.Toastify__bounce-enter--top-left,
.Toastify__bounce-enter--bottom-left {
  animation-name: Toastify__bounceInLeft;
}

.Toastify__bounce-enter--top-right,
.Toastify__bounce-enter--bottom-right {
  animation-name: Toastify__bounceInRight;
}

.Toastify__bounce-enter--top-center {
  animation-name: Toastify__bounceInDown;
}

.Toastify__bounce-enter--bottom-center {
  animation-name: Toastify__bounceInUp;
}

.Toastify__bounce-exit--top-left,
.Toastify__bounce-exit--bottom-left {
  animation-name: Toastify__bounceOutLeft;
}

.Toastify__bounce-exit--top-right,
.Toastify__bounce-exit--bottom-right {
  animation-name: Toastify__bounceOutRight;
}

.Toastify__bounce-exit--top-center {
  animation-name: Toastify__bounceOutUp;
}

.Toastify__bounce-exit--bottom-center {
  animation-name: Toastify__bounceOutDown;
}

@keyframes Toastify__zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
  }
}

@keyframes Toastify__zoomOut {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
    transform: translate3d(0, var(--y), 0) scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 0;
  }
}

.Toastify__zoom-enter {
  animation-name: Toastify__zoomIn;
}

.Toastify__zoom-exit {
  animation-name: Toastify__zoomOut;
}

@keyframes Toastify__flipIn {
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }
  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
  }
  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }
  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }
  to {
    transform: perspective(400px);
  }
}

@keyframes Toastify__flipOut {
  from {
    transform: translate3d(0, var(--y), 0) perspective(400px);
  }
  30% {
    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, -20deg);
    opacity: 1;
  }
  to {
    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, 90deg);
    opacity: 0;
  }
}

.Toastify__flip-enter {
  animation-name: Toastify__flipIn;
}

.Toastify__flip-exit {
  animation-name: Toastify__flipOut;
}

@keyframes Toastify__slideInRight {
  from {
    transform: translate3d(110%, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInLeft {
  from {
    transform: translate3d(-110%, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInUp {
  from {
    transform: translate3d(0, 110%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInDown {
  from {
    transform: translate3d(0, -110%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideOutRight {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(110%, var(--y), 0);
  }
}

@keyframes Toastify__slideOutLeft {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(-110%, var(--y), 0);
  }
}

@keyframes Toastify__slideOutDown {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, 500px, 0);
  }
}

@keyframes Toastify__slideOutUp {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, -500px, 0);
  }
}

.Toastify__slide-enter--top-left,
.Toastify__slide-enter--bottom-left {
  animation-name: Toastify__slideInLeft;
}

.Toastify__slide-enter--top-right,
.Toastify__slide-enter--bottom-right {
  animation-name: Toastify__slideInRight;
}

.Toastify__slide-enter--top-center {
  animation-name: Toastify__slideInDown;
}

.Toastify__slide-enter--bottom-center {
  animation-name: Toastify__slideInUp;
}

.Toastify__slide-exit--top-left,
.Toastify__slide-exit--bottom-left {
  animation-name: Toastify__slideOutLeft;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--top-right,
.Toastify__slide-exit--bottom-right {
  animation-name: Toastify__slideOutRight;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--top-center {
  animation-name: Toastify__slideOutUp;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--bottom-center {
  animation-name: Toastify__slideOutDown;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

@keyframes Toastify__spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`,pt=new Map,fe=(t,o)=>{ht(()=>{if(typeof document>"u")return;let r=document,n=pt.get(r);if(n){o&&n.setAttribute("nonce",o);return}let s=r.createElement("style");s.textContent=t,o&&s.setAttribute("nonce",o),r.head.appendChild(s),pt.set(r,s)},[o])};function ce(t){return fe(ie,t.nonce),I.createElement(se,{...t})}export{le as R,O as a,It as r,ce as x,C as y};
