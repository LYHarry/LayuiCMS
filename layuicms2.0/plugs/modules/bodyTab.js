layui.define(["element", "jquery", 'layer', 'storage'], function (exports) {
	'use strict';

	var element = layui.element,
		$ = layui.$,
		layer = layui.layer,
		cache = layui.storage,
		TabElem = {
			'tabIdIndex': 0,
			'tabFilter': '',
			'tabContainer': null,
			isChangeRefresh: false
		};

	var Tab = function () {
		// TabNav 配置
		this.tabConfig = {
			elem: undefined, // 菜单容器
			url: '',  // 菜单数据请求地址
			ajaxType: 'get' // ajax 请求方式			
		}
	};

	//参数设置
	Tab.prototype.set = function (option) {
		var _this = this;
		$.extend(true, _this.tabConfig, option);
		return _this;
	};

	// 初始化参数
	Tab.prototype.init = function () {
		var _config = this.tabConfig;
		if (typeof (_config.elem) !== 'string' && typeof (_config.elem) !== 'object') {
			throw new Error('未配置 elem 容器参数');
		}
		// 若为字符串
		var $container;
		if (typeof (_config.elem) === 'string') { $container = $('' + _config.elem + ''); }
		// 若为object
		if (typeof (_config.elem) === 'object') { $container = _config.elem; }
		if ($container.length == 0) {
			throw new Error('elem 容器参数配置出错');
		}
		if (typeof (_config.tabElem) !== 'string') {
			throw new Error('未配置 tabElem Tab导航容器参数');
		}
		var $tabContainer = $('' + _config.tabElem + '');
		if ($tabContainer.length == 0) {
			throw new Error('tabElem Tab导航容器参数配置出错');
		}
		var filter = $tabContainer.attr('lay-filter');
		if (filter === undefined || filter === '') {
			throw new Error('请为 tabElem 容器设置一个lay-filter过滤器');
		}
		_config.elem = $container;
		TabElem.tabFilter = filter;
		TabElem.tabContainer = $tabContainer;
		TabElem.isChangeRefresh = cache.getItem("changeRefresh") || false;
		return this;
	};

	//得到菜单数据
	Tab.prototype.pullData = function (option) {
		var _config = this.tabConfig;
		var url = option.url || _config.url
		if (url == '') {
			throw new Error('未设置 url 数据请求地址');
		}
		var type = option.ajaxType || _config.ajaxType || 'get';
		var params = option.params || _config.params || {};
		$.ajax({
			url: url,
			type: type,
			data: params,
			dataType: 'json',
			success: function (res) {
				if (typeof (option.callback) == "function") {
					option.callback(res);
				}
			},
			error: function (err) {
				console.error(err);
			}
		});
	};

	//渲染菜单数据
	Tab.prototype.render = function (option) {
		this.init(); //初始化参数
		var $container = this.tabConfig.elem;
		var _this = this;
		//得到菜单数据
		this.pullData({
			callback: function (res) {
				//显示左侧菜单
				var mhtml = '<li class="layui-nav-item layui-this">';
				mhtml += '    <a data-url="/page/main.html">';
				mhtml += '		 <i class="layui-icon" data-icon="&#xe68e;">&#xe68e;</i>';
				mhtml += '		 <cite>后台首页</cite>';
				mhtml += '    </a>';
				mhtml += '</li>';
				$container.find('ul.layui-nav').html(mhtml);
				var dataSource = [];
				switch (option.menuType) {
					case 'memberCenter': dataSource = res.memberCenter; break;
					case 'systemeSttings': dataSource = res.systemeSttings; break;
					case 'seraphApi': dataSource = res.seraphApi; break;
					case 'contentManagement': dataSource = res.contentManagement; break;
					default: dataSource = res; break;
				}
				mhtml = _this.navBar(dataSource);
				$container.find('ul.layui-nav').append(mhtml).height($(window).height() - 210);
				element.init();  //初始化页面元素
				$(window).resize(function () {
					$container.height($(window).height() - 210);
				});
			}
		});
	};

	//生成左侧菜单
	Tab.prototype.navBar = function (data) {
		data = data || [];
		if (data.length < 1) {
			throw new Error('dataSource 菜单数据源出错');
		}
		if (typeof (data) == "string") { data = JSON.parse(data); }
		var ulHtml = '';
		for (var i = 0; i < data.length; i++) {
			if (data[i].spread || data[i].spread == undefined) {
				ulHtml += '<li class="layui-nav-item layui-nav-itemed">';
			} else {
				ulHtml += '<li class="layui-nav-item">';
			}
			if (data[i].children != undefined && data[i].children.length > 0) {
				ulHtml += '<a>';
				if (data[i].icon != undefined && data[i].icon != '') {
					if (data[i].icon.indexOf("icon-") != -1) {
						ulHtml += '<i class="seraph ' + data[i].icon + '" data-icon="' + data[i].icon + '"></i>';
					} else {
						ulHtml += '<i class="layui-icon" data-icon="' + data[i].icon + '">' + data[i].icon + '</i>';
					}
				}
				ulHtml += '<cite>' + data[i].title + '</cite>';
				ulHtml += '<span class="layui-nav-more"></span>';
				ulHtml += '</a>';
				ulHtml += '<dl class="layui-nav-child">';
				for (var j = 0; j < data[i].children.length; j++) {
					if (data[i].children[j].target == "_blank") {
						ulHtml += '<dd><a data-url="' + data[i].children[j].href + '" target="' + data[i].children[j].target + '">';
					} else {
						ulHtml += '<dd><a data-url="' + data[i].children[j].href + '">';
					}
					if (data[i].children[j].icon != undefined && data[i].children[j].icon != '') {
						if (data[i].children[j].icon.indexOf("icon-") != -1) {
							ulHtml += '<i class="seraph ' + data[i].children[j].icon + '" data-icon="' + data[i].children[j].icon + '"></i>';
						} else {
							ulHtml += '<i class="layui-icon" data-icon="' + data[i].children[j].icon + '">' + data[i].children[j].icon + '</i>';
						}
					}
					ulHtml += '<cite>' + data[i].children[j].title + '</cite></a></dd>';
				}
				ulHtml += "</dl>";
			} else {
				if (data[i].target == "_blank") {
					ulHtml += '<a data-url="' + data[i].href + '" target="' + data[i].target + '">';
				} else {
					ulHtml += '<a data-url="' + data[i].href + '">';
				}
				if (data[i].icon != undefined && data[i].icon != '') {
					if (data[i].icon.indexOf("icon-") != -1) {
						ulHtml += '<i class="seraph ' + data[i].icon + '" data-icon="' + data[i].icon + '"></i>';
					} else {
						ulHtml += '<i class="layui-icon" data-icon="' + data[i].icon + '">' + data[i].icon + '</i>';
					}
				}
				ulHtml += '<cite>' + data[i].title + '</cite></a>';
			}
			ulHtml += '</li>';
		}
		return ulHtml;
	};

	//渲染顶部导航
	Tab.prototype.renderRoof = function (option) {
		if (typeof (option.elem) !== 'string' && typeof (option.elem) !== 'object') {
			throw new Error('未配置 elem 容器参数');
		}
		// 若为字符串
		var $container;
		if (typeof (option.elem) === 'string') { $container = $('' + option.elem + ''); }
		// 若为object
		if (typeof (option.elem) === 'object') { $container = option.elem; }
		if ($container.length == 0) {
			throw new Error('elem 容器参数配置出错');
		}
		//得到菜单数据
		this.pullData({
			url: option.url,
			callback: function (res) {
				//显示顶部菜单
				var html = '', pchtml = '', mhtml = '';
				for (var i = 0; i < res.length; i++) {
					html = '';
					if (res[i].href != undefined && res[i].href != '') {
						html += '<a href="javascript:;" data-url="' + res[i].href + '">';
					} else {
						html += '<a href="javascript:;" >';
					}
					if (res[i].icon != undefined && res[i].icon != '') {
						if (res[i].icon.indexOf("icon-") != -1) {
							html += '<i class="seraph ' + res[i].icon + '" data-icon="' + res[i].icon + '"></i>';
						} else {
							html += '<i class="layui-icon" data-icon="' + res[i].icon + '">' + res[i].icon + '</i>';
						}
					}
					html += '  <cite>' + res[i].title + '</cite>';
					html += '</a>';

					pchtml += '<li class="layui-nav-item"  data-menu="' + res[i].menuName + '">' + html + '</li>';
					mhtml += '<dd data-menu="' + res[i].menuName + '">' + html + '</dd>';
				}
				$container.find('ul.topLevelMenus').html(pchtml); // pc端菜单
				$container.find('dl.layui-nav-child').html(mhtml); // 移动端菜单
				element.init();  //初始化页面元素
			}
		});
	};

	//是否点击窗口切换刷新页面
	Tab.prototype.changeRegresh = function (index) {
		if (TabElem.isChangeRefresh) {
			$(".clildFrame .layui-tab-item").eq(index).find("iframe")[0].contentWindow.location.reload();
		}
	};

	//通过title获取lay-id
	Tab.prototype.getLayId = function (title) {
		var layId = '0';
		TabElem.tabContainer.find('ul.layui-tab-title li').each(function () {
			if ($(this).find("cite").text() == title) {
				layId = $(this).attr("lay-id"); return false;
			}
		});
		return layId;
	};

	//通过title判断tab是否存在
	Tab.prototype.hasTab = function (title) {
		var tabIndex = -1;
		TabElem.tabContainer.find('ul.layui-tab-title li').each(function () {
			if ($(this).find("cite").text() == title) {
				tabIndex = 1; return false;
			}
		});
		return tabIndex;
	};

	//右侧内容tab操作
	Tab.prototype.tabAdd = function (_this) {
		var menu = [];
		if (cache.isExist("menu")) { menu = cache.getItem("menu"); }
		var that = this;
		var openTabNum = that.tabConfig.openTabNum;
		if (_this.attr("target") == "_blank") {
			window.open(_this.attr("data-url"));
		} else if (_this.attr("data-url") != undefined) {
			var title = '';
			if (_this.find("i.seraph,i.layui-icon").attr("data-icon") != undefined) {
				if (_this.find("i.seraph").attr("data-icon") != undefined) {
					title += '<i class="seraph ' + _this.find("i.seraph").attr("data-icon") + '"></i>';
				} else {
					title += '<i class="layui-icon">' + _this.find("i.layui-icon").attr("data-icon") + '</i>';
				}
			}
			//已打开的窗口中不存在
			if (that.hasTab(_this.find("cite").text()) == -1 && _this.siblings("dl.layui-nav-child").length == 0) {
				if ($(".layui-tab-title.top_tab li").length == openTabNum) {
					layer.msg('只能同时打开' + openTabNum + '个选项卡哦。不然系统会卡的！');
					return;
				}
				TabElem.tabIdIndex++;
				title += '<cite>' + _this.find("cite").text() + '</cite>';
				title += '<i class="layui-icon layui-unselect layui-tab-close" lay-id="' + TabElem.tabIdIndex + '">&#x1006;</i>';
				element.tabAdd(TabElem.tabFilter, {
					title: title,
					content: "<iframe src='" + _this.attr("data-url") + "' lay-id='" + TabElem.tabIdIndex + "'></iframe>",
					id: new Date().getTime()
				})
				//当前窗口内容
				var curmenu = {
					"icon": _this.find("i.seraph").attr("data-icon") != undefined ? _this.find("i.seraph").attr("data-icon") : _this.find("i.layui-icon").attr("data-icon"),
					"title": _this.find("cite").text(),
					"href": _this.attr("data-url"),
					"layId": new Date().getTime()
				}
				menu.push(curmenu);
				cache.setItem("menu", menu); //打开的窗口
				cache.setItem("curmenu", curmenu);  //当前的窗口
				element.tabChange(TabElem.tabFilter, that.getLayId(_this.find("cite").text()));
				that.tabMove(); //顶部窗口是否可滚动
			} else {
				//当前窗口内容
				var curmenu = {
					"icon": _this.find("i.seraph").attr("data-icon") != undefined ? _this.find("i.seraph").attr("data-icon") : _this.find("i.layui-icon").attr("data-icon"),
					"title": _this.find("cite").text(),
					"href": _this.attr("data-url")
				}
				that.changeRegresh(_this.parent('.layui-nav-item').index());
				cache.setItem("curmenu", curmenu);  //当前的窗口
				element.tabChange(TabElem.tabFilter, that.getLayId(_this.find("cite").text()));
				that.tabMove(); //顶部窗口是否可滚动
			}
		}
	};

	//顶部窗口移动
	Tab.prototype.tabMove = function () {
		$(window).on("resize", function (event) {
			var topTabsBoxWidth = TabElem.tabContainer.width(),
				topTabs = TabElem.tabContainer.find('ul.layui-tab-title'),
				topTabsWidth = topTabs.width(),
				tabLi = topTabs.find("li.layui-this"),
				top_tabs = topTabs,
				event = event || window.event;

			//拖动效果
			var flag = false;
			var cur = { x: 0, y: 0 };
			var nx, dx, x;
			function down(event) {
				flag = true;
				var touch;
				if (event.touches) {
					touch = event.touches[0];
				} else {
					touch = event;
				}
				cur.x = touch.clientX;
				dx = top_tabs.offsetLeft;
			}
			function move(event) {
				if (flag) {
					window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
					var touch;
					if (event.touches) {
						touch = event.touches[0];
					} else {
						touch = event;
					}
					nx = touch.clientX - cur.x;
					x = dx + nx;
					if (x > 0) {
						x = 0;
					} else {
						if (x < topTabsBoxWidth - topTabsWidth) {
							x = topTabsBoxWidth - topTabsWidth;
						} else {
							x = dx + nx;
						}
					}
					top_tabs.style.left = x + "px";
					//阻止页面的滑动默认事件
					document.addEventListener("touchmove", function () {
						event.preventDefault();
					}, false);
				}
			}
			//鼠标释放时候的函数
			function end() {
				flag = false;
			}

			if (topTabsWidth > topTabsBoxWidth) {
				if (tabLi.position().left > topTabsBoxWidth || tabLi.position().left + topTabsBoxWidth > topTabsWidth) {
					topTabs.css("left", topTabsBoxWidth - topTabsWidth);
				} else {
					topTabs.css("left", -tabLi.position().left);
				}
				//pc端拖动效果
				topTabs.on("mousedown", down);
				topTabs.on("mousemove", move);
				$(document).on("mouseup", end);
				//移动端拖动效果
				topTabs.on("touchstart", down);
				topTabs.on("touchmove", move);
				topTabs.on("touchend", end);
			} else {
				//移除pc端拖动效果
				topTabs.off("mousedown", down);
				topTabs.off("mousemove", move);
				topTabs.off("mouseup", end);
				//移除移动端拖动效果
				topTabs.off("touchstart", down);
				topTabs.off("touchmove", move);
				topTabs.off("touchend", end);
				topTabs.removeAttr("style");
				return false;
			}
		}).resize();
	};

	// 获取当前获得焦点的tabid
	Tab.prototype.getCurrentTabId = function () {
		var layid = TabElem.tabContainer.find('ul.layui-tab-title').children('li.layui-this').attr('lay-id');
		return layid || '0';
	};

	// tab操作
	Tab.prototype.tabCtrl = function (eventsName) {
		this.init(); //初始化参数
		switch (eventsName) {
			case 'refreshCurrent': // 刷新当前窗口
				{
					var frame = $(".clildFrame .layui-tab-item.layui-show").find("iframe")[0];
					if (!$(frame).hasClass("refreshThis")) {
						$(frame).addClass("refreshThis");
						frame.contentWindow.location.reload();
						setTimeout(() => {
							$(frame).removeClass("refreshThis");
						}, 2000);
					} else {
						layer.msg("您点击的速度超过了服务器的响应速度，还是等两秒再刷新吧！");
					}
				} break;
			case 'closeCurrent': //关闭当前
				{
					var currentTabID = this.getCurrentTabId();
					if (currentTabID != '0') {
						element.tabDelete(TabElem.tabFilter, currentTabID);
						this.tabMove(); //渲染顶部窗口
					} else {
						layer.msg('默认首页不能关闭的哦');
					}
				}
				break;
			case 'closeOther': //关闭其他
				{
					var currentTabID = this.getCurrentTabId();
					var titleBox = TabElem.tabContainer.find("ul.layui-tab-title");
					if (titleBox.children('li').length > 2) {
						titleBox.children('li').each(function () {
							var layid = $(this).attr("lay-id") || '0';
							if (layid != currentTabID && layid != '0') {
								element.tabDelete(TabElem.tabFilter, layid);
							}
						});
						this.tabMove(); //渲染顶部窗口
					} else if (titleBox.children('li').length == 2) {
						layer.msg('默认首页不能关闭的哦');
					} else {
						layer.msg("没有可以关闭的窗口了");
					}
				}
				break;
			case 'closeAll': //全部关闭
				{
					var titleBox = TabElem.tabContainer.find("ul.layui-tab-title");
					if (titleBox.children('li').length > 1) {
						titleBox.children('li').each(function () {
							var layid = $(this).attr("lay-id") || '0';
							if (layid != '0') {
								element.tabDelete(TabElem.tabFilter, layid).init();
								cache.removeItem("menu");
								cache.removeItem("curmenu");
							}
						});
						this.tabMove(); //渲染顶部窗口
					} else {
						layer.msg('默认首页不能关闭的哦');
					}
				}
				break;
		}
	};

	// 删除指定的tab选项卡
	Tab.prototype.deleteTab = function (_this) {
		this.init(); //初始化参数
		//删除tab后重置session中的menu和curmenu
		var liIndex = _this.parent("li").index();
		var menu = cache.getItem("menu");
		if (menu != null) {
			//获取被删除元素
			delMenu = menu[liIndex - 1];
			var curmenu = cache.getItem("curmenu") || '';
			if (JSON.stringify(curmenu) != JSON.stringify(menu[liIndex - 1])) {  //如果删除的不是当前选中的tab				
				curNav = JSON.stringify(curmenu);
			} else {
				if (_this.parent("li").length > liIndex) {
					cache.setItem("curmenu", curmenu);
					curNav = curmenu;
				} else {
					cache.setItem("curmenu", JSON.stringify(menu[liIndex - 1]));
					curNav = JSON.stringify(menu[liIndex - 1]);
				}
			}
			menu.splice((liIndex - 1), 1);
			cache.setItem("menu", JSON.stringify(menu));
		}
		element.tabDelete(TabElem.tabFilter, _this.parent("li").attr("lay-id")).init();
		this.tabMove();  //渲染顶部窗口
	};

	//切换后获取当前窗口的内容
	Tab.prototype.shiftTab = function (_this) {
		var curmenu = '';
		var menu = cache.getItem("menu");
		if (menu) { curmenu = menu[_this.index() - 1]; }
		if (_this.index() == 0) {
			cache.setItem("curmenu", '');
		} else {
			cache.setItem("curmenu", curmenu);
			if (cache.getItem("curmenu") == "undefined") {
				//如果删除的不是当前选中的tab,则将curmenu设置成当前选中的tab
				if (curNav != JSON.stringify(delMenu)) {
					cache.setItem("curmenu", curNav);
				} else {
					cache.setItem("curmenu", menu[liIndex - 1]);
				}
			}
		}
		element.tabChange(TabElem.tabFilter, _this.attr("lay-id")).init();
		this.changeRegresh(_this.index());
		setTimeout(() => {
			this.tabMove();
		}, 100);
	};

	var tabbar = new Tab();
	exports("bodyTab", function (option) {
		return tabbar.set(option);
	});
});
