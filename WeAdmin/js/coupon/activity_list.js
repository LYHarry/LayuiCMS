layui.use(['form', 'table', 'common'], function () {
    var form = layui.form,
        $ = layui.jquery,
        $bw = layui.common,
        table = layui.table;

    $bw.showTableList({
        id: "activityListTable",
        elem: '#activityListTable',
        // toolbar: '#actToolBar',
        // defaultToolbar: [],
        cols: [
            { field: 'XH', title: '序号', type: 'numbers' },
            { field: 'ActivityId', title: '活动ID', align: "center" },
            { field: 'ActivityTitle', title: '活动名称', align: "center" },
            {
                field: 'ActivityType', title: '活动类型', align: "center", templet: function (d) {
                    if (d.ActivityType == 1) return '线上活动';
                    if (d.ActivityType == 2) return '线下活动';
                    return '';
                }
            },
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
            { title: '操作', templet: '#actListBar', fixed: "right", align: "center" }
        ],
        data: {
            url: '/api/CouponActivity/CouponActivityPageList',
        }
    });

    //监听搜索
    form.on('submit(activitySerchBtn)', function (data) {
        var ajaxData = data.field;
        table.reload("activityListTable", {
            page: { curr: 1 },
            where: ajaxData
        });
        return false;
    });

    $('.addActivityBtn').on('click', function () {
        $bw.showPopup({
            title: "新增活动",
            type: 2,
            url: "../../pages/coupon/activity_detail.html"
        });
        return false;
    });

    // table.on('toolbar(activityListTable)', function (obj) {
    //     if (obj.event === 'addActivityBtn') { //添加活动
    //         $bw.showPopup({
    //             title: "新增活动",
    //             type: 2,
    //             url: "../../pages/coupon/activity_detail.html"
    //         });
    //     }
    // });

    //列表操作
    table.on('tool(activityListTable)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'lookCollRecord') { //查看领取记录
            $bw.showPopup({
                title: "领取记录",
                type: 2,
                url: "../../pages/coupon/coupon_record.html",
                params: { id: obj.data.ActivityId },
                popupBack: function (layero, index) {
                    var body = layer.getChildFrame('body', index);
                    body.find('div.weadmin-nav').remove();
                    body.find('div.actSearchBox').remove();
                }
            });
            return false;
        }
        if (layEvent === 'redeemCode') { //兑换码管理
            $bw.showPopup({
                title: "活动兑换码",
                type: 2,
                url: "../../pages/coupon/redeem_code.html",
                params: { id: obj.data.ActivityId, detail: true },
                popupBack: function (layero, index) {
                    var body = layer.getChildFrame('body', index);
                    body.find('div.weadmin-nav').remove();
                    body.find('div.actSearchBox').remove();
                    body.find('.exportRedeemCode,.createRedeemCode').remove();
                }
            });
            return false;
        }
        if (layEvent === 'detail') { //详情页
            $bw.showPopup({
                title: "活动详情",
                type: 2,
                url: "../../pages/coupon/activity_detail.html",
                params: { id: obj.data.ActivityId, detail: true },
                popupBack: function (layero, index) {
                    var body = layer.getChildFrame('body', index);
                    body.find('#subminBtnBox').remove();
                    body.find('#transActUrlBtn').remove();
                }
            });
            return false;
        }
        if (layEvent === 'edit') { //编辑
            $bw.showPopup({
                title: "编辑活动",
                type: 2,
                url: "../../pages/coupon/activity_detail.html",
                params: { id: obj.data.ActivityId }
            });
            return false;
        }

        if (layEvent === 'updateState') { //修改活动状态
            var hint = (data.State == 1 ? '下线' : (data.State == 2 ? '上线' : '改变'));
            layer.confirm('确定' + hint + '此活动？', { icon: 3, title: '提示信息' }, function (index) {
                $bw.ajax({
                    url: '/api/CouponActivity/UpdateActivityState',
                    data: { Id: data.ActivityId },
                    callback: function (res) {
                        $bw.reloadForm();
                    }
                });
                layer.close(index);
            });

            return false;
        }

    });


    /*解决表格行工具栏按钮过多展开失效start*/
    // 缓存当前操作的是哪个表格的哪个tr的哪个td
    $(document).off('mousedown', '.layui-table-grid-down').on('mousedown', '.layui-table-grid-down', function (event) {
        table._tableTrCurr = $(this).closest('td');
    });

    $(document).off('click', '.layui-table-tips-main [lay-event]').on('click', '.layui-table-tips-main [lay-event]', function (event) {
        var elem = $(this);
        var tableTrCurr = table._tableTrCurr;
        if (!tableTrCurr) {
            return;
        }
        var layerIndex = elem.closest('.layui-table-tips').attr('times');
        // 关闭当前这个显示更多的tip
        layer.close(layerIndex);
        table._tableTrCurr.find('[lay-event="' + elem.attr('lay-event') + '"]').first().click();
    });
    /*解决表格行工具栏按钮过多展开失效end*/


});