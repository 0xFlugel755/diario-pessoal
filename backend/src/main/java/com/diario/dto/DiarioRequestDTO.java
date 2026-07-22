package com.diario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiarioRequestDTO {

    @NotNull(message = "A data é obrigatória")
    private LocalDate data;

    @NotBlank(message = "O conteúdo não pode estar vazio")
    private String conteudoTexto;

    private String emojiHumor;

    /** URLs de fotos já enviadas ao S3/Cloudinary (upload feito antes via endpoint próprio) */
    private List<FotoDTO> fotos;
}
