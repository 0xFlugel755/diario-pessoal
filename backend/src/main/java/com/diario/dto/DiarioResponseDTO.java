package com.diario.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiarioResponseDTO {
    private UUID id;
    private LocalDate data;
    private String conteudoTexto;
    private String emojiHumor;
    private List<FotoDTO> fotos;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}
