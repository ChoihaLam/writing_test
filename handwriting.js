/**
 * Created by LIN on 2016/1/27 0027.
 */
var canvasWidth = Math.min(500,$(window).width() - 20 )
var canvasHeight = canvasWidth

var strokeColor = "black"
var isMouseDown = false
var lastLoc = {x:0,y:0}
var lastTimestamp = 0
var lastLineWidth = 1

var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d")

canvas.width = canvasWidth
canvas.height = canvasHeight

$("#controller").css("width",canvasWidth+"px")
drawGrid()

$("#clear_btn").click(
    function(e){
        context.clearRect( 0 , 0 , canvasWidth,canvasHeight)
        drawGrid()
    }
)
$(".color_btn").click(
    function(e){
        $(".color_btn").removeClass("color_btn_selected")  //�Ƶ����԰�ť��ѡ����ʽ
        $(this).addClass("color_btn_selected")
        strokeColor = $(this).css("background-color")
    }
)

//��ָ�����¼���װ����
function beginStroke(point){

    isMouseDown = true
    //console.log("mouse down!")
    lastLoc = windowToCanvas(point.x, point.y)
    lastTimestamp = new Date().getTime();
}
function endStroke(){
    isMouseDown = false
}
function moveStroke(point){

    var curLoc = windowToCanvas( point.x ,point.y );
    var curTimestamp = new Date().getTime();
    var s = calcDistance( curLoc , lastLoc)
    var t = curTimestamp - lastTimestamp

    var lineWidth = calcLineWidth( t , s );

    //draw
    context.beginPath();
    context.moveTo(lastLoc.x,lastLoc.y);
    context.lineTo(curLoc.x,curLoc.y);

    context.strokeStyle = strokeColor
    context.lineWidth = lineWidth;
    context.lineCap = "round"
    context.lineJoin = "round"
    context.stroke();

    lastLoc = curLoc;
    lastTimestamp = curTimestamp
    lastLineWidth = lineWidth

}

//����¼��������溯��
canvas.onmousedown = function(e){
    e.preventDefault();
    beginStroke( {x: e.clientX , y: e.clientY} )

};
canvas.onmouseup = function(e){
    e.preventDefault();
    endStroke()
};
canvas.onmouseout = function(e){
    e.preventDefault();
    endStroke()
};
canvas.onmousemove = function(e){
    e.preventDefault();
    if(isMouseDown){

        //console.log("mouse move")
        moveStroke( {x: e.clientX , y: e.clientY } )
    }
};

//��ָ�����¼����÷�װ�õĺ���
canvas.addEventListener('touchstart',function(e){
    e.preventDefault()  // ��ֹĬ����Ӧ
    touch = e.touches[0]
    beginStroke( {x: touch.pageX , y: touch.pageY} )
});
canvas.addEventListener('touchmove',function(e){
    e.preventDefault()
    if(isMouseDown){
        touch = e.touches[0]
        moveStroke({x: touch.pageX , y: touch.pageY})
    }
});
canvas.addEventListener('touchend',function(e){
    e.preventDefault()
    endStroke()
});

//�����ƶ��ٶ����û��ʿ�խ
var maxLineWidth = 30;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;
function calcLineWidth( t , s ){

    var v = s / t;

    var resultLineWidth;
    if( v <= minStrokeV)
        resultLineWidth = minLineWidth;
    else if ( v >= maxStrokeV)
        resultLineWidth = maxLineWidth;
    else{
        resultLineWidth = maxLineWidth - (v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth);
    }

    if( lastLineWidth == -1)
        return resultLineWidth;

    return resultLineWidth*4/9 + lastLineWidth*5/9;
}

function calcDistance( loc1 , loc2 ){

    return Math.sqrt((loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y))
}




//���û����������Ͻ�Ϊԭ��
function windowToCanvas(x,y){
    var bbox = canvas.getBoundingClientRect()
    return {x:Math.round(x-bbox.left), y:Math.round(y-bbox.top)}
}

function drawGrid(){
    context.save()
    context.strokeStyle = "rgb(230,11,9)"

    context.beginPath()
    context.moveTo(3,3)
    context.lineTo(canvasWidth - 3 , 3)
    context.lineTo(canvasWidth - 3 , canvasHeight - 3)
    context.lineTo(3 , canvasHeight - 3)
    context.closePath()

    context.lineWidth = 6
    context.stroke()

    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(canvasWidth,canvasHeight)

    context.moveTo(canvasWidth,0)
    context.lineTo(0,canvasHeight)

    context.moveTo(canvasWidth/2,0)
    context.lineTo(canvasHeight/2,canvasHeight)

    context.moveTo(0,canvasHeight/2)
    context.lineTo(canvasWidth,canvasHeight/2)

    context.lineWidth = 1
    context.stroke()

    context.restore()
}