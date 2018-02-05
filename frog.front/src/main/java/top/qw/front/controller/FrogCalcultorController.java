package top.qw.front.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class FrogCalcultorController {

    @RequestMapping("/tax.do")
    public String tax(ModelMap map,@RequestParam(value = "type",defaultValue = "0") Integer type){
        if(type == 0){//商品房
            return "/business_house";
        }else if(type == 1){//一类经适房
            return "/one_house";
        }else if(type == 2){//二类经适房
            return "/two_house";
        }else if(type == 3){//央产房
            return "/central_house";
        }else if(type == 4){//商住两用房
            return "/business_live_house";
        }else{
            return "/error";
        }

    }
    @RequestMapping("businessLoan.do")
    public String businessLoan(ModelMap map){


        return "/business_loan";
    }
    @RequestMapping("foundLoan.do")
    public String foundLoan(ModelMap map){


        return "/found_loan";
    }

}
