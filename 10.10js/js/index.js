window.onload=function(){
    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext('2d');
    let pencil = document.querySelector('#pencil');
    let eraser = document.querySelector('#eraser');
    let mask = document.querySelector('.mask');
    let xpc = document.querySelector('div.xpc');
    let font = document.querySelector('#font');
    let clip = document.querySelector('#clip');
    let clipObj = document.querySelector('div.clipObj')
    let pal = new  Palette(canvas,ctx,mask);
    // pal.draw('line');
    let tools = document.querySelectorAll('.tool');
    tools.forEach(element=>{
        element.onclick=function(){
            let num = 0;
            document.querySelector('li[active=true]').setAttribute('active',false);
            this.setAttribute('active',true);
            if(this.id == 'pencil'){
                pal.pencil();
                return;
            }
            if(this.id == 'poly' || this.id == 'polyJ' ){
                num = prompt('边数',50)
            }
            pal.draw(this.id,num)

        }

    })
    // 让事件提前触发 先调用一次
    tools[0].onclick();
    //
    eraser.onclick=function () {
        let widths = prompt('橡皮尺寸',50)
       pal.clear(xpc,widths,widths);
    }
    font.onclick=function(){
        pal.font();

    }
   clip.onclick=function(){
        pal.clip(clipObj);

    }

}
