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

        var couId = $bw.getUrlParam('id');
        if (couId) {
            $bw.ajax({
                type: 'get',
                url: '/api/CouponTemplate/CouponById',
                data: { id: couId },
                callback: function (res) {
                    if (!res.Data) return false;
                    //显示金额默认规则
                    $bw.showTpl($('#tpl_CouponRuleInputBox'), $('#CouponRuleInputBox'), res.Data.RuleType);
                    //显示优惠券有效期类型
                    $bw.showTpl($('#tpl_CouponIndateBox'), $('#CouponIndateBox'), res.Data.IndateType);
                    laydate.render({
                        elem: '.layui-date-input',
                        type: 'date',
                        trigger: "click"
                    });
                    var CategoryList = res.Data.CategoryList;
                    form.val("couponDetailForm", {
                        "CouponTempName": res.Data.CouponTempName,
                        "ServiceType": (CategoryList.length > 0 ? CategoryList[0].ServiceType : -1),
                        "RuleType": res.Data.RuleType,
                        "CalculateAmountType": res.Data.CalculateAmountType,
                        "IndateType": res.Data.IndateType,
                        "SatisfyAmount": res.Data.SatisfyAmount,
                        "CreditAmount": res.Data.CreditAmount,
                        "Discount": res.Data.Discount,
                        "DiscountUpperLimit": res.Data.DiscountUpperLimit,
                        "IndateDateTime": $bw.formatUnixDate(res.Data.IndateDateTime, 'year'),
                        "IndataDay": res.Data.IndataDay,
                    });
                    $("input[name='TripType']").each(function () {
                        var tripType = parseInt($(this).val());
                        tripType = isNaN(tripType) ? -1 : tripType;
                        if (CategoryList.some(element => element.TripType == tripType)) {
                            $(this).attr('checked', 'checked');
                        }
                    });
                    $('#multipleCity').find('option').each(function () {
                        var val = parseInt($(this).val());
                        val = isNaN(val) ? -1 : val;
                        if (res.Data.Citys.some(element => element.CityId == val)) {
                            $(this).attr('selected', 'selected');
                        }
                    });
                    form.render();
                    multiSelect.render('select');
                }
            });
        }

    });

    //金额规则
    form.on('select(CouponRule)', function (data) {
        $bw.showTpl($('#tpl_CouponRuleInputBox'), $('#CouponRuleInputBox'), parseInt(data.value));
    });

    //优惠券有效期类型
    form.on('select(CouponIndate)', function (data) {
        $bw.showTpl($('#tpl_CouponIndateBox'), $('#CouponIndateBox'), parseInt(data.value));

        laydate.render({
            elem: '.layui-date-input',
            type: 'date',
            trigger: "click"
        });
    });

    //监听 form 提交事件
    form.on('submit(addCouponBtn)', function (data) {
        var ajaxData = data.field;
        //得到优惠券品类规则
        var Categorys = [];
        ajaxData.ServiceType = parseInt(ajaxData.ServiceType);
        ajaxData.ServiceType = isNaN(ajaxData.ServiceType) ? -1 : ajaxData.ServiceType;
        if (ajaxData.ServiceType == -1) {
            Categorys.push({ ServiceType: 0, TripType: 0 });
        } else {
            $("input[name='TripType']:checked").each(function () {
                var tripType = parseInt($(this).val());
                tripType = isNaN(tripType) ? -1 : tripType;
                if (tripType == -1) return false;
                Categorys.push({ ServiceType: ajaxData.ServiceType, TripType: tripType });
            });
            //只选择了服务类型，没有选择行程类型或者行程类型选择的不限
            if (Categorys.length === 0) {
                Categorys.push({ ServiceType: ajaxData.ServiceType, TripType: 0 });
            }
        }
        ajaxData.Categorys = Categorys;
        //得到优惠券城市限制
        var Citys = [];
        $('select[multiple] option:selected').each(function () {
            var cityId = parseInt($(this).val());
            cityId = isNaN(cityId) ? -1 : cityId;
            Citys.push({
                CityId: cityId,
                CityName: $(this).text()
            });
        });
        ajaxData.Citys = Citys;
        //数据格式处理
        ajaxData.CreditAmount = parseFloat(ajaxData.CreditAmount);
        ajaxData.SatisfyAmount = parseFloat(ajaxData.SatisfyAmount);
        ajaxData.Discount = parseFloat(ajaxData.Discount);
        ajaxData.DiscountUpperLimit = parseFloat(ajaxData.DiscountUpperLimit);
        //添加优惠券
        $bw.ajax({
            url: '/api/CouponTemplate/AddCoupon',
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


});