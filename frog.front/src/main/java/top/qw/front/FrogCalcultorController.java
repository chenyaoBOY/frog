package top.qw.front;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class FrogCalcultorController {


    @RequestMapping("index.do")
    public String index(ModelMap map){

        map.put("user","chenyao");

        return "/firstPay";
    }
    @RequestMapping("test.do")
    public String test(ModelMap map){


        map.put("user","chenyao");

        return "/businessLoan";
    }

}
