layui.use(['form', 'table', 'laydate', 'common'], function () {
    var form = layui.form,
        $ = layui.jquery,
        laydate = layui.laydate,
        $bw = layui.common,
        table = layui.table;


    loadJS('/plugs/FileSaver.min.js');

    laydate.render({
        elem: '.layui-date-input',
        type: 'date',
        trigger: "click",
        range: true
    });

    $bw.showTableList({
        id: "redeemCodeTable",
        elem: '#redeemCodeTable',
        cols: [
            { type: 'numbers' },
            { field: 'RedeemCodeId', title: '兑换码id', hide: true },
            { field: 'RedeemCode', title: '兑换码', align: "center" },
            { field: 'ActivityTitle', title: '活动名称', align: "center" },
            {
                field: 'State', title: '状态', align: 'center', templet: function (d) {
                    if (d.State == 1) return '未使用';
                    if (d.State == 2) return '已兑换';
                    return '';
                }
            },
            {
                field: 'Cdt', title: '创建时间', align: 'center', templet: function (d) {
                    return $bw.formatUnixDate(d.Cdt, 'year');
                }
            }
        ],
        data: {
            url: '/api/CouponRedeemCode/GetRedeemCodeList',
        }
    });

    //得到活动下拉列表搜索
    getActivitySelectList();

    //监听搜索
    form.on('submit(SerchBtn)', function (data) {
        var ajaxData = data.field;
        var date = ajaxData.CdtDate.split(' - ');
        if (date && date.length && date.length > 1) {
            ajaxData.StartDateTime = date[0];
            ajaxData.EndDateTime = date[1];
        }
        $bw.ajax({
            url: '/api/CouponRedeemCode/GetRedeemCodeList',
            data: ajaxData,
            callback: function (res) {
                table.reload("redeemCodeTable", {
                    page: { curr: 1 },
                    data: res.Data.Items
                });
            }
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
                form.render('select', 'ListSerarchForm');
            }
        });
    }

    //生成兑换码弹框
    $('.createRedeemCode').on('click', function () {
        layer.open({
            title: "生成兑换码",
            type: 1,
            area: ['40%', '60%'],
            content: $('#createRedeemCodeBox'),
            success: function (layero, index) {
                $bw.ajax({
                    type: 'get',
                    url: '/api/CouponActivity/GetActivitys',
                    data: { activityType: 2 },
                    callback: function (res) {
                        const html = res.Data.map(element => {
                            return '<option value="' + element.ActivityId + '">' + element.ActivityTitle + '</option>';
                        });
                        $("#PopupActivityBox").append(html.join(''));
                        form.render('select', 'CreateCodeForm');
                    }
                });
            }
        });
    });


    //生成兑换码
    form.on('submit(CreateCodeBtn)', function (data) {
        var ajaxData = data.field;
        $bw.ajax({
            url: '/api/CouponRedeemCode/AddRedeemCode',
            data: ajaxData,
            callback: function (res) {
                $bw.reloadForm();
            }
        });
        return false;
    });


    //导出兑换码
    $('.exportRedeemCode').on('click', function () {
        var ajaxData = $bw.getFormInfo('.listSerarchForm');
        var date = ajaxData.CdtDate.split(' - ');
        if (date && date.length && date.length > 1) {
            ajaxData.StartDateTime = date[0];
            ajaxData.EndDateTime = date[1];
        }
        $bw.exportFile({
            url: '/api/CouponRedeemCode/ExportRedeemCode',
            data: ajaxData
        });
        return false;
    });

});