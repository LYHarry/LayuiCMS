layui.use(['form', 'layer', 'laydate', 'table', 'common', 'jquery'], function () {
    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        $bw = layui.common,
        $ = layui.jquery;

    //上一次选中的优惠数据
    var lastCheckCouponData = [];

    laydate.render({
        elem: '.layui-date-input',
        type: 'datetime',
        trigger: "click",
        range: true
    });

    //上传分享图片
    $bw.uploadFile({
        elem: '#shareIconhBtn',
        size: 200,
        callback: function (res, index, upload) {
            $('#shareIconPath').val(res.Data.RelativePath);
            $('#showShareIconBox').removeClass('layui-hide').find('img').attr('src', $Conf.httpHeader + res.Data.RelativePath);
        }
    });

    //监听 form 提交事件
    form.on('submit(addCouponActBtn)', function (data) {
        var ajaxData = data.field;
        //活动有效日期
        var date = ajaxData.IndateDate.split(' - ');
        if (date.length && date.length > 1) {
            ajaxData.IndateStartDate = date[0];
            ajaxData.IndateEndDate = date[1];
            ajaxData.IndateEndDate = $bw.formatEndDate(ajaxData.IndateEndDate);
        }
        //优惠券
        var conponIds = $('#conpouIdList').val();
        conponIds = conponIds.split(',');
        ajaxData.Coupons = [];
        conponIds.forEach(element => {
            element = element || '';
            if ($.trim(element) !== '') {
                ajaxData.Coupons.push({ CouponId: element });
            }
        });
        if (ajaxData.Coupons.length < 1) {
            layer.msg('活动需添加绑定优惠劵');
            return false;
        }
        //数组格式处理
        ajaxData.TotalGetNum = parseInt(ajaxData.TotalGetNum);
        ajaxData.TotalCouponAmount = parseFloat(ajaxData.TotalCouponAmount);
        var url = '/api/CouponActivity/AddActivity';
        if (ajaxData.ActivityId) {
            ajaxData.Id = ajaxData.ActivityId;
        }
        if ($('#ActivityIdHid').data('edit') == '1') {
            url = '/api/CouponActivity/UpdateCouponActivity';
        }
        //活动地址处理
        ajaxData.ActivityUrlPath = filterActUrl(ajaxData.ActivityUrlPath);
        //设置优惠券活动
        $bw.ajax({
            url: url,
            data: ajaxData,
            callback: function (res) {
                $bw.reloadForm();
            }
        });
        return false;
    });

    //得到优惠券列表 列模板
    var couponCols = getCouponListCols();
    var isdetail = $bw.getUrlParam('detail');
    if (isdetail === null) {
        couponCols.push({ title: '操作', templet: '#couponListBar', fixed: "right", align: "center" });
    }
    table.render({
        id: "CouponActListTable",
        elem: '#CouponActListTable',
        toolbar: isdetail === null ? '#couponToolbar' : '',
        defaultToolbar: [],
        data: [],
        cols: [[
            { field: 'XH', title: '序号', type: 'numbers' },
            ...couponCols
        ]]
    });

    table.on('toolbar(CouponActListTable)', function (obj) {
        //添加优惠券
        if (obj.event === 'addCoupon') {
            addCoupon();
            return false;
        }
    });

    //添加优惠券
    function addCoupon() {
        layer.open({
            title: "添加优惠券",
            type: 1,
            area: ['80%', '80%'],
            btn: ['确定', '取消'],
            content: $('#couponListBox'),
            success: function (layero, index) {
                var couponCols = getCouponListCols();
                $bw.showTableList({
                    id: "couponListTable",
                    elem: '#couponListTable',
                    cols: [
                        { type: 'checkbox' },
                        ...couponCols
                    ],
                    data: {
                        url: '/api/CouponTemplate/CouponList',
                        DateStatus: 2
                    }
                });
            },
            yes: function (index, layero) {
                var checkStatus = table.checkStatus('couponListTable');
                //得到这次选择的优惠券ID
                var conpouIds = checkStatus.data.map(element => {
                    return element.CouponId;
                });
                //过滤已选择的重复优惠券
                lastCheckCouponData = lastCheckCouponData.filter(item => conpouIds.indexOf(item.CouponId) === -1);
                lastCheckCouponData.push(...checkStatus.data);
                //保存选择的优惠券
                conpouIds = lastCheckCouponData.map(element => {
                    return element.CouponId;
                });
                $('#conpouIdList').val(conpouIds.join(','));
                table.reload("CouponActListTable", {
                    data: lastCheckCouponData
                });
                layer.close(index);
            }
        });

    }

    //得到优惠券列表 列模板
    function getCouponListCols() {
        return [
            { field: 'CouponId', title: '优惠券id', hide: true },
            { field: 'CouponTempName', title: '优惠券名称', align: "center" },
            {
                field: 'RuleType', title: '金额规则', templet: function (d) {
                    if (d.RuleType == 1) return '满减';
                    if (d.RuleType == 2) return '立减';
                    if (d.RuleType == 3) return '折扣';
                    return '';
                }
            },
            {
                field: 'CreditAmount', title: '优惠金额', align: 'center', templet: function (d) {
                    if (d.RuleType == 1) return ('满 ' + d.SatisfyAmount + '元 减 ' + d.CreditAmount + '元');
                    if (d.RuleType == 2) return ('立减 ' + d.CreditAmount + '元');
                    if (d.RuleType == 3) return (d.Discount + '折' + (d.DiscountUpperLimit > 0 ? '，最多 ' + d.DiscountUpperLimit + '元' : ''));
                    return '';
                }
            },
            {
                field: 'CategoryType', title: '品类规则', align: 'center', templet: function (d) {
                    var serviceType = 0;
                    if (d.CategoryList && d.CategoryList.length) {
                        serviceType = d.CategoryList[0].ServiceType;
                    } else {
                        serviceType = d.CategoryType;
                    }
                    serviceType = parseInt(serviceType);
                    serviceType = isNaN(serviceType) ? 0 : serviceType;
                    if (serviceType == 1) return '拼车';
                    if (serviceType == 2) return '专车';
                    return '不限';
                }
            },
            {
                field: 'Citys', title: '城市限制', align: 'center', templet: function (d) {
                    if (d.Citys.length) {
                        return d.Citys.map(element => {
                            return element.CityName + ' ';
                        });
                    }
                    return '不限';
                }
            },
            {
                field: 'IndateType', title: '有效期', align: 'center', templet: function (d) {
                    if (d.IndateType == 1) return ($bw.formatUnixDate(d.IndateDateTime, 'year') + ' 到期');
                    if (d.IndateType == 2) return (d.IndataDay + '天内');
                    if (d.IndateType == 3) return ($bw.formatUnixDate(d.IndateStartDateTime, 'year') + '到' + $bw.formatUnixDate(d.IndateDateTime, 'year'));
                    return '不限期';
                }
            }

        ];
    }

    table.on('tool(CouponActListTable)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除
            var conpouIds = $('#conpouIdList').val();
            conpouIds = conpouIds.split(',');
            conpouIds = conpouIds.map(element => {
                if (element !== data.CouponId) {
                    return element;
                }
            });
            $('#conpouIdList').val(conpouIds.join(','));
            obj.del();
            lastCheckCouponData = lastCheckCouponData.filter(item => item.CouponId !== data.CouponId);
        }
    });

    //线下活动模板切换
    form.on('select(SeltActivityType)', function (data) {
        var val = parseInt(data.value);
        val = isNaN(val) ? 0 : val;
        if (val === 1) { //线上活动
            $('#couponMainBox').find('div.layui-form-item').show();
            $('#shareMainBox,#ActivityUrlBox').show();
        } else if (val === 2) { //线下活动
            $('#couponMainBox').find('div.layui-form-item').hide();
            $('#shareMainBox,#ActivityUrlBox').hide();
        }
    });

    $(function () {
        var actId = $bw.getUrlParam('id');
        if (actId) { //编辑
            $bw.ajax({
                type: 'get',
                url: '/api/CouponActivity/CouponActivityById',
                data: { id: actId },
                callback: function (res) {
                    $('#ActivityIdHid').val(res.Data.ActivityId).attr("data-edit", '1');
                    form.val("actDetailForm", {
                        "ActivityTitle": res.Data.ActivityTitle,
                        "ActivityType": res.Data.ActivityType,
                        "ActivityUrlPath": res.Data.ActivityUrlPath,
                        "IndateDate": ($bw.formatUnixDate(res.Data.IndateStartDate, 'second') + ' - ' + $bw.formatUnixDate(res.Data.IndateEndDate, 'second')),
                        "State": res.Data.State,
                        "TotalGetNum": res.Data.TotalGetNum,
                        "TotalCouponAmount": res.Data.TotalCouponAmount,
                        "ActivitySendType": res.Data.ActivitySendType,
                        "ActivityRuleType": res.Data.ActivityRuleType,
                        "ActivityUserTag": res.Data.ActivityUserTag,
                        "Title": res.Data.Title,
                        "KeyWord": res.Data.KeyWord,
                        "IconPath": res.Data.IconPath,
                        "Describe": res.Data.Describe,
                    });
                    $('#showShareIconBox').removeClass('layui-hide').find('img').attr('src', $Conf.httpHeader + res.Data.IconPath);
                    //保存选择的优惠券
                    var conpouIds = res.Data.Coupons.map(element => {
                        return element.CouponId;
                    });
                    lastCheckCouponData.push(...res.Data.Coupons);
                    $('#conpouIdList').val(conpouIds.join(','));
                    table.reload("CouponActListTable", {
                        data: res.Data.Coupons
                    });
                    if (res.Data.ActivityType === 2) { //线下活动
                        $('#couponMainBox').find('div.layui-form-item').hide();
                        $('#shareMainBox,#ActivityUrlBox').hide();
                    }
                }
            });

        } else { //新增
            $bw.ajax({
                type: 'get',
                url: '/api/CouponActivity/CreateActivityId',
                callback: function (res) {
                    $('#ActivityIdHid').val(res.Data).attr("data-add", '1');
                    $('#ActivityIdHiht').html('活动ID: ' + res.Data);
                }
            });

        }
    });

    //添加优惠券列表搜索监听
    form.on('submit(couponSerchBtn)', function (data) {
        var ajaxData = data.field;
        ajaxData.CategoryType = $(".CategoryType").attr('data-value');
        ajaxData.RuleType = $(".RuleType").attr('data-value');
        ajaxData.CategoryType = parseInt(ajaxData.CategoryType);
        ajaxData.RuleType = parseInt(ajaxData.RuleType);
        ajaxData = $bw.dealParam(ajaxData);
        table.reload("couponListTable", {
            page: { curr: 1 },
            where: ajaxData
        });
        return false;
    });

    //平辅 标签 搜索
    $('.bw-search-list').on('click', function (e) {
        e.stopPropagation();
        $(this).parent().attr('data-value', this.dataset.value).find('.bw-search-list').removeClass('active');
        $(this).addClass('active');
        $('.couponSerchBtn').click();
    });

    //转换活动短链接地址
    $('#transActUrlBtn').on('click', function () {
        var url = $('#ActivityUrlPath').val();
        if (url == '') return false;
        if (url.indexOf('thzx.ltd') != -1) return false;
        //处理活动地址
        url = filterActUrl(url);
        $bw.ajax({
            url: '/api/CouponActivity/CreateShortLinks',
            data: { LongLink: url },
            callback: function (res) {
                $('#ActivityUrlPath').val(res.Data);
            }
        });
    });


    //过滤活动地址
    function filterActUrl(url) {
        url = url || '';
        if (url == '') return url;
        if (url.toLowerCase().indexOf('thzx.ltd') != -1) return url; //短链接
        if (url.toLowerCase().indexOf('activityid=') != -1) return url;

        url += url.indexOf('?') == -1 ? '?' : '&';
        url = url + 'activityId=' + $('#ActivityIdHid').val();
        return url;
    }

});