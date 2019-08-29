layui.use(['form', 'table', 'laydate', 'common'], function () {
    var form = layui.form,
        $ = layui.jquery,
        laydate = layui.laydate,
        $bw = layui.common,
        table = layui.table;

    laydate.render({
        elem: '.layui-date-input',
        type: 'datetime',
        trigger: "click",
        range: true
    });

    var aid = $bw.getUrlParam('id');
    aid = aid || 0;
    $bw.showTableList({
        id: "couponRecordTable",
        elem: '#couponRecordTable',
        cols: [
            { field: 'XH', title: '序号', type: 'numbers' },
            { field: 'ActivityId', title: '活动ID', align: "center" },
            { field: 'ActivityTitle', title: '活动名称', align: "center" },
            { field: 'CouponName', title: '优惠券名称', align: 'center' },
            { field: 'CouponId', title: '优惠券ID', align: 'center' },
            { field: 'Receiver', title: '领取人', align: 'center' },
            {
                field: 'ReceiverDate', title: '领取时间', align: 'center', templet: function (d) {
                    return $bw.formatUnixDate(d.ReceiverDate, 'year');
                }
            },
            {
                field: 'State', title: '状态', align: 'center', templet: function (d) {
                    if (d.State == 1) return '未使用';
                    if (d.State == 2) return '已使用';
                    if (d.State == 3) return '已过期';
                    return '';
                }
            },
        ],
        data: {
            url: '/api/CouponSendRecord/CouponSendRecordList',
            ActivityId: aid
        }
    });

    //得到优惠券下拉列表搜索
    getCouponSelectList();

    //得到活动下拉列表搜索
    getActivitySelectList();

    //监听搜索
    form.on('submit(couponSerchBtn)', function (data) {
        var ajaxData = data.field;
        var date = ajaxData.ReceiverDate.split(' - ');
        if (date && date.length && date.length > 1) {
            ajaxData.ReceiverStartDate = date[0];
            ajaxData.ReceiverEndDate = date[1];
            ajaxData.ReceiverEndDate = $bw.formatEndDate(ajaxData.ReceiverEndDate);
        }
        if (aid > 0) ajaxData.ActivityId = aid;
        table.reload("couponRecordTable", {
            page: { curr: 1 },
            where: ajaxData
        });
        return false;
    });

    //得到优惠券活动下拉搜索列表
    function getActivitySelectList() {
        $bw.ajax({
            type: 'get',
            url: '/api/CouponActivity/GetActivitys',
            callback: function (res) {
                const html = res.Data.map(element => {
                    return '<option value="' + element.ActivityId + '">' + element.ActivityTitle + '</option>';
                });
                $("#ActivityBox").append(html.join(''));
                form.render('select');
            }
        });
    }

    //得到优惠券下拉搜索列表
    function getCouponSelectList() {
        $bw.ajax({
            type: 'get',
            url: '/api/CouponTemplate/GetCoupons',
            callback: function (res) {
                const html = res.Data.map(element => {
                    return '<option value="' + element.CouponId + '">' + element.CouponTempName + '</option>';
                });
                $("#CouponBox").append(html.join(''));
                form.render('select');
            }
        });
    }


});