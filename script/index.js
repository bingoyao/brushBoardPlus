function Brush(toolBar="#toolbar",board="#board"){
    this.toolBar = document.querySelector(toolBar) || document.createElement("canvas");
    this.board = document.querySelector(board) || document.createElement("canvas");
    this.barCtx = this.toolBar.getContext("2d");
    this.boardCtx = this.board.getContext("2d");
    this.currentBarOpt = 0;
    this.brushStyle = null;
    this.brushWidth = 5;
    this.isEraser = false;
    this.clearTip = document.createElement("div");
    this.init();

}
//绘制工具条和画板
Brush.prototype.init = function(){
    console.log("init");
    
    this.loadImg();
    this.drawToolBar(0,0);
    
    this.initToolBar();
    this.initBoard();
    this.clearTip.addEventListener('mousemove',function(){
        return false;
    });
}
//绘制工具条
/*
  @param _old: 切换前被选中项索引
  @param _new: 切换后被选中项索引
*/
Brush.prototype.drawToolBar = function(_old,_new){
    let ctx = this.barCtx;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(50*_old,2.5);
    ctx.lineTo(50*_old+50,2.5);
    ctx.moveTo(50*_old+50-2.5,2.5);
    ctx.lineTo(50*_old+50-2.5,50);
    ctx.moveTo(50*_old+50,50-2.5);
    ctx.lineTo(50*_old,50-2.5);
    ctx.moveTo(50*_old+2.5,50);
    ctx.lineTo(50*_old+2.5,0);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = "#ccc";
    ctx.beginPath();
    ctx.moveTo(50*_new,2.5);
    ctx.lineTo(50*_new+50,2.5);
    ctx.moveTo(50*_new+50-2.5,2.5);
    ctx.lineTo(50*_new+50-2.5,50);
    ctx.moveTo(50*_new+50,50-2.5);
    ctx.lineTo(50*_new,50-2.5);
    ctx.moveTo(50*_new+2.5,50);
    ctx.lineTo(50*_new+2.5,0);
    ctx.stroke();
    ctx.closePath();
}
//加载图片资源
Brush.prototype.loadImg = function(){
    let ctx = this.barCtx;
    let imgSrc = [
        "./icon/brush_black.png",
        "./icon/brush_red.png",
        "./icon/brush_orange.png",
        "./icon/brush_green.png",
        "./icon/brush_eraser.png"      
    ];   
    for(let i=0;i<imgSrc.length;i++){
        let img = new Image(40,40);
        img.src = imgSrc[i];
        img.onload = function(){
            ctx.drawImage(img,50*i+5,5,40,40);
        }
    }
}
//初始化工具条
Brush.prototype.initToolBar = function(){
    let _this = this;
    let ctx = this.barCtx;
    ctx.font = "normal 30px consolas";
    ctx.fillText('C',265,35,50,50);
    this.toolBar.addEventListener('click',function(e){
        let index = Math.floor(e.offsetX/50);
        //console.log(index);
        if(index>5) return;
        _this.drawToolBar(_this.currentBarOpt,index);
        _this.currentBarOpt = index;
        _this.isEraser = false;
        switch(index){
            case 0:_this.brushStyle="#000000";break;
            case 1:_this.brushStyle="#ff1e00";break;
            case 2:_this.brushStyle="#f9a31a";break;
            case 3:_this.brushStyle="#86c440";break;
            case 4:_this.isEraser=true;break;
            case 5:_this.clearBoard();break;
            default: ;
        }
    });

}
Brush.prototype.initBoard = function(){
    let _this = this;
    let drawFlag = false;
    let _pos = {
        start: {
            x: null,
            y: null
        },
        end: {
            x: null,
            y: null
        }
    };
    this.board.addEventListener('mousemove',function(e){
        let ctx = _this.boardCtx;
        _this.board.style.cursor = "auto";
        if(_this.isEraser){
            //选择了橡皮擦工具
            _this.showClearTip(e.pageX,e.pageY);
            _this.board.style.cursor = "none";
        }
        if(_this.isEraser && drawFlag){
            //使用橡皮清除
            console.log("clearing...");
                       
            //document.body.appendChild(clearTip);
            
            ctx.clearRect(e.offsetX+5,e.offsetY+5,_this.brushWidth,_this.brushWidth);
            return;
        }
        if(!drawFlag) return;
       
        _pos.end.x = e.offsetX;
        _pos.end.y = e.offsetY;

        
         //使用笔刷画画
         console.log("drawing");
         if(e.offsetX>=5&&e.offsetY>=5){
            ctx.fillStyle = _this.brushStyle;
            ctx.strokeStyle = _this.brushStyle;
            ctx.lineWidth = _this.brushWidth;
            ctx.beginPath();
           
            ctx.arc(e.offsetX,e.offsetY,_this.brushWidth/2,0,2*Math.PI);
            ctx.fill();
            ctx.closePath();
                       
            ctx.beginPath();
            ctx.moveTo(_pos.start.x, _pos.start.y);
            ctx.lineTo(_pos.end.x, _pos.end.y);
            ctx.stroke();
            ctx.closePath();
         }
            
       
        _pos.start.x = e.offsetX;
        _pos.start.y = e.offsetY;
        

    },false);
    this.board.addEventListener('mousedown',function(e){
        drawFlag = true;
        _pos.start.x = e.offsetX;
        _pos.start.y = e.offsetY;
    });
    this.board.addEventListener('mousewheel',function(e){
        if(e.wheelDelta == 120 && _this.brushWidth <20){
            _this.brushWidth ++;
        }else if(e.wheelDelta == -120 && _this.brushWidth > 2){
            _this.brushWidth --;
        }
    });
    document.body.addEventListener('mouseup',function(){
        drawFlag = false;
        if(_this.isEraser){
            _this.clearTip.remove();
        }
    });
    
};
Brush.prototype.showClearTip = function(x,y){
    this.clearTip.style.width = this.brushWidth + "px";
    this.clearTip.style.height = this.brushWidth + "px";
    this.clearTip.style.position = "absolute";
    this.clearTip.style.border = "1px solid #000";
    this.clearTip.style.top = y + 5 +"px";
    this.clearTip.style.left = x + 5 +"px";
    document.body.appendChild(this.clearTip);
};
Brush.prototype.clearBoard = function(){
    let ctx = this.boardCtx;
    ctx.clearRect(0,0,800,550);
}