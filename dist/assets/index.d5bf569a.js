(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerpolicy&&(l.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?l.credentials="include":s.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function n(s){if(s.ep)return;s.ep=!0;const l=t(s);fetch(s.href,l)}})();const a=i=>i.getBoundingClientRect();function m(i,e){let t=a(i),n=a(e);i.style.left=`${t.left-n.left}px`,i.style.top=`${t.top-n.top}px`}function b(i,e){let t=a(i),n=a(e);return{top:t.top-n.top,left:t.left-n.left}}function g(i){let e=!1,t=0,n=0,s=null;function l(r){!i.draggableBlock.includes(r.target)||r.button===0&&(e=!0,s=a(i.element),i.parentInput&&m(i.element,i.space.element),i.displayElement.classList.add("drag-block"),i.dragStart(),t=r.clientX-s.left,n=r.clientY-s.top,c())}function o(r){if(e){const v=r.clientX-t,y=r.clientY-n;i.element.style.left=`${v}px`,i.element.style.top=`${y}px`}}function p(){e=!1,i.displayElement.classList.remove("drag-block"),i.dragEnd(),f()}function c(){document.addEventListener("mousemove",o),document.addEventListener("mouseup",p)}function f(){document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",p)}i.element.addEventListener("mousedown",l)}const k=i=>{let e=null;i.element.addEventListener("contextmenu",t=>{if(!i.draggableBlock.includes(t.target))return;if(t.preventDefault(),e){document.body.removeChild(e),e=null;return}e=document.createElement("div"),e.style.position="absolute",e.style.left=`${t.clientX}px`,e.style.top=`${t.clientY}px`;const n=document.createElement("button");n.innerText="\u590D\u5236",n.addEventListener("click",()=>{i.copy()}),e.appendChild(n);const s=document.createElement("button");s.addEventListener("click",()=>{i.delete()}),s.innerText="\u5220\u9664",e.appendChild(s),document.body.appendChild(e)}),document.addEventListener("click",t=>{e&&!i.element.contains(t.target)&&(document.body.removeChild(e),e=null)})},h=(i,e)=>{const t=a(i),n=a(e);return{dis:Math.round(Math.abs(n.left-t.left)+Math.abs(n.top-t.top)),e1:t,e2:n}};class u{constructor(e){this.parentInput=null,this.draggableBlock=[],!e.create&&e.element&&(this.element=e.element),e.inputs&&(this.inputs=e.inputs),this.element||this.create(),this.defaultInsert=e.defaultInsert,this.getInput()}getInput(){Object.keys(this.inputs).forEach(e=>{this.inputs[e].element=this.element.querySelector(`[id="input-${e}"]`)}),this.draggableBlock=Array.from(this.element.querySelectorAll('[drag="true"]')),this.displayElement=this.element.querySelector('[id="block-display"]')}dragEnd(){const e=this.getSmallestChild(),t=[];for(const n of this.space.blocks)if(n!=this){for(const[s,l]of Object.entries(n.inputs)){const o=h(l.element,this.element);o.dis<25&&t.push({inputId:s,distance:o.dis,block:n,down:null})}for(const[s,l]of Object.entries(this.inputs))if(["next","method"].includes(l.type)&&!n.parentInput){let o,p;l.type=="next"?(o=e,p=e):(o=this.inputs[s],p=this);let c=h(n.element,o.element);Math.abs(c.e1.left-c.e2.left)<25&&Math.abs(c.e1.top-c.e2.bottom)<25&&t.push({inputId:s,distance:c.dis,block:n,down:p})}}if(t.length>0){const n=t.reduce((s,l)=>l.distance<s.distance?l:s);this.handleConnect(n.block.inputs[n.inputId],n)}}dragStart(){this.element.classList.remove("input-block"),this.space.element.appendChild(this.element),this.detachFromParent()}solitary(){this.detachFromParent(),m(this.element,this.space.element),this.dragStart()}enterInput(e){e.element.appendChild(this.element),this.element.classList.add("input-block"),this.parentInput=e,e.value=this}getSmallestChild(e="next"){let t=this;for(;t.inputs[e].value instanceof u;)t=t.inputs[e].value,e="next";return t}handleConnect(e,t){if(console.log("handleConnect",e,t),t.down&&t.block!=this)t.block.enterInput(t.down.inputs[t.inputId]);else{let n=null;e.value&&(n=e.value,n.solitary()),this.enterInput(e),n&&this.defaultInsert&&(this.inputs[this.defaultInsert].type=="method"&&!(this.inputs[this.defaultInsert].value instanceof u)?n.enterInput(this.inputs[this.defaultInsert]):n.enterInput(this.getSmallestChild().inputs.next))}}detachFromParent(){this.parentInput&&(this.parentInput.value=null),this.parentInput=null}clone(e){let t=this.element.cloneNode(!0);if(t.querySelectorAll('div[id^="input-"]').forEach(l=>{l.innerHTML=""}),e){t.classList.remove("input-block");const l=b(this.element,this.space.element);t.style.left=`${l.left+25}px`,t.style.top=`${l.top+25}px`}let s=new this.space.blockClasses[this.constructor.name]({create:!1,element:t});return e&&(s.parentInput=null),s}copy(e=!0){let t=this.clone(e);return this.space.addBlock(t),Object.keys(this.inputs).forEach(n=>{if(this.inputs[n].value instanceof u){console.log(this.inputs[n]);let s=this.inputs[n].value.copy(!1);t.inputs[n].value=s,s.enterInput(t.inputs[n])}else t.inputs[n].value=this.inputs[n].value}),t}delete(e=!0){e&&this.element.remove(),this.parentInput&&(this.parentInput.value=null),this.space.removeBlock(this),Object.keys(this.inputs).forEach(t=>{this.inputs[t].value instanceof u&&this.inputs[t].value.delete(!1)})}toJson(){let e={type:this.constructor.name,inputs:{}};return Object.keys(this.inputs).forEach(t=>{this.inputs[t].value instanceof u?e.inputs[t]={type:"block",blockType:this.constructor.name,value:this.inputs[t].value.toJson()}:e.inputs[t]={type:"text",value:this.inputs[t].value}}),e}loadInputs(e,t=!1){for(const[n,s]of Object.entries(e.inputs))if(s.type=="block"){let l=new this.space.blockClasses[s.blockType]({create:!0});this.space.addBlock(l),s.value&&l.loadInputs(s.value)}return this}}class E extends u{constructor(e){e.inputs={y:{type:"input",value:null,element:null},x:{type:"input",value:null,element:null},next:{type:"next",value:null,element:null}},e.defaultInsert="next",super(e)}create(){this.element=document.createElement("div"),this.element.setAttribute("class","block"),this.element.innerHTML=`
            <div id="block-display" drag="true" class="block-line">
                <p class="block-text" drag="true">\u79FB\u52A8\u5230</p>
                <div class="block-input" id="input-x"></div>
                <div class="block-input" id="input-y"></div>
            </div>
            <div class="next-input" id="input-next"></div>
            `.replace(" ","")}}class x extends u{constructor(e){e.inputs={condition:{type:"input",value:null,element:null},if:{type:"method",value:null,element:null},else:{type:"method",value:null,element:null},next:{type:"next",value:null,element:null}},e.defaultInsert="if",super(e)}create(){this.element=document.createElement("div"),this.element.setAttribute("class","block"),this.element.innerHTML=`
            <div id="block-display" drag="true">
                <div class="block-line">
                    <p class="block-text" drag="true">\u5982\u679C</p>
                    <div class="block-input" id="input-condition"></div>
                    <p class="block-text" drag="true">\u90A3\u4E48</p>
                </div>
                <div class="block-block-input" id="input-if"></div>
                
                <div class="block-line">
                    <p class="block-text" drag="true">\u5426\u5219</p>
                </div>
                <div class="block-block-input" id="input-else"></div>
                <div class="block-line">
                    <p class="block-text" drag="true">end</p>
                </div>
            </div>
            <div class="next-input" id="input-next"></div>
            `.replace(" ","")}}class I{constructor(e){this.blocks=[],this.blockClasses={},this.element=e.element,this.registerBlock(E),this.registerBlock(x)}addBlock(e){e.space=this,this.blocks.push(e),this.element.appendChild(e.element),g(e),k(e)}removeBlock(e){this.blocks.splice(this.blocks.indexOf(e),1)}registerBlock(e){this.blockClasses[e.name]=e}load(e){return new Promise((t,n)=>{for(const s of e){let l=new this.blockClasses[s.type]({create:!0});l.loadInputs(),this.addBlock(l)}t()})}save(){return new Promise((e,t)=>{let n=[];for(const[s,l]of Object.entries(this.blocks))l.parentInput||n.push(l.toJson());e(n)})}}let d=new I({element:document.getElementById("blocklyDiv")});d.addBlock(new d.blockClasses.MoveBlock({create:!0}));d.addBlock(new d.blockClasses.IfBlock({create:!0}));document.getElementById("save").addEventListener("click",()=>{d.save().then(i=>{console.log(i)})});document.getElementById("load").addEventListener("click",()=>{d.load(prompt("\u8F93\u5165\u4F5C\u54C1json")).then(()=>{alert("\u52A0\u8F7D\u5B8C\u6210")})});window.app=d;