var mover = false;
var x = 0;
var y = 0;
box1 = $('.box1')
box2 = $('.box2')


$(box1).mousedown(function(e) {
    if(e.which == 1)
    {
        mover = true;
        
        var boxOffset = box1.offset();
        x = e.pageX - boxOffset.left;
        y = e.pageY - boxOffset.top;
    }
});

$(box2).mousedown(function(e) {
    if(e.which == 1)
    {
        mover = true;
        
        var boxOffset = box1.offset();
        x = e.pageX - boxOffset.left;
        y = e.pageY - boxOffset.top;
    }
});

$(document).mouseup(function() {
    mover = false;
});

$(document).mousemove(function(e) {
        if (mover)
        {
                var boxX = e.pageX - x;
                var boxY = e.pageY - y;
                
                box1.css('left', boxX);
                box1.css('top', boxY);
        }
});
