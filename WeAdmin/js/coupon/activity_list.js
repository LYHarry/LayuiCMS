layui.use(['form', 'table', 'common'], function () {
    var form = layui.form,
        $ = layui.jquery,
        $bw = layui.common,
        table = layui.table;

    $bw.showTableList({
        id: "activityListTable",
        elem: '#activityListTable',
        cols: [
            { type: 'numbers' },
            { field: 'ActivityId', title: '活动ID', align: "center" },
            { field: 'ActivityTitle', title: '活动名称', align: "center" },
            {
                field: 'BindCoupons', title: '优惠券', align: "center", templet: function (d) {
                    if (d.BindCoupons.length) {
                        return d.BindCoupons.map(element => {
                            return element.CouponTempName + ' ';
                        })
                    }
                    return '';
                }
            },
            {
                field: 'IndateDate', title: '有效期', align: 'center', templet: function (d) {
                    return ($bw.formatUnixDate(d.IndateStartDate, 'year') + '至' + $bw.formatUnixDate(d.IndateEndDate, 'year'));
                }
            },
            {
                field: 'State', title: '状态', align: 'center', templet: function (d) {
                    if (d.State == 1) return '上线';
                    if (d.State == 2) return '下线';
                    return '';
                }
            },
        ],
        data: {
            url: '/api/CouponActivity/CouponActivityPageList',
        }
    });

    //监听搜索
    form.on('submit(activitySerchBtn)', function (data) {
        var ajaxData = data.field;
        $bw.ajax({
            url: '/api/CouponActivity/CouponActivityPageList',
            data: ajaxData,
            callback: function (res) {
                table.reload("activityListTable", {
                    page: { curr: 1 },
                    data: res.Data.Items
                });
            }
        });
        return false;
    });

    //添加活动
    $('.addActivityBtn').on('click', function () {
        $bw.showPopup({
            title: "新增活动",
            type: 2,
            url: "/pages/coupon/activity_detail.html"
        });
    });

    //监听行单击事件
    table.on('row(activityListTable)', function (obj) {
        $bw.showPopup({
            title: "活动详情",
            type: 2,
            url: "/pages/coupon/activity_detail.html?id=" + obj.data.ActivityId,
            popupBack: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                body.find('#subminBtnBox').remove();
            }
        });
    });

});