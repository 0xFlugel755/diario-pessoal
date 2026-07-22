package com.diario.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
    name = "diarios",
    uniqueConstraints = @UniqueConstraint(name = "uq_usuario_data", columnNames = {"usuario_id", "data"})
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Diario {

    @Id
    @UuidGenerator
    @Column(name = "id", columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "data", nullable = false)
    private LocalDate data;

    @Lob
    @Column(name = "conteudo_texto", nullable = false, columnDefinition = "MEDIUMTEXT")
    private String conteudoTexto;

    @Column(name = "emoji_humor", length = 20)
    private String emojiHumor;

    @OneToMany(mappedBy = "diario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Foto> fotos = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;
}
