export const createZoomBtn = (datas:{text:string,click:{():void}}[]):HTMLElement =>{
    let list = document.createElement('div')
    list.classList.add('zoom-list')

    datas.forEach(data=>{
        let btn = document.createElement('button')
        btn.classList.add('zoom-btn')
        btn.innerText = data.text
        btn.addEventListener('click',()=>{
            data.click()
        })
        list.appendChild(btn)
    })
    return list
}