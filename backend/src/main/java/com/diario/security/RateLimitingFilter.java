package com.diario.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Rate limiting simples por IP: 60 requisições / minuto para a API geral
 * e um limite mais estrito (5/min) para o endpoint de login, mitigando
 * ataques de força bruta.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket criarBucketGeral() {
        Bandwidth limite = Bandwidth.classic(60, io.github.bucket4j.Refill.greedy(60, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limite).build();
    }

    private Bucket criarBucketLogin() {
        Bandwidth limite = Bandwidth.classic(5, io.github.bucket4j.Refill.greedy(5, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limite).build();
    }

    private String obterIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = request.getRemoteAddr();
        }
        return ip.split(",")[0].trim();
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {

        String ip = obterIp(request);
        boolean isLogin = request.getRequestURI().contains("/api/auth/login");
        String chave = ip + (isLogin ? ":login" : ":geral");

        Bucket bucket = buckets.computeIfAbsent(chave, k -> isLogin ? criarBucketLogin() : criarBucketGeral());

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write(
                "{\"erro\":\"Too Many Requests\",\"mensagem\":\"Limite de requisições excedido. Tente novamente em instantes.\"}"
            );
        }
    }
}
