(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))n(l);new MutationObserver(l=>{for(const i of l)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(l){const i={};return l.integrity&&(i.integrity=l.integrity),l.referrerpolicy&&(i.referrerPolicy=l.referrerpolicy),l.crossorigin==="use-credentials"?i.credentials="include":l.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(l){if(l.ep)return;l.ep=!0;const i=t(l);fetch(l.href,i)}})();const c=s=>s.getBoundingClientRect();function m(s,e){let t=c(s),n=c(e);s.style.left=`${t.left-n.left}px`,s.style.top=`${t.top-n.top}px`}function y(s,e){let t=c(s),n=c(e);return{top:t.top-n.top,left:t.left-n.left}}function b(s){let e=!1,t=0,n=0,l=null;function i(r){!s.draggableBlock.includes(r.target)||r.button===0&&(e=!0,l=c(s.element),s.parentInput&&m(s.element,s.space.element),s.displayElement.classList.add("drag-block"),s.dragStart(),t=r.clientX-l.left,n=r.clientY-l.top,u())}function o(r){if(e){const v=r.clientX-t,g=r.clientY-n;s.element.style.left=`${v}px`,s.element.style.top=`${g}px`}}function a(){e=!1,s.displayElement.classList.remove("drag-block"),s.dragEnd(),f()}function u(){document.addEventListener("mousemove",o),document.addEventListener("mouseup",a)}function f(){document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",a)}s.element.addEventListener("mousedown",i)}const k=s=>{let e=null;s.element.addEventListener("contextmenu",t=>{if(!s.draggableBlock.includes(t.target))return;if(t.preventDefault(),e){document.body.removeChild(e),e=null;return}e=document.createElement("div"),e.style.position="absolute",e.style.left=`${t.clientX}px`,e.style.top=`${t.clientY}px`;const n=document.createElement("button");n.innerText="\u590D\u5236",n.addEventListener("click",()=>{s.copy()}),e.appendChild(n);const l=document.createElement("button");l.addEventListener("click",()=>{s.delete()}),l.innerText="\u5220\u9664",e.appendChild(l),document.body.appendChild(e)}),document.addEventListener("click",t=>{e&&!s.element.contains(t.target)&&(document.body.removeChild(e),e=null)})},h=(s,e)=>{const t=c(s),n=c(e);return{dis:Math.round(Math.abs(n.left-t.left)+Math.abs(n.top-t.top)),e1:t,e2:n}};class d{constructor(e){this.parentInput=null,this.draggableBlock=[],!e.create&&e.element&&(this.element=e.element),e.inputs&&(this.inputs=e.inputs),this.element||this.create(),this.defaultInsert=e.defaultInsert,this.getInput()}getInput(){Object.keys(this.inputs).forEach(e=>{this.inputs[e].element=this.element.querySelector(`[id="input-${e}"]`)}),this.draggableBlock=Array.from(this.element.querySelectorAll('[drag="true"]')),this.displayElement=this.element.querySelector('[id="block-display"]')}dragEnd(){const e=this.getSmallestChild(),t=[];for(const n of this.space.blocks)if(n!=this){for(const[l,i]of Object.entries(n.inputs)){const o=h(i.element,this.element);o.dis<25&&t.push({inputId:l,distance:o.dis,block:n,down:null})}for(const[l,i]of Object.entries(this.inputs))if(["next","method"].includes(i.type)&&!n.parentInput){let o,a;i.type=="next"?(o=e,a=e):(o=this.inputs[l],a=this);let u=h(n.element,o.element);Math.abs(u.e1.left-u.e2.left)<25&&Math.abs(u.e1.top-u.e2.bottom)<25&&t.push({inputId:l,distance:u.dis,block:n,down:a})}}if(t.length>0){const n=t.reduce((l,i)=>i.distance<l.distance?i:l);this.handleConnect(n.block.inputs[n.inputId],n)}}dragStart(){this.element.classList.remove("input-block"),this.space.element.appendChild(this.element),this.detachFromParent()}solitary(){this.detachFromParent(),m(this.element,this.space.element),this.dragStart()}enterInput(e){e.element.appendChild(this.element),this.element.classList.add("input-block"),this.parentInput=e,e.value=this}getSmallestChild(){let e=this;for(;e.inputs.next.value instanceof d;)e=e.inputs.next.value;return e}handleConnect(e,t){if(t.down&&t.block!=this)t.block.enterInput(t.down.inputs[t.inputId]);else{let n=null;e.value&&(n=e.value,n.solitary()),this.enterInput(e),n&&this.defaultInsert&&(console.log(this.getSmallestChild()),n.enterInput(this.getSmallestChild().inputs[this.defaultInsert]))}}detachFromParent(){this.parentInput&&(this.parentInput.value=null),this.parentInput=null}clone(e){let t=this.element.cloneNode(!0);if(t.querySelectorAll('div[id^="input-"]').forEach(i=>{i.innerHTML=""}),e){t.classList.remove("input-block"),this.parentInput=null;const i=y(this.element,this.space.element);t.style.left=`${i.left+25}px`,t.style.top=`${i.top+25}px`}return new this.space.blockClasses[this.constructor.name]({create:!1,element:t})}copy(e=!0){let t=this.clone(e);return this.space.addBlock(t),Object.keys(this.inputs).forEach(n=>{if(this.inputs[n].value instanceof d){console.log(this.inputs[n]);let l=this.inputs[n].value.copy(!1);t.inputs[n].value=l,l.enterInput(t.inputs[n])}else t.inputs[n].value=this.inputs[n].value}),t}delete(e=!0){e&&this.element.remove(),this.parentInput&&(this.parentInput.value=null),this.space.removeBlock(this),Object.keys(this.inputs).forEach(t=>{this.inputs[t].value instanceof d&&this.inputs[t].value.delete(!1)})}}class x extends d{constructor(e){e.inputs={y:{type:"input",value:null,element:null},x:{type:"input",value:null,element:null},next:{type:"next",value:null,element:null}},e.defaultInsert="next",super(e)}create(){this.element=document.createElement("div"),this.element.setAttribute("class","block"),this.element.innerHTML=`
            <div id="block-display" drag="true" class="block-line">
                <p class="block-text" drag="true">\u79FB\u52A8\u5230</p>
                <div class="block-input" id="input-x"></div>
                <div class="block-input" id="input-y"></div>
            </div>
            <div class="next-input" id="input-next"></div>
            `.replace(" ","")}}class E extends d{constructor(e){e.inputs={condition:{type:"input",value:null,element:null},if:{type:"method",value:null,element:null},else:{type:"method",value:null,element:null},next:{type:"next",value:null,element:null}},e.defaultInsert="if",super(e)}create(){this.element=document.createElement("div"),this.element.setAttribute("class","block"),this.element.innerHTML=`
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
            `.replace(" ","")}}class I{constructor(e){this.blocks=[],this.blockClasses={},this.element=e.element,this.registerBlock(x),this.registerBlock(E)}addBlock(e){e.space=this,this.blocks.push(e),this.element.appendChild(e.element),b(e),k(e)}removeBlock(e){this.blocks.splice(this.blocks.indexOf(e),1)}registerBlock(e){this.blockClasses[e.name]=e}}let p=new I({element:document.getElementById("blocklyDiv")});p.addBlock(new p.blockClasses.MoveBlock({create:!0}));p.addBlock(new p.blockClasses.IfBlock({create:!0}));window.app=p;