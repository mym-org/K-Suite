package org.mym.ksuite.controller;


import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * @author zhangchao
 */
@Controller
public class ForwardPageController {

    @RequestMapping("/")
    public String index(){
        return "index";
    }

    @RequestMapping("/login")
    public String loginError(Map<String, Object> map, HttpServletRequest request){
        AuthenticationException exception = (AuthenticationException)request.getSession().getAttribute("SPRING_SECURITY_LAST_EXCEPTION");

        if (exception != null) {
            map.put("msg", exception.getMessage());
            request.getSession().removeAttribute("SPRING_SECURITY_LAST_EXCEPTION");
        }
        return "login";
    }
}
