

const offset=(element:HTMLElement):DOMRect =>{
    // 获取相对于页面的位置
    return element.getBoundingClientRect()
}
export default offset