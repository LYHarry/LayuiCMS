layui.use(['form', 'layer', 'laydate', 'table', 'common', 'jquery'], function () {
    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        $bw = layui.common,
        $ = layui.jquery;

    laydate.render({
        elem: '.layui-date-input',
        type: 'date',
        trigger: "click",
        range: true
    });

    //上传分享图片
    $bw.uploadFile({
        elem: '#shareIconhBtn',
        callback: function (res, index, upload) {
            $('#shareIconPath').val(res.Data.RelativePath);
            $('#showShareIconBox').removeClass('layui-hide').find('img').attr('src', window.httpHeader + res.Data.RelativePath);
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
        //添加优惠券活动
        $bw.ajax({
            url: '/api/CouponActivity/AddActivity',
            data: ajaxData,
            callback: function (res) {
                $bw.reloadForm();
            }
        });
        return false;
    });

    //得到优惠券列表 列模板
    var couponCols = getCouponListCols();
    table.render({
        id: "CouponActListTable",
        elem: '#CouponActListTable',
        toolbar: '#couponToolbar',
        defaultToolbar: [],
        data: [],
        cols: [[
            { type: 'numbers' },
            ...couponCols,
            { title: '操作', width: 170, templet: '#couponListBar', fixed: "right", align: "center" }
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
        $bw.ajax({
            url: '/api/CouponTemplate/CouponList',
            callback: function (res) {
                layer.open({
                    title: "添加优惠券",
                    type: 1,
                    area: ['80%', '80%'],
                    btn: ['确定', '取消'],
                    content: $('#couponListBox'),
                    success: function (layero, index) {
                        table.render({
                            id: "couponListTable",
                            elem: '#couponListTable',
                            page: true,
                            data: res.Data.Items,
                            cols: [[
                                { type: 'checkbox' },
                                ...couponCols
                            ]]
                        });
                    },
                    yes: function (index, layero) {
                        var checkStatus = table.checkStatus('couponListTable');
                        //保存选择的优惠券
                        var conpouIds = checkStatus.data.map(element => {
                            return element.CouponId;
                        });
                        $('#conpouIdList').val(conpouIds.join(','));
                        table.reload("CouponActListTable", {
                            data: checkStatus.data
                        });
                        layer.close(index);
                    }
                });
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
                    if (d.RuleType == 3) return (d.Discount + '折，最多 ' + d.DiscountUpperLimit + '元');
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
                    return '';
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
                    return '';
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
        }
    });

    //线下活动模板切换
    form.on('select(SeltActivityType)', function (data) {
        var val = parseInt(data.value);
        val = isNaN(val) ? 0 : val;
        if (val === 1) { //线上活动
            $('#couponMainBox').find('div.layui-form-item').show();
            $('#shareMainBox').show();
        } else if (val === 2) { //线下活动
            $('#couponMainBox').find('div.layui-form-item').hide();
            $('#shareMainBox').hide();
        }
    });

    $(function () {

        var actId = $bw.getUrlParam('id');
        if (actId) {
            $bw.ajax({
                type: 'get',
                url: '/api/CouponActivity/CouponActivityById',
                data: { id: actId },
                callback: function (res) {
                    form.val("actDetailForm", {
                        "ActivityTitle": res.Data.ActivityTitle,
                        "ActivityType": res.Data.ActivityType,
                        "ActivityUrlPath": res.Data.ActivityUrlPath,
                        "IndateDate": ($bw.formatUnixDate(res.Data.IndateStartDate, 'year') + ' - ' + $bw.formatUnixDate(res.Data.IndateEndDate, 'year')),
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
                    $('#showShareIconBox').removeClass('layui-hide').find('img').attr('src', window.httpHeader + res.Data.IconPath);
                    table.reload("CouponActListTable", {
                        data: res.Data.Coupons
                    });
                }
            });
        }
    });



});