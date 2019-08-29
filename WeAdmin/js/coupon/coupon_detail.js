layui.use(['form', 'layer', 'laydate', 'multiSelect', 'common'], function () {
    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        $ = layui.jquery,
        $bw = layui.common,
        multiSelect = layui.multiSelect;

    $(function () {
        //显示金额默认规则
        $bw.showTpl($('#tpl_CouponRuleInputBox'), $('#CouponRuleInputBox'), 1);

        //显示优惠券有效期类型
        $bw.showTpl($('#tpl_CouponIndateBox'), $('#CouponIndateBox'), 0);

        //得到开通城市
        getServiceCity();

        //编辑得到优惠券数据
        var couId = $bw.getUrlParam('id');
        getCouponData(couId);

    });

    //金额规则
    form.on('select(CouponRule)', function (data) {
        $bw.showTpl($('#tpl_CouponRuleInputBox'), $('#CouponRuleInputBox'), parseInt(data.value));
    });

    //优惠券有效期类型
    form.on('select(CouponIndate)', function (data) {
        var value = parseInt(data.value);
        value = isNaN(value) ? 0 : value;
        $bw.showTpl($('#tpl_CouponIndateBox'), $('#CouponIndateBox'), value);
        if (value === 3) {
            laydate.render({
                elem: '.layui-date-input',
                type: 'datetime',
                trigger: "click",
                range: true
            });
        } else {
            laydate.render({
                elem: '.layui-date-input',
                type: 'datetime',
                trigger: "click",
                done: function (value, date, endDate) {
                    if (date.hours == 0 && date.minutes == 0 && date.seconds == 0) {
                        lay.extend(this.dateTime, {
                            hours: 23,
                            minutes: 59,
                            seconds: 59
                        });
                    }
                }
            });
        }
    });

    //监听 form 提交事件
    form.on('submit(addCouponBtn)', function (data) {
        var ajaxData = data.field;
        //得到优惠券品类规则
        var Categorys = [];
        ajaxData.ServiceType = parseInt(ajaxData.ServiceType);
        ajaxData.ServiceType = isNaN(ajaxData.ServiceType) ? 0 : ajaxData.ServiceType;
        $("input[name='TripType']:checked").each(function () {
            var tripType = parseInt($(this).val());
            tripType = isNaN(tripType) ? 0 : tripType;
            if (tripType == 0) return false;
            Categorys.push({ ServiceType: ajaxData.ServiceType, TripType: tripType });
        });
        //只选择了服务类型，没有选择行程类型或者行程类型选择的不限
        if (Categorys.length === 0) {
            Categorys.push({ ServiceType: ajaxData.ServiceType, TripType: 0 });
        }
        ajaxData.Categorys = Categorys;
        //得到优惠券城市限制
        var Citys = [];
        $('select[multiple] option:selected').each(function () {
            var cityId = parseInt($(this).val());
            cityId = isNaN(cityId) ? 0 : cityId;
            Citys.push({
                CityId: cityId,
                CityName: $(this).text()
            });
        });
        ajaxData.Citys = Citys;
        //优惠券有效日期
        if (ajaxData.IndateType == 3) {
            var date = ajaxData.IndateDateTime.split(' - ');
            if (date.length && date.length > 1) {
                ajaxData.IndateStartDateTime = date[0];
                ajaxData.IndateDateTime = date[1];
                ajaxData.IndateDateTime = $bw.formatEndDate(ajaxData.IndateDateTime);
            }
        } else if (ajaxData.IndateType == 1) {
            ajaxData.IndateDateTime = $bw.formatEndDate(ajaxData.IndateDateTime);
        }
        //数据格式处理
        ajaxData.CreditAmount = parseFloat(ajaxData.CreditAmount);
        ajaxData.SatisfyAmount = parseFloat(ajaxData.SatisfyAmount);
        ajaxData.Discount = parseFloat(ajaxData.Discount);
        ajaxData.DiscountUpperLimit = parseFloat(ajaxData.DiscountUpperLimit);
        var url = '/api/CouponTemplate/AddCoupon';
        // if (ajaxData.CouponId) {
        //     url = '/api/CouponTemplate/EditCoupon';
        // }
        //设置优惠券
        $bw.ajax({
            url: url,
            data: ajaxData,
            callback: function (res) {
                $bw.reloadForm();
            }
        });
        return false;
    });

    //得到服务城市
    function getServiceCity() {
        $bw.ajax({
            type: 'get',
            url: '/api/setting/GetOpenCity',
            callback: function (res) {
                const cityHtml = res.Data.map(element => {
                    return '<option value="' + element.CityId + '">' + element.CityName + '</option>';
                });
                $("#multipleCity").append(cityHtml.join(''));
                multiSelect.render('select');
            }
        });
    }

    form.verify({
        Discount: function (value, item) {
            if (value <= 0 || value >= 10)
                return '折扣只能0~10之间，但不包含';
        },
        DiscountUpperLimit: function (value, item) {
            if (value != '' && !(/^\d+$/.test(value)))
                return '只能填写数字';
        }
    });

    //得到优惠券数据
    function getCouponData(couId) {
        if (!couId) return false;
        $bw.ajax({
            type: 'get',
            url: '/api/CouponTemplate/CouponById',
            data: { id: couId },
            callback: function (res) {
                if (!res.Data) return false;
                $('#CouponIdHid').val(res.Data.CouponId);
                //显示金额默认规则
                $bw.showTpl($('#tpl_CouponRuleInputBox'), $('#CouponRuleInputBox'), res.Data.RuleType);
                //显示优惠券有效期类型
                $bw.showTpl($('#tpl_CouponIndateBox'), $('#CouponIndateBox'), res.Data.IndateType);
                laydate.render({
                    elem: '.layui-date-input',
                    type: 'datetime',
                    trigger: "click",
                    done: function (value, date, endDate) {
                        if (date.hours == 0 && date.minutes == 0 && date.seconds == 0) {
                            lay.extend(this.dateTime, {
                                hours: 23,
                                minutes: 59,
                                seconds: 59
                            });
                        }
                    }
                });

                var indate = $bw.formatUnixDate(res.Data.IndateDateTime, 'second');
                if (res.Data.IndateType == 3) {
                    indate = ($bw.formatUnixDate(res.Data.IndateStartDateTime, 'second') + ' - ' + $bw.formatUnixDate(res.Data.IndateDateTime, 'second'));
                }
                var CategoryList = res.Data.CategoryList;
                form.val("couponDetailForm", {
                    "CouponTempName": res.Data.CouponTempName,
                    "ServiceType": (CategoryList.length > 0 ? CategoryList[0].ServiceType : 0),
                    "RuleType": res.Data.RuleType,
                    "CalculateAmountType": res.Data.CalculateAmountType,
                    "IndateType": res.Data.IndateType,
                    "SatisfyAmount": res.Data.SatisfyAmount,
                    "CreditAmount": res.Data.CreditAmount,
                    "Discount": res.Data.Discount,
                    "DiscountUpperLimit": res.Data.DiscountUpperLimit,
                    "IndateDateTime": indate,
                    "IndataDay": res.Data.IndataDay,
                });
                $("input[name='TripType']").each(function () {
                    var tripType = parseInt($(this).val());
                    tripType = isNaN(tripType) ? 0 : tripType;
                    if (CategoryList.some(element => element.TripType == tripType)) {
                        $(this).prop('checked', 'checked');
                    }
                });
                $('#multipleCity').find('option').each(function () {
                    var val = parseInt($(this).val());
                    val = isNaN(val) ? 0 : val;
                    if (res.Data.Citys.some(element => element.CityId == val) && val > 0) {
                        $(this).prop('selected', 'selected');
                    }
                });
                form.render();
                multiSelect.render('select');
            }
        });
    }

    //品类规则的行程类型
    form.on('checkbox(TripType)', function (data) {
        if (data.value == 0) { //全选
            $('#tripTypeBox').find('input').prop('checked', false);
            $(data.elem).prop('checked', true);
        } else {
            $('#tripTypeBox').find('input:first').prop('checked', false);
        }
        form.render('checkbox');
    });

    //城市限制
    $('#multipleCityBox').on('click', function () {
        $(this).find('dd').removeClass('layui-this');
    });


});