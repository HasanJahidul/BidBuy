package controllers;


import dtos.AuthPayloadDto;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import services.FirebaseService;
import services.MailSenderService;
import utils.StringUtils;

import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestController {

    private final FirebaseService firebaseService;
    private final MailSenderService mail;
    private final String keyStr = "nb2ZIMfwdDYi6MNMAGJHFvnNh7jfX+BQWKo8Krl1xB8=";

    @GetMapping("/")
    public String create() throws UnsupportedEncodingException {
        return Jwts.
                builder()
                .setSubject(AuthPayloadDto.serialize(1, "ash", "ash-ash", "admin"))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(keyStr)))
                .compact();
    }

    @GetMapping("/test")
    public AuthPayloadDto test(@RequestHeader("token") String token) {
        if (token == null) return null;
        String payload = Jwts.parserBuilder()
                .setSigningKey(Decoders.BASE64.decode(keyStr)).build().parseClaimsJws(token).getBody().getSubject();
        return AuthPayloadDto.deserialize(payload);
    }

    @PostMapping("/firebase")
    public String firebase(@RequestParam("file") MultipartFile multipartFile) {
        return firebaseService.upload(multipartFile);
    }

    @GetMapping("/test2")
    public String test2() {
        return StringUtils.generateEmailToken();
    }

    @GetMapping("/mail")
    public String sendEmail(@RequestParam(name = "email", required = true) String email) {
        System.out.println("Eamil:**************" + email);
        return mail.sendEmail(email, "hi", "testing");
    }

}
