/**
 * Created by talklee on 2016/11/24.
 * email to talklee_work@163.com
 */
;
(function($, window, document) {
    "use strict";
    var supportPH = "placeholder" in document.createElement('input');

    function getPosi(ele) {
        // 遍历至根节点，判断条件
        var posi = {};
        posi.x = ele.offsetLeft;
        posi.y = ele.offsetTop;
        while (ele = ele.offsetParent) {
            posi.x += ele.offsetLeft;
            posi.y += ele.offsetTop;
        }
        return posi;
    }

    $.fn.placeholder = function(customStyle) {

        if (!supportPH) {
            this.each(function() {
                if (!this.dataHasPlacHolderLabel) {
                    this.dataHasPlacHolderLabel = true;

                    var placeholderContent = $(this).attr('placeholder'); // 获取placeholder属性值
                    var label = "<label>" + placeholderContent + "</label>";
                    $(this).after($(label));

                    // 获取input 样式,  一些自定义样式需要自己添加
                    var posi = getPosi(this);

                    var defaultLabelStyle = {
                        'color': '#CCC',
                        'font-size': $(this).css('fontSize'),
                        'position': 'absolute',
                        'display': 'inline-block',
                        'left': posi.x,
                        'top': posi.y,
                        'marginTop': 2 + parseInt($(this).css('paddingTop')) + 'px',
                        'marginLeft': 2 + parseInt($(this).css('paddingLeft')) + 'px'
                    };

                    // 输入框后紧跟placeholder的label标签
                    $(this).next().css(defaultLabelStyle);

                    customStyle != null ? $(this).next().css(customStyle) : null;



                    $(this).next().click(function() { // 防止label占位后，点击label对应input框无法获得焦点
                        $(this).prev().focus();
                    });

                    // 点击输入框，获得焦点时，placeholder消失，
                    // 输入内容时，placeholder保持不变，直到按一下回格键后，输入框内容长度变为为0时，重新显示placeholder
                    //失去焦点时，为了防止用户点击输入框后不进行输入直接点击其他位置使得输入框失去焦点时，在上述情况下placeholder忘记显示的情况

                    $(this).focus(function(event) {
                        $(this).next().css('visibility', 'hidden');
                    });
                    $(this).keyup(function(event) {
                        var len = event.target.value.length;
                        if (event.keyCode == 8 && len == 0) {
                            $(this).next().css('visibility', 'visible');
                        } else {
                            // 这里考虑性能可以不需要每次重复设置相同值
                            // 目前思路是给输入框添加一个自定义属性用来记录扩展placeholder的label标签的visibility属性
                            $(this).next().css('visibility', 'hidden');
                        }
                    });
                    $(this).blur(function(event) {
                        if (!event.target.value.length) {
                            $(this).next().css('visibility', 'visible');
                        }
                    })
                }
            })
        }
    };

    // 刷新重新获得位置
    $.fn.refreshPosi = function() {
        if (!supportPH) {
            this.each(function() {

                var posi = getPosi($(this)[0]);
                var newPosi = {
                    'left': posi.x,
                    'top': posi.y,
                };
                $(this).next().css(newPosi);
            });
            console.log("我刷新完了");
        } else {
            console.log("无需刷新");
        }
    };

})(jQuery, window, document);