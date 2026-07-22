package com.diario.service;

import com.diario.dto.DiarioRequestDTO;
import com.diario.dto.DiarioResponseDTO;
import com.diario.dto.FotoDTO;
import com.diario.exception.ConflictException;
import com.diario.exception.ResourceNotFoundException;
import com.diario.model.Diario;
import com.diario.model.Foto;
import com.diario.model.Usuario;
import com.diario.repository.DiarioRepository;
import com.diario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiarioService {

    private final DiarioRepository diarioRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public DiarioResponseDTO criar(UUID usuarioId, DiarioRequestDTO request) {
        Usuario usuario = usuarioRepository.getReferenceById(usuarioId);

        diarioRepository.findByUsuarioIdAndData(usuarioId, request.getData()).ifPresent(d -> {
            throw new ConflictException("Já existe uma anotação para esta data. Edite a existente.");
        });

        Diario diario = Diario.builder()
                .usuario(usuario)
                .data(request.getData())
                .conteudoTexto(request.getConteudoTexto())
                .emojiHumor(request.getEmojiHumor())
                .build();

        adicionarFotos(diario, request.getFotos());

        Diario salvo = diarioRepository.save(diario);
        return toResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<DiarioResponseDTO> listar(UUID usuarioId, LocalDate inicio, LocalDate fim) {
        List<Diario> diarios = (inicio != null && fim != null)
                ? diarioRepository.findByUsuarioIdAndDataBetweenOrderByDataDesc(usuarioId, inicio, fim)
                : diarioRepository.findByUsuarioIdOrderByDataDesc(usuarioId);

        return diarios.stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DiarioResponseDTO buscarPorId(UUID usuarioId, UUID id) {
        Diario diario = buscarEValidarPropriedade(usuarioId, id);
        return toResponseDTO(diario);
    }

    @Transactional
    public DiarioResponseDTO atualizar(UUID usuarioId, UUID id, DiarioRequestDTO request) {
        Diario diario = buscarEValidarPropriedade(usuarioId, id);

        diario.setData(request.getData());
        diario.setConteudoTexto(request.getConteudoTexto());
        diario.setEmojiHumor(request.getEmojiHumor());

        diario.getFotos().clear();
        adicionarFotos(diario, request.getFotos());

        Diario atualizado = diarioRepository.save(diario);
        return toResponseDTO(atualizado);
    }

    @Transactional
    public void excluir(UUID usuarioId, UUID id) {
        Diario diario = buscarEValidarPropriedade(usuarioId, id);
        // fotos são removidas em cascata (orphanRemoval / ON DELETE CASCADE no banco)
        diarioRepository.delete(diario);
    }

    /**
     * Garante que o registro pertence EXCLUSIVAMENTE ao usuário autenticado.
     * Lança 404 (não 403) para não revelar a existência de registros de terceiros.
     */
    private Diario buscarEValidarPropriedade(UUID usuarioId, UUID id) {
        return diarioRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Anotação não encontrada"));
    }

    private void adicionarFotos(Diario diario, List<FotoDTO> fotosDTO) {
        if (fotosDTO == null) return;
        fotosDTO.forEach(f -> diario.getFotos().add(
                Foto.builder()
                        .diario(diario)
                        .urlFoto(f.getUrlFoto())
                        .publicId(f.getPublicId())
                        .build()
        ));
    }

    private DiarioResponseDTO toResponseDTO(Diario diario) {
        List<FotoDTO> fotos = diario.getFotos().stream()
                .map(f -> FotoDTO.builder().id(f.getId()).urlFoto(f.getUrlFoto()).publicId(f.getPublicId()).build())
                .collect(Collectors.toList());

        return DiarioResponseDTO.builder()
                .id(diario.getId())
                .data(diario.getData())
                .conteudoTexto(diario.getConteudoTexto())
                .emojiHumor(diario.getEmojiHumor())
                .fotos(fotos)
                .criadoEm(diario.getCriadoEm())
                .atualizadoEm(diario.getAtualizadoEm())
                .build();
    }
}
