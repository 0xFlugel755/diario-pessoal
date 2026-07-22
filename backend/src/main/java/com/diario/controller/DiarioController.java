package com.diario.controller;

import com.diario.dto.DiarioRequestDTO;
import com.diario.dto.DiarioResponseDTO;
import com.diario.security.UserPrincipal;
import com.diario.service.DiarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/diarios")
@RequiredArgsConstructor
public class DiarioController {

    private final DiarioService diarioService;

    @PostMapping
    public ResponseEntity<DiarioResponseDTO> criar(@AuthenticationPrincipal UserPrincipal usuario,
                                                    @Valid @RequestBody DiarioRequestDTO request) {
        DiarioResponseDTO criado = diarioService.criar(usuario.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping
    public ResponseEntity<List<DiarioResponseDTO>> listar(
            @AuthenticationPrincipal UserPrincipal usuario,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        return ResponseEntity.ok(diarioService.listar(usuario.getId(), inicio, fim));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiarioResponseDTO> buscarPorId(@AuthenticationPrincipal UserPrincipal usuario,
                                                          @PathVariable UUID id) {
        return ResponseEntity.ok(diarioService.buscarPorId(usuario.getId(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiarioResponseDTO> atualizar(@AuthenticationPrincipal UserPrincipal usuario,
                                                        @PathVariable UUID id,
                                                        @Valid @RequestBody DiarioRequestDTO request) {
        return ResponseEntity.ok(diarioService.atualizar(usuario.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@AuthenticationPrincipal UserPrincipal usuario,
                                         @PathVariable UUID id) {
        diarioService.excluir(usuario.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
