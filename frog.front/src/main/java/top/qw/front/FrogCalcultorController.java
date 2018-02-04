package top.qw.front;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class FrogCalcultorController {


    @RequestMapping("index.do")
    public String index(ModelMap map){


        return "/firstPay";
    }
    @RequestMapping("businessLoan.do")
    public String businessLoan(ModelMap map){


        return "/businessLoan";
    }
    @RequestMapping("foundLoan.do")
    public String foundLoan(ModelMap map){


        return "/foundLoan";
    }

}
