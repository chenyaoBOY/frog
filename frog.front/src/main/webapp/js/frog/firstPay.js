

var b0=true,b1=true,b2=true;
$(function () {
    $('.in_tip').hide();
    // $('#originalValueDiv').hide();
})
//计算商品房费用
var qishui,geshui,zzs,allFee,totalPrice,proxy_price,total_fee,max_loan,first_pay,every_month_pay,dif,firstMoth;
function calculateBusiness() {

    if(!b0){
        alert("请完善数据！")
    }
    totalPrice = $('#totalMoney').val();//房屋售价
    var webPrice = $('#webPricePredict').val();//网签价
    var proxyFeePercent = div($('#proxy_fee').val(),100);//代理费百分比
    var originalValue = $('#originalValue').val();//原值
    if(originalValue == ''){
        originalValue =0;
    }

    var onlyFlag = $('#whether_five_only').val();//是否满五唯一  0：否 1 是
    var originalFlag = $('#original_value').val();//是否有原值  0：否 1 有
    var twoFlag = $('#whether_two').val();//是否满两年  0：否 1 有
    var customerFlag = $('#customer').val();//是否首套  0：否 1 有
    var areaFlag = $('#houseArea').val();//是否大于90平  0：否 1 是



    //判断是否满五唯一
    if(onlyFlag==1){
        manwuweiyi(webPrice,originalValue);
    }else{
        bumanwuweiyi(webPrice,originalValue);
    }
    allFee = add(add(add(qishui,geshui),zzs),totalPrice);
    total_fee = sub(allFee,totalPrice);
    if(proxyFeePercent != ''){
        proxy_price = mul(totalPrice,proxyFeePercent);
        allFee = add(allFee,proxy_price);
    }
    max_loan =Number(number_format(mul(mul(totalPrice,0.9),0.65),'0','','','floor'));
    first_pay = sub(allFee,max_loan);
    var data = (max_loan * 0.004083 * Math.pow( (1+0.004083),300) ) / ( Math.pow( (1+0.004083),300 ) -1)*10000;
    every_month_pay =data;

    //首月还本付息金额=（本金/还款月数）+本金×月利率
    firstMoth = add(div(totalPrice,300),mul(totalPrice,0.004083));
    //每月还本付息金额=（本金/还款月数）+（本金-累计已还本金）×月利率
    var secondMoth = add(div(totalPrice,300),mul(sub(totalPrice,div(totalPrice,300)),0.004083));
    dif = (firstMoth-secondMoth)*10000;

    showFees();

}
function bumanwuweiyi(webPrice,originalValue) {
    //个税计算
    if($('#original_value').val() == 0){//找不到原值
        geshui = mul(webPrice,0.01)
    }else{
        //个税=（网签价-原值）*0.2
        geshui = mul(sub(webPrice,originalValue),0.2);
    }
    //增值税计算
    if($('#whether_two').val() == 1){//满两年
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
        if($('#houseArea').val() == 1){//大于90平
            qishui = mul(sub(webPrice,zzs),0.015);
        }else{
            qishui = mul(sub(webPrice,zzs),0.01);
        }
        qishui = mul(sub(webPrice,zzs),0.03);
    }

}
function manwuweiyi(webPrice,originalValue) {
    geshui = 0;
    zzs = 0;
    //判断是否非普
    if($("#houseArea").val() == 2){//是非普
        //增值税 = （网签价 - 原值）/1.05*5.6%
        zzs = mul(div(sub(webPrice,originalValue),1.05),0.056);
    }
    //判断客户是否首套购房
    if($("#customer").val()==1){//首套
        if($('#houseArea').val() == 1){//大于90平
            //契税 = （网签价 - 增值税）*1.5%
            qishui = mul(sub(webPrice,zzs),0.015);
        }else{
            //契税 = （网签价 - 增值税）*1%
            qishui = mul(sub(webPrice,zzs),0.01);
        }
    }else{//非首套
        //契税 = （网签价 - 增值税）*3%
        qishui = mul(sub(webPrice,zzs),0.03);
    }
}


function showFees() {
    $('#geshui').text(number_format(geshui,2,'.',',','round')+"   万元");
    $('#qishui').text(number_format(qishui,2,'.',',','round')+"   万元");
    $('#zzs').text(number_format(zzs,2,'.',',','round')+"   万元");
    $('#total_money').text(Number(totalPrice).toFixed(2)+"   万元");
    $('#total_price').text(number_format(allFee,2,'.',',','round')+"   万元");
    $('#proxy_price').text(number_format(proxy_price,2,'.',',','round')+"   万元");
    $('#total_fee').text(number_format(total_fee,2,'.',',','round')+"   万元");
    $('#max_loan').text(number_format(max_loan,2,'.',',','round')+"   万元");
    $('#first_pay').text(number_format(first_pay,2,'.',',','round')+"   万元");
    $('#every_month_pay').text(number_format(every_month_pay,2,'.',',','round')+"   元/月");
    $('#every_month_pay2').text(number_format(mul(firstMoth,10000),2,'.',',','round')+"   元/月"+'每月递减'+Number(dif).toFixed(2));
    $('#count_pay').text("300 期");
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
        //不满五唯一 a1-0  满五唯一 a2-1
        form.on('checkbox(a1)', function(data){//不满五
            setCheckBox(data,'a2',0,1,'whether_five_only',form);
            if(data.elem.checked){
                $('.five').show();
            }else{
                $('.five').hide();
            }
            if($("#original_value").val() == 1){
                $('#originalValueDiv').show();
            }else{
                $('#originalValueDiv').hide();
            }

        });
        form.on('checkbox(a2)', function(data){//满五
            setCheckBox(data,'a1',1,0,'whether_five_only',form);
            if($("#houseArea").val() == 2){
                $('.original').show();
                $('.two').hide();
            }else{
                if(data.elem.checked){
                    $('.five').hide();
                    $('#originalValueDiv').hide();
                }else{
                    $('.five').show();
                    $('#originalValueDiv').show();
                }
            }

        });
        //有原值 b1 1 b2 0
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
        //
        form.on('checkbox(c1)', function(data){//满两年
            setCheckBox(data,'c2',0,1,'whether_two',form);
        });
        form.on('checkbox(c2)', function(data){//不满两年
            setCheckBox(data,'c1',1,0,'whether_two',form);
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
            if($("#whether_five_only").val() == 1){
                if(data.value == 2){
                    $(".original").show();
                }else{
                    $(".original").hide();
                }
            }
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