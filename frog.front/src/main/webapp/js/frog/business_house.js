


var b0=false,b1=true,b2=true;
$(function () {
    $('.in_tip').hide();
    // $('#originalValueDiv').hide();
})
//计算商品房费用
var qishui,geshui,zzs,allFee,totalPrice,proxy_price,total_fee,max_loan,first_pay,every_month_pay,dif,firstMoth;
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
    var originalValue = $('#originalValue').val();//原值
    if(originalValue == ''){
        originalValue =0;
    }

    var onlyFlag = $('#house_status_value').val();//0:满二  1：满五唯一  2：不满二
    // var originalFlag = $('#original_value').val();//是否有原值  0：否 1 有
    // var twoFlag = $('#whether_two').val();//是否满两年  0：否 1 有
    // var customerFlag = $('#customer').val();//是否首套  0：否 1 有
    // var areaFlag = $('#houseArea').val();//是否大于90平  0：否 1 是



    //判断是否满五唯一
    if(onlyFlag == 1){
        manwuweiyi(webPrice,originalValue);
    }else{
        notmanwu(webPrice,originalValue);
    }

    total_fee = add(add(qishui,geshui),zzs);//费用小计
    allFee =add(totalPrice,total_fee);//总房款

    if($('#djk_val').val() == 0){//一类经适房
        djk_val = mul(sub(webPrice,originalValue),0.7)
        allFee=add(allFee,djk_val);
        total_fee =add(total_fee,djk_val);
    }
    if($('#crj_val').val() == 0){//二类经适房
        crj_val = mul(webPrice,0.3);
        allFee=add(allFee,crj_val);
        total_fee=add(total_fee,crj_val);
    }

    if(proxyFeePercent != ''){
        proxy_price = mul(totalPrice,proxyFeePercent);
        allFee = add(allFee,proxy_price);
    }



    //贷款额度比较 贷款额是根据网签和评估值的最低中的相关贷款比例来算的

    //贷款计算
    if($("#customer").val() == 1){
        var minLoan = mul(mul(totalPrice,0.9),0.65);
        var minLoan2 = mul(webPrice,0.65);
        if(minLoan<minLoan2){
            max_loan =Number(num_format(minLoan.toFixed(2)));
        }else{
            max_loan =Number(num_format(minLoan2.toFixed(2)));
        }
    }else{
        var minLoan = mul(mul(totalPrice,0.9),0.4);
        var minLoan2 = mul(webPrice,0.4);
        if(minLoan<minLoan2){
            max_loan =Number(num_format(minLoan.toFixed(2)));
        }else{
            max_loan =Number(num_format(minLoan2.toFixed(2)));
        }
    }

    first_pay = sub(allFee,max_loan);
    var data = (max_loan * 0.004083 * Math.pow( (1+0.004083),300) ) / ( Math.pow( (1+0.004083),300 ) -1)*10000;
    every_month_pay =data;

    //首月还本付息金额=（本金/还款月数）+本金×月利率
    firstMoth = add(div(max_loan,300),mul(max_loan,0.004083));
    //每月还本付息金额=（本金/还款月数）+（本金-累计已还本金）×月利率
    var secondMoth = add(div(max_loan,300),mul(sub(max_loan,div(max_loan,300)),0.004083));
    dif = (firstMoth-secondMoth)*10000;


    //费用展示
    showFees();

}

function notmanwu(webPrice,originalValue) {

    //增值税计算
    if($('#house_status_value').val() == 0){//满两年
        zzs=0;
        if($("#houseArea").val() == 2){//是非普
            //增值税 = （网签价 - 原值）/1.05*5.6%
            zzs = mul(div(sub(webPrice,originalValue),1.05),0.056);
        }
    }else{//不满两年
        //增值税=网签价/1.05*5.6%
        zzs = mul(div(webPrice,1.05),0.056);
    }

    //契税计算
    if($('#customer').val() == 1){//首套
        if($('#houseArea').val() == 0){//小于90平
            qishui = mul(sub(webPrice,zzs),0.01);
        }else{
            qishui = mul(sub(webPrice,zzs),0.015);
        }
    }else{
        qishui = mul(sub(webPrice,zzs),0.03);
    }
    //个税计算 个税 =（网签-原值-网签10%-增值税）*20%  找不到原值  按全额的1%计算
    if($('#original_value').val() == 0 ){
        geshui = mul(webPrice,0.01);
    }else{
        geshui = mul(sub(sub(mul(webPrice,0.9),originalValue),zzs),0.2);
    }
}
function manwuweiyi(webPrice,originalValue) {
    geshui = 0;
    zzs = 0;
    //判断是否非普
    if($("#houseArea").val() == 2){//是非普
        //增值税 = （网签价 - 原值）/1.05*5.6%
        zzs = mul(div(sub(webPrice,originalValue),1.05),0.056);//若没有填原值 或者选中没有原值 原值默认为0
    }
    //判断客户是否首套购房
    if($("#customer").val()==1){//首套
        if($('#houseArea').val() == 0){//小于90
            //契税 = （网签价 - 增值税）*1%
            qishui = mul(sub(webPrice,zzs),0.01);
        }else{//大于90
            //契税 = （网签价 - 增值税）*1.5%
            qishui = mul(sub(webPrice,zzs),0.015);
        }
    }else{//非首套
        //契税 = （网签价 - 增值税）*3%
        qishui = mul(sub(webPrice,zzs),0.03);
    }
}


function showFees() {
    $('#geshui').text(Number(geshui).toFixed(2)+"   万元");
    $('#qishui').text(Number(qishui).toFixed(2)+"   万元");
    $('#zzs').text(Number(zzs).toFixed(2)+"   万元");
    $('#total_money').text(Number(totalPrice).toFixed(2)+"   万元");//售价
    $('#total_price').text(num_format(allFee.toFixed(2))+"   万元");//总计
    $('#proxy_price').text(num_format(proxy_price.toFixed(2))+"   万元");
    $('#total_fee').text(Number(total_fee).toFixed(2)+"   万元");//费用小计
    $('#max_loan').text(num_format(max_loan.toFixed(2))+"   万元");
    $('#first_pay').text(num_format(first_pay.toFixed(2))+"   万元");
    $('#every_month_pay').text(num_format(every_month_pay.toFixed(2))+"   元/月");
    $('#every_month_pay2').text(num_format((mul(firstMoth,10000)).toFixed(2))+"   元/月"+'每月递减'+Number(dif).toFixed(2));
    $('#count_pay').text("300 期");

    if($('#djk_val').val() == 0){
        $('#zhdjk').text(Number(djk_val).toFixed(2)+"   万元");

    }
    if($('#crj_val').val() == 0){
        $('#tdcrj').text(Number(crj_val).toFixed(2)+"   万元");

    }


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
            if(data.value == 0){//已满两年
                originalShowOrHide();
            }else if(data.value == 1){//满五唯一
                originalShowOrHide();
                if($("#houseArea").val() == 2){
                    originalShowOrHide();
                }else{
                    $('.original').hide();
                }
            }else{//不满两年
                originalShowOrHide();
            }
        });
        form.on('checkbox(b1)', function(data){//有原值
            setCheckBox(data,'b2',1,0,'original_value',form);
            if(data.elem.checked){
                $('#originalValueDiv').show();
            }else{
                $('#originalValueDiv').hide();
            }

        });
        form.on('checkbox(b2)', function(data){//没原值
            setCheckBox(data,'b1',0,1,'original_value',form);
            if(data.elem.checked){
                $('#originalValueDiv').hide();
            }else{
                $('#originalValueDiv').show();
            }
        });
        //不满五唯一 a1-0  满五唯一 a2-1
        form.on('checkbox(d1)', function(data){//首套
            setCheckBox(data,'d2',1,0,'customer',form);
        });
        form.on('checkbox(d2)', function(data){//非手套
            setCheckBox(data,'d1',0,1,'customer',form);
        });
        form.on('select(selectArea)', function(data){//房屋面积
            $('#houseArea').val(data.value);
            if($("#house_status_value").val() == 1){
                if(data.value == 2){
                    $(".original").show();
                    if($("#original_value").val() == 0){//原值
                        $('#originalValueDiv').hide();
                    }
                }else{
                    $(".original").hide();
                }
            }
        });


    });


function originalShowOrHide() {
    $('.original').show();
    if($("#original_value").val() == 0){//原值
        $('#originalValueDiv').hide();
    }
}

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
