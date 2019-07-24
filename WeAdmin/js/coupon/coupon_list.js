layui.use(['form', 'layer', 'table', 'jquery', 'common'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery,
        $bw = layui.common,
        table = layui.table;

    //显示 table 列表
    $bw.showTableList({
        id: "couponListTable",
        elem: '#couponListTable',
        cols: [
            { type: 'numbers' },
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
                    if (d.CategoryList.length) {
                        var serviceType = d.CategoryList[0].ServiceType;
                        if (serviceType == 1) return '拼车';
                        if (serviceType == 2) return '专车';
                    }
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
                    return '不限期';
                }
            },
            { title: '操作', width: 170, templet: '#couponListBar', fixed: "right", align: "center" }
        ],
        data: {
            url: '/api/CouponTemplate/CouponList',
        }
    });

    //平辅 标签 搜索
    $('.bw-search-list').on('click', function (e) {
        e.stopPropagation();
        $(this).parent().attr('data-value', this.dataset.value).find('.bw-search-list').removeClass('active');
        $(this).addClass('active');
        $('.couponSerchBtn').click();
    });

    //监听搜索
    form.on('submit(couponSerchBtn)', function (data) {
        var ajaxData = data.field;
        ajaxData.CategoryType = $(".CategoryType").attr('data-value');
        ajaxData.RuleType = $(".RuleType").attr('data-value');
        ajaxData.CategoryType = parseInt(ajaxData.CategoryType);
        ajaxData.RuleType = parseInt(ajaxData.RuleType);
        $bw.ajax({
            url: '/api/CouponTemplate/CouponList',
            data: ajaxData,
            callback: function (res) {
                table.reload("couponListTable", {
                    page: { curr: 1 },
                    data: res.Data.Items
                });
            }
        });
        return false;
    });

    //添加优惠券
    $('.addCouponBtn').on('click', function () {
        $bw.showPopup({
            title: "添加优惠券",
            type: 2,
            url: "/pages/coupon/coupon_detail.html"
        });
    });

    //列表操作
    table.on('tool(couponListTable)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'del') { //删除
            delConpon(data);
            return false;
        }
    });

    //删除优惠券
    function delConpon(data) {
        layer.confirm('确定删除此优惠券？', { icon: 3, title: '提示信息' }, function (index) {
            $bw.ajax({
                url: '/api/CouponTemplate/DelCoupon',
                data: { Id: data.CouponId },
                callback: function (res) {
                    $bw.reloadForm();
                }
            });
            layer.close(index);
        });
    }

    //监听行单击事件
    table.on('row(couponListTable)', function (obj) {
        $bw.showPopup({
            title: "优惠券详情",
            type: 2,
            url: "/pages/coupon/coupon_detail.html?id=" + obj.data.CouponId,
            popupBack: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                body.find('#subminBtnBox').remove();
            }
        });
    });

});

