/**
 * Created by acer on 2016/8/29.
 */
// 这个轮播图必须要等图片加载完成之后才能点击 不然有bug
window.onload = function(){
    // 加载圆点
    var $sliderPic = $('.slider-main-pic');
    var $sliderCtrlNext = $('.slider-ctrl-next');
    $sliderPic.each(function(){
        var $str = $('<span></span>').addClass('slider-ctrl-con');
        // js原生dom操作了里面也有这个属性
        $str.insertBefore($sliderCtrlNext);
    })
    // 显示当前圆点
    var $sliderCtrlCon = $(".slider-ctrl-con");
    $sliderCtrlCon.eq(0).addClass('current');
    // 这是找按钮的儿子 不是找它 到这里才完全插入进去把儿子们
    var $sliderCtrl = $('#slider_ctrl span');
    // 把图片全部移动到右边去;所有left值统统设为显示宽度
    var $sliderPicWidth = $sliderPic.eq(0).width();
    $sliderPic.css('left',$sliderPicWidth);
    // 第一张留下
    $sliderPic.eq(0).css('left',0);
    // 开始自动轮播; 如果轮播间隔时间小于或者等于动画的完成时间；那么动画会瞬间完成
    var timer = null;
    timer = setInterval(autoPlay, 3000);

    // 鼠标一上来停止计时器mouseenter和mouseleave必须配套使用;他们穿过所选元素的子元素不会发生改变
    $('.w-slider').on('mouseenter', function () {
        clearInterval(timer);
    })
     $('.w-slider').on('mouseleave', function () {
     timer = setInterval(autoPlay, 3000);
     })


    // 设置key值代表图片张数；每秒钟加1
    var key = 0 ;
    /*$(window).on('click',function(){
        autoPlay();
    })*/
    function autoPlay(){
        // 当前图片向左滑动；left值为-$sliderpicwidth;使用jq动画
        $($sliderPic[key]).animate({'left':-$sliderPicWidth},'fast');
        key ++;
        // 添加判断；大于最大图片张数就变为0继续重播
        if(key > $sliderPic.length-1){
            key = 0 ;
        }
        // 并且将要出来的这张图片一定要瞬间到右边
        $($sliderPic[key]).css('left',$sliderPicWidth);
        // 加了之后图片序号就成了下一张图片
        $($sliderPic[key]).animate({'left':0},'fast')
        change();
    }

    // 下面变化可以封装起来
    function change(){
        // 下面的小圆点需要和图片同步；得到所有小圆点;首先去除所有类；再添加当前类
        $sliderCtrlCon.each(function(index,ele){
            // 这里取出来的ele是dom对象需要转换为jq对象
            $(ele).removeClass('current');
        })
        // 这里的$sliderCtrlCon数组虽然是jq对象；但是数组里面的元素依旧不是jq对象
        $($sliderCtrlCon[key]).addClass('current');
    }

    // 下面开始添加按钮事件
    // 给所有按钮添加点击事件；判断按钮的类名来执行相应的操作
    $($sliderCtrl).each(function (index, ele) {
        $(ele).on('click',function(){
            // 判断是否有这个类
            if($(this).hasClass('slider-ctrl-previous')){
                // 当前图片向右滑过去
                $($sliderPic[key]).animate({left:$sliderPicWidth},'fast');
                // 这个就是想看上一张图片;如果是小于0那么就快速滚回最后一张
                --key < 0 ? key = $sliderPic.length - 1 : key ;
                //  左边的步骤是相反的;下一张图片赶紧到最左边去等着
                $($sliderPic[key]).css('left',-$sliderPicWidth);
                $($sliderPic[key]).animate({left:0},'fast');
                change();
            }else if($(this).hasClass('slider-ctrl-next')){
                // 当前图片向左滑动；left值为-$sliderpicwidth;使用jq动画
                $($sliderPic[key]).animate({'left':-$sliderPicWidth},'fast');
                key ++;
                // 添加判断；大于最大图片张数就变为0继续重播
                if(key > $sliderPic.length-1){
                    key = 0 ;
                }
                // 并且将要出来的这张图片一定要瞬间到右边
                $($sliderPic[key]).css('left',$sliderPicWidth);
                // 加了之后图片序号就成了下一张图片
                $($sliderPic[key]).animate({'left':0},'fast')
                change();
            }else{
                // 最后就下面的按钮了;下面的按钮还要继续判断 比当前的大那么就是从右边出来；如果比当前小那么就是从左边出来；如果一样那么就不变
                // 这时候就要当前点击的那个元素和图片序号比大小；那么给上面插入的节点里面设置序号值；取出来就可以比了；或者就用这里的index值
                // 使用jq提供的index方法得到的是同辈里相同类的索引号;从1开始
                var now = $(this).index() - 1;
                if(now > key){
                    // 当前图片滑到左边去;想看的从右边滑到中间
                    $($($sliderPic)[key]).animate({left:-$sliderPicWidth});
                    $($($sliderPic)[now]).css('left',$sliderPicWidth);
                }else if(now < key){
                    $($($sliderPic)[key]).animate({left:$sliderPicWidth});
                    $($($sliderPic)[now]).css('left',-$sliderPicWidth);
                }
                $($($sliderPic)[now]).animate({left:0});
                // 如果key不和当前的now值一样的话；key值就永远是最初点击的时候的值；每次点击改变的都是最初的key值；而且是隐藏最下面的；所以要同步
                key = now ;
                change();
            }
        })
    })
}