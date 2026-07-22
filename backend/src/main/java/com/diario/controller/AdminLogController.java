package com.diario.controller;

import com.diario.model.LogAcesso;
import com.diario.repository.LogAcessoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Endpoint REST auxiliar para o painel administrativo carregar o histórico
 * recente de logs ao abrir a tela; os logs subsequentes chegam ao vivo via
 * WebSocket (STOMP) no tópico /topic/logs.
 */
@RestController
@RequestMapping("/api/admin/logs")
@RequiredArgsConstructor
public class AdminLogController {

    private final LogAcessoRepository logAcessoRepository;

    @GetMapping
    public List<LogAcesso> listarRecentes() {
        return logAcessoRepository.findTop50ByOrderByTimestampLogDesc();
    }
}
