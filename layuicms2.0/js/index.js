layui.use(['bodyTab', 'form', 'element', 'layer', 'jquery', 'storage'], function () {
    'use strict';

    var element = layui.element,
        $ = layui.$,
        cache = layui.storage,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var tab = layui.bodyTab({
        openTabNum: "50",  //最大可打开窗口数量
        elem: '#leftNavbar', //左侧菜单栏ID
        url: '/json/navs.json', //菜单数据请求地址
        tabElem: "#top_tabs_box" // 顶部 TAB 栏ID	
    });
    //渲染左侧菜单
    tab.render({ menuType: 'contentManagement' });
    //渲染顶部菜单
    tab.renderRoof({
        elem: '#topNavbar',
        url: '/json/topNavs.json'
    });


    // 页面禁止双击选中
    $('body').bind("selectstart", function () {
        return false;
    });

    // 页面操作
    $('#buttonRCtrl').find('dd').each(function () {
        $(this).on('click', function () {
            var eName = $(this).children('a').attr('data-eName');
            tab.tabCtrl(eName);
        });
    });

    //页面加载时判断左侧菜单是否显示
    //通过顶部菜单获取左侧菜单
    $("body").on("click", ".topLevelMenus li,.mobileTopLevelMenus dd", function () {
        if ($(this).parents(".mobileTopLevelMenus").length != "0") {
            $(".topLevelMenus li").eq($(this).index()).addClass("layui-this").siblings().removeClass("layui-this");
        } else {
            $(".mobileTopLevelMenus dd").eq($(this).index()).addClass("layui-this").siblings().removeClass("layui-this");
        }
        $(".layui-layout-admin").removeClass("showMenu");
        $("body").addClass("site-mobile");
        tab.render({ menuType: $(this).data("menu") });
        //渲染顶部窗口
        tab.tabMove();
    });

    //隐藏左侧导航
    $(".hideMenu").click(function () {
        if ($(".topLevelMenus li.layui-this a").data("url")) {
            layer.msg("此栏目状态下左侧菜单不可展开");  //主要为了避免左侧显示的内容与顶部菜单不匹配
            return false;
        }
        $(".layui-layout-admin").toggleClass("showMenu");
        //渲染顶部窗口
        tab.tabMove();
    });

    //手机设备的简单适配
    $('.site-tree-mobile').on('click', function () {
        $('body').addClass('site-mobile');
    });
    $('.site-mobile-shade').on('click', function () {
        $('body').removeClass('site-mobile');
    });

    // 添加新窗口
    $("body").on("click", ".layui-nav .layui-nav-item a:not('.mobileTopLevelMenus .layui-nav-item a')", function () {
        //如果不存在子级
        if ($(this).siblings().length == 0) {
            tab.tabAdd($(this));
            $('body').removeClass('site-mobile');  //移动端点击菜单关闭菜单层
        }
        $(this).parent("li").siblings().removeClass("layui-nav-itemed");
    });

    //删除tab
    $("body").on("click", ".top_tab li i.layui-tab-close", function () {
        tab.deleteTab($(this));
    });

    //切换后获取当前窗口的内容
    $("body").on("click", ".top_tab li", function () {
        tab.shiftTab($(this));
    });

    //清除缓存
    $(".clearCache").click(function () {
        cache.clear();
        var index = layer.msg('清除缓存中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            layer.close(index);
            layer.msg("缓存清除成功！");
        }, 1000);
    });

    //刷新后还原打开的窗口
    if (cacheStr == "true") {
        if (cache.getItem("menu") != null) {
            menu = cache.getItem("menu");
            curmenu = cache.getItem("curmenu");
            var openTitle = '';
            for (var i = 0; i < menu.length; i++) {
                openTitle = '';
                if (menu[i].icon) {
                    if (menu[i].icon.split("-")[0] == 'icon') {
                        openTitle += '<i class="seraph ' + menu[i].icon + '"></i>';
                    } else {
                        openTitle += '<i class="layui-icon">' + menu[i].icon + '</i>';
                    }
                }
                openTitle += '<cite>' + menu[i].title + '</cite>';
                openTitle += '<i class="layui-icon layui-unselect layui-tab-close" lay-id="' + menu[i].layId + '">&#x1006;</i>';
                element.tabAdd("bodyTab", {
                    title: openTitle,
                    content: "<iframe src='" + menu[i].href + "' lay-id='" + menu[i].layId + "'></frame>",
                    id: menu[i].layId
                })
                //定位到刷新前的窗口
                if (curmenu != "undefined") {
                    if (curmenu == '' || curmenu == "null") {  //定位到后台首页
                        element.tabChange("bodyTab", '');
                    } else if (JSON.parse(curmenu).title == menu[i].title) {  //定位到刷新前的页面
                        element.tabChange("bodyTab", menu[i].layId);
                    }
                } else {
                    element.tabChange("bodyTab", menu[menu.length - 1].layId);
                }
            }
            //渲染顶部窗口
            tab.tabMove();
        }
    } else {
        cache.removeItem("menu");
        cache.removeItem("curmenu");
    }

});



//捐赠弹窗
function donation() {
    layer.tab({
        area: ['260px', '367px'],
        tab: [{
            title: "微信",
            content: "<div style='padding:30px;overflow:hidden;background:#d2d0d0;'><img src='/images/wechat.jpg'></div>"
        },
        {
            title: "支付宝",
            content: "<div style='padding:30px;overflow:hidden;background:#d2d0d0;'><img src='/images/alipay.jpg'></div>"
        }]
    });
}

//图片管理弹窗
function showImg() {
    $.getJSON('/json/images.json', function (json) {
        var res = json;
        layer.photos({
            photos: res,
            anim: 5
        });
    });
}