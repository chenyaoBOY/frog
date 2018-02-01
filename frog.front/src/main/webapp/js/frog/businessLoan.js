

var b0=true,b1=true,b2=true;
$(function () {
    $('.in_tip').hide();
})
//计算商业贷款费用
function calculateBusiness() {
    
    //数据校验
    if(! (b0 && b1 && b2)){
        return;
    }
    //计划月还款额=〔贷款本金×月利率×（1+月利率）^还款月数〕÷〔（1+月利率）^还款月数－1〕
    var month = mul($('#loanYear').val(),12);
    var rateMonth = div(div($('#rate').val(),100),12);//月利率
    var totalMoney = $('#totalMoney').val();

    var cimi = Math.pow(add(1,rateMonth),month);
    var chushu = mul( mul(totalMoney,rateMonth),cimi);
    //每月还款额
    var result = mul(div(chushu,sub(cimi,1)),10000);
    //总利息
    var interest = sub(mul(result,month),mul(10000,totalMoney));


    $('#month_supply').text(number_format(result,2,'.',',','round'));
    $('#total_money').text(number_format(totalMoney,2,'.',',','round'));
    $('#total_interest').text(number_format(interest,2,'.',',','round'));
    $('#total_month').text(month);
    $('#total_loan').text(number_format(add(div(interest,10000),totalMoney),2,'.',',','round'));



    var data = (totalMoney * rateMonth * Math.pow( (1+rateMonth),month) ) / ( Math.pow( (1+rateMonth),month ) -1)*10000;


}

function checkNumber(p) {
    var b =true;
    var reg = /^\d+(\.\d+)?$/;
    if(p == 0){
        var val = $('#totalMoney').val();
        if(val == ''){
            b0=false;
            tip('totalMoney_tip','此项必填哦！');return;
        }
        if(!reg.test(val)){
            b0=false;
            tip('totalMoney_tip','仅支持数字哦！');
            return;
        }
        b0=true;
        $('#totalMoney_tip').hide();

    }
    if(p == 1){
        var val = $('#rate').val();
        if(val == ''){
            b1=false;
            tip('selectRate_tip','此项必填哦！');return;
        }
        if(!reg.test(val)){
           tip('selectRate_tip','仅支持数字哦！');
            b1=false;
            return;
        }
        if(val>100){
            b2=false;
            tip('selectRate_tip','不能大于100哦！');
            return;
        }
        b1=true;
        $('#selectRate_tip').hide();

    }
    if(p == 2){
        var val = $('#loanYear').val();
        if(val == ''){
            b2=false;
            tip('loanYear_tip','此项必填哦！');return;
        }
        if(!reg.test(val)){
            b2=false;
            tip('loanYear_tip','仅支持数字哦！');
            return;
        }
        if(val>100){
            b2=false;
            tip('loanYear_tip','贷款年限不能大于100哦！');
            return;
        }
        b2=true;
        $('#loanYear_tip').hide();
    }

}
//重置表单
function resetForm() {
    $('#totalMoney').val('');
    $('#rate').val('');
    $('#loanYear').val('');
}
function tip(p,txt) {
    $('#'+p).text(txt);
    $('#'+p).show();
}



    //***********************************************************************************
    //JavaScript代码区域
    layui.use('element', function() {
        var element = layui.element;

    });
    layui.use(['form', 'layedit', 'laydate'], function() {
        var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate;

        //利率选择
        //lay-filter="selectRate"
        form.on('select(selectRate)', function(data){
            $('#rate').val(data.value);
        });
        form.on('input(loanYear)', function(data){
            alert(data.value)
        });

        //自定义验证规则
        form.verify({
            totalMoney: function(value) {
                if(value.length < 5) {
                    return '标题至少得5个字符啊';
                }
            },
            pass: [/(.+){6,12}$/, '密码必须6到12位'],
            content: function(value) {
                layedit.sync(editIndex);
            }
        });




        //日期
        laydate.render({
            elem: '#date'
        });
        laydate.render({
            elem: '#date1'
        });

        //创建一个编辑器
        var editIndex = layedit.build('LAY_demo_editor');
        //监听指定开关
        form.on('switch(switchTest)', function(data) {
            layer.msg('开关checked：' + (this.checked ? 'true' : 'false'), {
                offset: '6px'
            });
            layer.tips('温馨提示：仅注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
        });

        //监听提交
        form.on('submit(demo1)', function(data) {
            layer.alert(JSON.stringify(data.field), {
                title: '最终的提交信息'
            })
            return false;
        });

    });