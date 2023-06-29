(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&l(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerpolicy&&(i.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?i.credentials="include":n.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function l(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();const u=s=>s.getBoundingClientRect();function f(s,e){const t=u(s),l=u(e);s.style.left=`${t.left-l.left+e.scrollLeft}px`,s.style.top=`${t.top-l.top+e.scrollTop}px`}function g(s,e){const t=u(s),l=u(e);return{top:t.top-l.top+e.scrollTop,left:t.left-l.left+e.scrollLeft}}function x(s){let e=!1,t=0,l=0,n=null,i=null,o=s.space;function c(p){o.dropDown.close(),!!s.draggableBlock.includes(p.target)&&p.button===0&&(e=!0,n=u(s.element),i=u(o.element),s.parentInput&&f(s.element,o.blockSpace),s.displayElement.classList.add("drag-block"),s.dragStart(),t=p.clientX/o.zoom+i.left-n.left-o.element.scrollLeft,l=p.clientY/o.zoom+i.top-n.top-o.element.scrollTop,v())}function r(p){if(e){const k=p.clientX/o.zoom-t,b=p.clientY/o.zoom-l;s.element.style.left=`${k}px`,s.element.style.top=`${b}px`,o.setPlaceholder(n.top+o.element.scrollTop+n.height+1500,n.left+o.element.scrollLeft+n.width+1500)}}function h(){e=!1,s.displayElement.classList.remove("drag-block"),s.dragEnd(),s.element.style.top=`${Math.max(0,parseInt(s.element.style.top))}px`,s.element.style.left=`${Math.max(0,parseInt(s.element.style.left))}px`,y()}function v(){document.addEventListener("mousemove",r),document.addEventListener("mouseup",h)}function y(){document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",h)}s.element.addEventListener("mousedown",c)}function E(s){var e=!1,t,l;s.element.addEventListener("mousedown",n),s.element.addEventListener("mouseup",i),s.element.addEventListener("mousemove",o);function n(c){c.target==s.scrollPlaceholder&&(e=!0,t=c.clientX,l=c.clientY,c.preventDefault())}function i(){e=!1}function o(c){if(!!e){var r=c.clientX-t,h=c.clientY-l;s.element.scrollLeft-=r,s.element.scrollTop-=h,t=c.clientX,l=c.clientY,c.preventDefault(),s.setPlaceholder(s.element.scrollTop+1500,s.element.scrollLeft+1500)}}}class L{constructor(){this.element=document.createElement("div"),this.element.classList.add("drop-down"),this.close(),document.addEventListener("click",e=>{this.close()})}createButton(e){const t=document.createElement("button");return t.innerText=e.text,t.addEventListener("click",e.click),t}setButton(e){this.element.innerHTML="",e.forEach(t=>{this.element.appendChild(this.createButton(t))}),this.element.style.display="block"}close(){this.element.style.display="none"}moveTo(e,t){this.element.style.left=`${e}px`,this.element.style.top=`${t}px`}}const I=(s,e)=>{s.element.addEventListener("contextmenu",t=>{!s.draggableBlock.includes(t.target)||(t.preventDefault(),e.moveTo(t.clientX,t.clientY),e.setButton([{text:"\u590D\u5236\u79EF\u6728",click:()=>{s.copy()}},{text:"\u5220\u9664\u79EF\u6728",click:()=>{s.delete()}}]))})},B=s=>{s.element.addEventListener("contextmenu",e=>{e.target==s.scrollPlaceholder&&(e.preventDefault(),s.dropDown.moveTo(e.clientX,e.clientY),s.dropDown.setButton([{text:"\u5220\u9664\u5168\u90E8",click:()=>{s.clean()}},{text:"\u6574\u7406\u79EF\u6728",click:()=>{s.arrange()}}]))})},M=s=>{let e=document.createElement("div");return e.classList.add("zoom-list"),s.forEach(t=>{let l=document.createElement("button");l.classList.add("zoom-btn"),l.innerText=t.text,l.addEventListener("click",()=>{t.click()}),e.appendChild(l)}),e},m=(s,e)=>{const t=u(s),l=u(e);return{dis:Math.round(Math.abs(l.left-t.left)+Math.abs(l.top-t.top)),e1:t,e2:l}};class a{constructor(e){this.parentInput=null,this.draggableBlock=[],!e.create&&e.element&&(this.element=e.element),e.inputs&&(this.inputs=e.inputs),this.element||this.create(),e.blockType&&(this.blockType=e.blockType),this.defaultInsert=e.defaultInsert,this.getInput()}getInput(){Object.keys(this.inputs).forEach(e=>{this.inputs[e].element=this.element.querySelector(`[id="input-${e}"]`)}),this.draggableBlock=Array.from(this.element.querySelectorAll('[drag="true"]')),this.displayElement=this.element.querySelector('[id="block-display"]')}dragEnd(){const e=this.getSmallestChild(),t=[];for(const l of this.space.blocks)if(l!=this){for(const[n,i]of Object.entries(l.inputs)){const o=m(i.element,this.element);o.dis<25&&t.push({inputId:n,distance:o.dis,block:l,down:null})}for(const[n,i]of Object.entries(this.inputs))if([1,0].includes(i.type)&&!l.parentInput){let o,c;i.type==1?(o=e,c=e):(o=this.inputs[n],c=this);let r=m(l.element,o.element);Math.abs(r.e1.left-r.e2.left)<25&&Math.abs(r.e1.top-r.e2.bottom)<25&&t.push({inputId:n,distance:r.dis,block:l,down:c})}}if(t.length>0){const l=t.reduce((n,i)=>i.distance<n.distance?i:n);this.handleConnect(l.block.inputs[l.inputId],l)}}dragStart(){this.element.classList.remove("input-block"),this.space.blockSpace.appendChild(this.element),this.detachFromParent()}solitary(){this.detachFromParent(),f(this.element,this.space.blockSpace),this.dragStart()}enterInput(e){e.element.appendChild(this.element),this.element.classList.add("input-block"),this.parentInput=e,e.value=this}getSmallestChild(e="next"){let t=this;for(;t.inputs[e].value instanceof a;)t=t.inputs[e].value,e="next";return t}handleConnect(e,t){if(t.down&&t.block!=this)t.block.enterInput(t.down.inputs[t.inputId]);else{let l=null;e.value&&(l=e.value,l.solitary()),this.enterInput(e),l&&this.defaultInsert&&(this.inputs[this.defaultInsert].type==0&&!(this.inputs[this.defaultInsert].value instanceof a)?l.enterInput(this.inputs[this.defaultInsert]):l.enterInput(this.getSmallestChild().inputs.next))}}detachFromParent(){this.parentInput&&(this.parentInput.value=null),this.parentInput=null}clone(e){let t=this.element.cloneNode(!0);if(t.querySelectorAll('div[id^="input-"]').forEach(i=>{i.innerHTML=""}),e){t.classList.remove("input-block");const i=g(this.element,this.space.blockSpace);t.style.left=`${i.left+25}px`,t.style.top=`${i.top+25}px`}let n=new this.space.blockClasses[this.blockType]({create:!1,element:t});return e&&(n.parentInput=null),n}copy(e=!0){let t=this.clone(e);return this.space.addBlock(t),Object.keys(this.inputs).forEach(l=>{if(this.inputs[l].value instanceof a){let n=this.inputs[l].value.copy(!1);t.inputs[l].value=n,n.enterInput(t.inputs[l])}else t.inputs[l].value=this.inputs[l].value}),t}delete(e=!0){e&&this.element.remove(),this.parentInput&&(this.parentInput.value=null),this.space.removeBlock(this),Object.keys(this.inputs).forEach(t=>{this.inputs[t].value instanceof a&&this.inputs[t].value.delete(!1)})}toJson(e=!0){let t={blockType:this.blockType,inputs:{}};return e&&(t.left=parseInt(this.element.style.left),t.top=parseInt(this.element.style.top)),this.saveProperties(t),Object.keys(this.inputs).forEach(l=>{this.inputs[l].value instanceof a?t.inputs[l]={type:"block",value:this.inputs[l].value.toJson(!1)}:this.inputs[l].value instanceof String&&(t.inputs[l]={type:"text",value:this.inputs[l].value})}),t}saveProperties(e){}loadProperties(e){}loadInputs(e,t=!0){t&&(this.element.style.left=`${e.left}px`,this.element.style.top=`${e.top}px`),this.loadProperties(e);for(const[l,n]of Object.entries(e.inputs))if(n.type=="block"){let i=n.value,o=new this.space.blockClasses[i.blockType]({create:!0});this.space.addBlock(o),n.value&&o.loadInputs(n.value,!1).enterInput(this.inputs[l])}return this}}class T extends a{constructor(e){e.inputs={y:{type:2,value:null,element:null},x:{type:2,value:null,element:null},next:{type:1,value:null,element:null}},e.blockType="MoveBlock",e.defaultInsert="next",super(e)}create(){this.element=document.createElement("div"),this.element.setAttribute("class","block"),this.element.innerHTML=`
            <div id="block-display" drag="true" class="block-line">
                <p class="block-text" drag="true">\u79FB\u52A8\u5230</p>
                <div class="block-input" id="input-x"></div>
                <div class="block-input" id="input-y"></div>
            </div>
            <div class="next-input" id="input-next"></div>
            `.replace(" ","")}}class S extends a{constructor(e){e.inputs={condition:{type:2,value:null,element:null},if:{type:0,value:null,element:null},else:{type:0,value:null,element:null},next:{type:1,value:null,element:null}},e.blockType="IfBlock",e.defaultInsert="if",super(e)}create(){this.element=document.createElement("div"),this.element.setAttribute("class","block"),this.element.innerHTML=`
            <div id="block-display" drag="true">
                <div class="block-line block-method">
                    <p class="block-text" drag="true">\u5982\u679C</p>
                    <div class="block-input" id="input-condition"></div>
                    <p class="block-text" drag="true">\u90A3\u4E48</p>
                </div>
                <div class="block-block-input" id="input-if"></div>
                
                <div class="block-line block-method">
                    <p class="block-text" drag="true">\u5426\u5219</p>
                </div>
                <div class="block-block-input" id="input-else"></div>
                <div class="block-line block-method">
                    <p class="block-text" drag="true">end</p>
                </div>
            </div>
            <div class="next-input" id="input-next"></div>
            `.replace(" ","")}}class C{constructor(e){this.blocks=[],this.blockClasses={},this.zoom=1,this.element=e.element,this.registerBlock("MoveBlock",T),this.registerBlock("IfBlock",S),this.element.appendChild(M([{text:"\uFF0B",click:()=>{this.zoom+=.4,this.setZoom()}},{text:"\uFF1D",click:()=>{this.zoom=1,this.setZoom()}},{text:"\uFF0D",click:()=>{this.zoom-=.4,this.setZoom()}}])),this.scrollPlaceholder=document.createElement("div"),this.scrollPlaceholder.classList.add("placeholder"),this.element.append(this.scrollPlaceholder),this.blockSpace=document.createElement("div"),this.element.appendChild(this.blockSpace),this.dropDown=new L,document.body.appendChild(this.dropDown.element),B(this),E(this),this.setZoom()}setZoom(e=this.zoom){this.zoom=Math.min(Math.max(e,.5),2.5),this.blockSpace.setAttribute("style",`zoom:${this.zoom}`),this.scrollPlaceholder.setAttribute("style",`zoom:${this.zoom}`)}setPlaceholder(e,t){this.scrollPlaceholder.style.width=`${t/this.zoom}px`,this.scrollPlaceholder.style.height=`${e/this.zoom}px`}addBlock(e){e.space=this,this.blocks.push(e),this.blockSpace.appendChild(e.element),x(e),I(e,this.dropDown)}removeBlock(e){this.blocks.splice(this.blocks.indexOf(e),1)}registerBlock(e,t){this.blockClasses[e]=t}load(e){return new Promise((t,l)=>{for(const n of JSON.parse(e)){let i=new this.blockClasses[n.blockType]({create:!0});this.addBlock(i),i.loadInputs(n,!0)}t()})}save(){return new Promise(e=>{let t=[];for(const[l,n]of Object.entries(this.blocks))n.parentInput||t.push(n.toJson());e(t)})}clean(){return new Promise(e=>{this.blockSpace.innerHTML="",this.blocks=[],e()})}arrange(){return new Promise((e,t)=>{let l=10,n=10;for(const[i,o]of Object.entries(this.blocks))o.parentInput||(o.element.style.left=`${l}px`,o.element.style.top=`${n}px`,n+=o.element.clientHeight+10);this.setPlaceholder(this.element.scrollHeight+1500,this.element.scrollWidth+1500),e()})}}let d=new C({element:document.getElementById("blocklyDiv")});d.addBlock(new d.blockClasses.MoveBlock({create:!0}));d.addBlock(new d.blockClasses.IfBlock({create:!0}));document.getElementById("save").addEventListener("click",()=>{d.save().then(s=>{alert("\u5DF2\u83B7\u53D6\u4F5C\u54C1\u6570\u636E\uFF0C\u8BF7\u6309F12\u6253\u5F00\u63A7\u5236\u53F0\u67E5\u770B"),console.log("\u4F5C\u54C1JSON\uFF1A",JSON.stringify(s))})});document.getElementById("load").addEventListener("click",()=>{d.clean().then(()=>{d.load(prompt("\u8F93\u5165\u4F5C\u54C1json"))})});window.app=d;