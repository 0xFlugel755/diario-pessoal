package com.diario.service;

import com.diario.model.LogAcesso;
import com.diario.repository.LogAcessoRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final LogAcessoRepository logAcessoRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void registrarAcesso(UUID usuarioId, String username, String nome,
                                 HttpServletRequest request, LogAcesso.Status status) {

        LogAcesso log = LogAcesso.builder()
                .usuarioId(usuarioId)
                .username(username)
                .nome(nome)
                .ipOrigem(obterIp(request))
                .userAgent(request.getHeader("User-Agent"))
                .status(status)
                .build();

        LogAcesso salvo = logAcessoRepository.save(log);

        // Transmite em tempo real para o painel administrativo assinante de /topic/logs
        messagingTemplate.convertAndSend("/topic/logs", salvo);
    }

    private String obterIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = request.getRemoteAddr();
        }
        return ip.split(",")[0].trim();
    }
}
