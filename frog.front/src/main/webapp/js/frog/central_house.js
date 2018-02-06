

var b0=false,b1=true,b2=true;
$(function () {
    $('.in_tip').hide();
    // $('#originalValueDiv').hide();
})
//计算商品房费用
var qishui,allFee,totalPrice,proxy_price,total_fee,max_loan,first_pay,every_month_pay,dif,firstMoth;
var djk_val=0;
var crj_val=0;

function calculateBusiness() {
    if(!b0){
        alert("请完善数据！");
        return;
    }

    totalPrice = $('#totalMoney').val();//房屋售价
    var webPrice = $('#webPricePredict').val();//网签价
    var proxyFeePercent = div($('#proxy_fee').val(),100);//代理费百分比

    qishui = mul(webPrice,0.01);
    crj_val = mul(mul($('#selfcost_val').val(),$("#house_area").val()),0.01)

    total_fee= add(qishui,crj_val);
    allFee = add(total_fee,totalPrice);


    if(proxyFeePercent != ''){
        proxy_price = mul(totalPrice,proxyFeePercent);
        allFee = add(allFee,proxy_price);
    }
    if($("#customer").val() == 1){
        max_loan =Number(num_format(((mul(mul(totalPrice,0.9),0.65)).toFixed(2)).toString()));
    }else{
        max_loan =Number(num_format(((mul(mul(totalPrice,0.9),0.4)).toFixed(2)).toString()));
    }

    first_pay = sub(allFee,max_loan);
    var data = (max_loan * 0.004083 * Math.pow( (1+0.004083),300) ) / ( Math.pow( (1+0.004083),300 ) -1)*10000;
    every_month_pay =data;

    //首月还本付息金额=（本金/还款月数）+本金×月利率
    firstMoth = add(div(max_loan,300),mul(max_loan,0.004083));
    //每月还本付息金额=（本金/还款月数）+（本金-累计已还本金）×月利率
    var secondMoth = add(div(max_loan,300),mul(sub(max_loan,div(max_loan,300)),0.004083));
    dif = (firstMoth-secondMoth)*10000;

    showFees();

}


function showFees() {
    $('#qishui').text(Number(qishui).toFixed(2)+"   万元");
    $('#total_money').text(Number(totalPrice).toFixed(2)+"   万元");
    $('#total_price').text(num_format((allFee.toFixed(2)).toString())+"   万元");
    $('#proxy_price').text(num_format((proxy_price.toFixed(2)).toString())+"   万元");
    $('#total_fee').text(Number(total_fee).toFixed(2)+"   万元");
    $('#max_loan').text(num_format(max_loan.toFixed(2))+"   万元");
    $('#first_pay').text(num_format(first_pay.toFixed(2))+"   万元");
    $('#every_month_pay').text(num_format(every_month_pay.toFixed(2))+"   元/月");
    $('#every_month_pay2').text(num_format((mul(firstMoth,10000)).toFixed(2))+"   元/月"+'每月递减'+Number(dif).toFixed(2));
    $('#count_pay').text("300 期");

    $('#tdcrj').text(Number(crj_val).toFixed(2)+"   万元");


}
function checkNumber(ele,p,p2) {
    var reg = /^\d+(\.\d+)?$/;
    var val = $(ele).val();
    if(p2 == 1){
        if(val!='' && !reg.test(val)){
            b0=false;
            tip(p,'仅支持数字哦！');
            return;
        }
        b0=true;
        $('#'+p).hide();
        return ;
    }
    if(val == ''){
        b0=false;
        tip(p,'此项必填哦！');return;
    }
    if(!reg.test(val)){
        b0=false;
        tip(p,'仅支持数字哦！');
        return;
    }
    b0=true;
    $('#'+p).hide();


}
//重置表单
function resetForm() {
    $('#totalMoney').val('');
    $('#originalValue').val('');
    $('#proxy_fee').val('');
}
function tip(p,txt) {
    $('#'+p).text(txt);
    $('#'+p).show();
}

//**********************************一类经适房计算*************************************************

//**********************************二类经适房计算*************************************************

//**********************************公房计算*************************************************

//***********************************************************************************

    layui.use('form', function() {
        var form = layui.form;

        form.on('select(house_status)', function(data){//房屋面积
            $('#house_status_value').val(data.value);
        });

        //不满五唯一 a1-0  满五唯一 a2-1
        form.on('checkbox(d1)', function(data){//首套
            setCheckBox(data,'d2',1,0,'customer',form);
        });
        form.on('checkbox(d2)', function(data){//非手套
            setCheckBox(data,'d1',0,1,'customer',form);
        });

    });



function setCheckBox(data,bId,av,bv,c,form) {
    if(data.elem.checked){//满五唯一
        getUnchecked(c,av,bId,form);  //A值  B id
    }else{
        getChecked(c,bv,bId,form);    //B值  B id
    }

}

function getChecked(a,b,c,form) {
    $('#'+a).val(b);
    $('#'+c).next().attr('class','layui-unselect layui-form-checkbox layui-form-checked');
    $('#'+c).attr('checked',true);
    form.render('checkbox', c);
}
function getUnchecked(a,b,c,form) {
    $('#'+a).val(b);
    $('#'+c).next().attr('class','layui-unselect layui-form-checkbox');
    $('#'+c).removeAttr('checked');
    form.render('checkbox', c);
}

