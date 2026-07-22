package com.diario.service;

import com.diario.dto.AuthDTOs.LoginRequestDTO;
import com.diario.dto.AuthDTOs.LoginResponseDTO;
import com.diario.dto.AuthDTOs.RegisterRequestDTO;
import com.diario.exception.ConflictException;
import com.diario.model.LogAcesso;
import com.diario.model.Usuario;
import com.diario.repository.UsuarioRepository;
import com.diario.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AuditLogService auditLogService;

    @Transactional
    public void registrar(RegisterRequestDTO request) {
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Nome de usuário já está em uso");
        }
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("E-mail já cadastrado");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .username(request.getUsername())
                .email(request.getEmail())
                .senhaHash(passwordEncoder.encode(request.getSenha()))
                .ativo(true)
                .build();

        usuarioRepository.save(usuario);
    }

    @Transactional
    public LoginResponseDTO login(LoginRequestDTO request, HttpServletRequest httpRequest) {
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername()).orElse(null);

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getSenha())
            );
        } catch (Exception ex) {
            auditLogService.registrarAcesso(
                    usuario != null ? usuario.getId() : null,
                    request.getUsername(),
                    usuario != null ? usuario.getNome() : null,
                    httpRequest,
                    LogAcesso.Status.FALHA
            );
            throw new BadCredentialsException("Usuário ou senha inválidos");
        }

        String token = jwtUtil.gerarToken(usuario.getId(), usuario.getUsername());

        auditLogService.registrarAcesso(
                usuario.getId(), usuario.getUsername(), usuario.getNome(), httpRequest, LogAcesso.Status.SUCESSO
        );

        return LoginResponseDTO.builder()
                .token(token)
                .username(usuario.getUsername())
                .nome(usuario.getNome())
                .expiraEmSegundos(jwtUtil.getExpirationSeconds())
                .build();
    }
}
