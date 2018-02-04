

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
    $('.layui-table').show();

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

    //等额本息
    $('#month_supply').text(number_format(result,2,'.',',','round')+"   元");
    $('#total_money').text(number_format(totalMoney,2,'.',',','round')+"   万元");
    $('#total_interest').text(number_format(div(interest,10000),2,'.',',','round')+"   万元");
    $('#total_month').text(month+"   期");
    $('#total_loan').text(number_format(add(div(interest,10000),totalMoney),2,'.',',','round')+"   万元");


    //等额本金
    //首月还本付息金额=（本金/还款月数）+本金×月利率
    var firstMoth = add(div(totalMoney,month),mul(totalMoney,rateMonth));
    //每月还本付息金额=（本金/还款月数）+（本金-累计已还本金）×月利率
    var secondMoth = add(div(totalMoney,month),mul(sub(totalMoney,div(totalMoney,month)),rateMonth));
    var dif = (firstMoth-secondMoth)*10000;
    //还款总利息=（还款月数+1）×贷款额×月利率/2
    var total_interest1 = (month+1)*totalMoney*rateMonth/2;
    $('#month_supply1').text(number_format(firstMoth*10000,2,'.',',','round')+"   元"+"\n每月递减"+dif.toFixed(2));
    $('#total_money1').text(number_format(totalMoney,2,'.',',','round')+"   万元");
    $('#total_interest1').text(number_format(total_interest1,2,'.',',','round')+"   万元");
    $('#total_month1').text(month+"   期");
    $('#total_loan1').text(number_format(add(total_interest1,totalMoney),2,'.',',','round')+"   万元");





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

