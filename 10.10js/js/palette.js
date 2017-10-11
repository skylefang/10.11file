/*
* 属性：线宽、线段点样式、填充、描边、样式、边数
* 方法：画线、虚线、矩形、多边形、圆、铅笔、文字
*      橡皮、撤销、裁切、新建、保存
*
* */
class Palette{
    constructor(canvas,ctx,mask){
        this.canvas = canvas;
        this.ctx = ctx;
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;
        this.mask = mask;
        /*样式*/
        this.lineWidth = 2;
        this.lineCap = 'butt';
        /*描边 填充*/
        this.style = 'stroke';
        /*颜色*/
        this.fillStyle = '#000';
        this.strokeStyle = '#c05ee8';
        /*历史记录*/
        this.history = [];
        /*裁切*/
        this.temp = null;
    }
    // 初始化
    init(){
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = this.lineCap;
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.strokeStyle = this.strokeStyle;
    }
    // 画线
    line(cx,cy,ox,oy){
        this.ctx.beginPath();
        this.ctx.setLineDash([3,0]);
        this.ctx.moveTo(cx,cy);
        this.ctx.lineTo(ox,oy);
        this.ctx.stroke();
    }
    // 虚线
    dash(cx,cy,ox,oy){
        this.ctx.beginPath();
        this.ctx.setLineDash([3,5]);
        this.ctx.moveTo(cx,cy);
        this.ctx.lineTo(ox,oy);
        this.strokeStyle = '#5c1ce8';
        this.ctx.stroke();
    }
    // 矩形
    rect(cx,cy,ox,oy){
        this.ctx.beginPath();
        this.ctx.setLineDash([3,0]);
        this.ctx.strokeRect(cx,cy,ox,oy);
        this.ctx.lineTo(ox,oy);
        this.ctx[this.style]();
    }
    // 铅笔
    pencil(){
        this.mask.onmousedown=function(e){
            let cx = e.offsetX , cy = e.offsetY;
            this.ctx.beginPath();
            this.ctx.setLineDash([3,0]);
            this.ctx.moveTo(cx,cy);
            this.mask.onmousemove=function(e){
                let ox = e.offsetX , oy = e.offsetY;
                if(this.history.length){
                    this.ctx.putImageData(this.history[this.history.length-1]
                        ,0,0);
                }
                this.ctx.lineTo(ox,oy);
                this.ctx.stroke();
            }.bind(this)
            this.mask.onmouseup=function(){
                this.history.push(this.ctx.getImageData(0,0,this.cw,this.ch));
                this.mask.onmousemove = null;
                this.mask.onmouseup = null;
            }.bind(this)
        }.bind(this)
    }
    // 圆
    circle(cx,cy,ox,oy){
        let r = Math.sqrt(Math.pow(ox-cx,2)+Math.pow(oy-cy,2));
        this.ctx.beginPath();
        this.ctx.setLineDash([3,0]);
        this.ctx.arc(cx,cy,r,0,Math.PI*2);
        // this.ctx.closePath();
        this.ctx[this.style]();
    }
    // 多边形
    poly(cx,cy,ox,oy,n){
        let r = Math.sqrt(Math.pow(ox-cx,2)+Math.pow(oy-cy,2));
        let rad = Math.PI*2/n;
        this.ctx.beginPath();
        this.ctx.moveTo(cx+r,cy);
        for(let i=0;i<n;i++){
            let x = cx + r*Math.cos(rad*i);
            let y = cy + r*Math.sin(rad*i);
            this.ctx.lineTo(x,y);
        }
        this.ctx.closePath();
        this.ctx[this.style]();
    }
    // 多角形
    polyJ(cx,cy,ox,oy,n){
        let r = Math.sqrt(Math.pow(ox-cx,2)+Math.pow(oy-cy,2));
        let rad = Math.PI/n;
        this.ctx.beginPath();
        for(let i=0;i<2*n;i++){
            let r1;
            r1 = i%2==0 ? r :r/2;
            let ox = cx+r1*Math.cos(rad*i),
                oy = cy+r1*Math.sin(rad*i);
            this.ctx.lineTo(ox,oy);
        }
        this.ctx.closePath();
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
    }
    // 橡皮
    clear(xpc,w,h){
        this.mask.onmousedown=function(e){
            xpc.style.display = 'block';
            xpc.style.left = `${e.offsetX-w/2}px`;
            xpc.style.top = `${e.offsetY-h/2}px`;
            this.mask.onmousemove=function(e){
                let cx = e.offsetX-w/2 , cy = e.offsetY-h/2;
                /*边界*/

                xpc.style.left = `${cx}px`;
                xpc.style.top = `${cy}px`;
                this.ctx.clearRect(cx,cy,w,h)
            }.bind(this)
            this.mask.onmouseup=function(){
                this.history.push(this.ctx.getImageData(0,0,this.cw,this.ch))
                xpc.style.display = 'none';
                this.mask.onmousemove = null;
                this.mask.onmouseup =null;
            }.bind(this)
        }.bind(this)
    }

    draw(type,n){
        let that = this;
        that.mask.onmousedown = function(e){
            let cx = e.offsetX , cy =e.offsetY;
            that.mask.onmousemove=function(e){
                that.init();
                let ox = e.offsetX , oy =e.offsetY;
                // let r = Math.sqrt(Math.pow(ox-cx,2)+Math.pow(oy-cy,2));
                that.ctx.clearRect(0,0,that.cw,that.ch);
                if(that.history.length){
                    that.ctx.putImageData(that.history[that.history.length-1]
                    ,0,0);
                }
                that[type](cx,cy,ox,oy,n);
            }
            that.mask.onmouseup=function(){
                that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
                that.mask.onmousemove = null;
                that.mask.onmouseup = null;
            }
        }
    }
    // 字体
    font(){
        let that = this;
        // let lefts=0,tops=0;
        this.mask.onmousedown=function(e){
            that.mask.onmousedown = null;
            let cx = e.offsetX , cy = e.offsetY;
            let lefts = cx , tops = cy;    // 和上面的相同
            let divs = document.createElement('div');
            divs.contentEditable = true;
            divs.style.cssText = `
            width:100px;height:30px;border:1px dashed #ccc;
            position:absolute;left:${cx}px;top:${cy}px;
            cursor:move;
            `;
            this.appendChild(divs);
            /*
            * 拖拽：
            * 原来位置 + 变化的距离
            * 鼠标按下   两次相对于浏览器的距离差
            * */
            divs.onmousedown=function(e){
                // 按下
                let cx = e.clientX , cy = e.clientY;
                let left = divs.offsetLeft , top = divs.offsetTop;
                that.mask.onmousemove = function(e){
                    let ox = e.clientX , oy = e.clientY;
                    lefts = left + ox - cx;
                    tops = top + oy - cy;
                    if(lefts<=0){
                        lefts = 0;
                    }
                    if(left>=that.cw - 100){
                        lefts = that.cw - 100;
                    }
                    if(tops<=0){
                        tops = 0;
                    }
                    if(tops>=that.ch-30){
                        tops = that.ch - 30;
                    }
                    divs.style.left = `${lefts}px`;
                    divs.style.top = `${tops}px`;
                }
                divs.onmouseup = function(){
                    that.mask.onmousemove = null;
                    this.onmouseup = null;
                }
            }
            // 失去焦点
            divs.onblur = function(){
                let value = this.innerText;
                that.mask.removeChild(divs);
                // divs = null;
                that.ctx.font = 'bold 30px sans-serif';
                that.ctx.textAlign = 'center';
                that.ctx.textBaseline = 'middle';
                that.ctx.fillText(value,lefts,tops);
                that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
            }
        }
    }
    /*裁切*/

    clip(obj){
        // 选区
        let that = this;
        let minX , minY ,w , h ;
        this.mask.onmousedown=function(e){
            let cx = e.offsetX , cy = e.offsetY;
            obj.style.display = 'block';
            obj.style.width = 0;
            obj.style.height = 0;
            that.mask.onmousemove = function(e){
                let ox = e.offsetX , oy = e.offsetY;
                w = Math.abs(cx-ox) , h = Math.abs(cy-oy);
                // 起始位置等于较小值
                minX = ox >= cx ? cx : ox ;
                minY = oy >= cy ? cy : oy ;
                obj.style.left = `${minX}px`;
                obj.style.top = `${minY}px`;
                obj.style.width = `${w}px`;
                obj.style.height = `${h}px`;
            }
            that.mask.onmouseup = function(){
                // 获取选区
                that.temp = that.ctx.getImageData(minX,minY,w,h);
                // 清除
                that.ctx.clearRect(minX,minY,w,h);
                // 产生历史记录
                that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
                // 再放入
                that.ctx.putImageData(that.temp,minX,minY);
                // obj.style.display = 'none';
                that.mask.onmousemove = null;
                that.mask.onmouseup = null;
                that.drag(minX,minY,obj);
            }
        }
    }
    drag(x,y,obj){
        let that = this;
        this.mask.onmousedown = function(e){
            let cx = e.offsetX , cy = e.offsetY;
            e.preventDefault();
            that.mask.onmousemove = function(e){
                e.preventDefault();
                let ox = e.offsetX , oy = e.offsetY;
                let lefts = x + ox - cx ,
                    tops = y + oy - cy;
                obj.style.left = `${lefts}px`;
                obj.style.top = `${tops}px`;
                that.ctx.clearRect(0,0,that.cw,that.ch);
                if(that.history.length){
                    that.ctx.putImageData(that.history[that.history.length-1],0,0)
                }
                that.ctx.putImageData(that.temp,lefts,tops);
            }
            that.mask.onmouseup = function(){
                that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
                that.temp = null;
                obj.style.display = 'none';
                that.mask.onmousemove = null;
                that.mask.onmouseup = null;

            }
        }
    }
}
