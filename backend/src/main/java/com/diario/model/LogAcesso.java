package com.diario.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "logs_acesso")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogAcesso {

    public enum Status { SUCESSO, FALHA }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", columnDefinition = "CHAR(36)")
    private UUID usuarioId;

    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Column(name = "nome", length = 150)
    private String nome;

    @Column(name = "ip_origem", nullable = false, length = 45)
    private String ipOrigem;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status;

    @CreationTimestamp
    @Column(name = "timestamp_log", updatable = false)
    private LocalDateTime timestampLog;
}
