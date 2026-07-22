package com.diario.repository;

import com.diario.model.Diario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DiarioRepository extends JpaRepository<Diario, UUID> {

    // Todas as consultas são SEMPRE filtradas por usuarioId (isolamento de dados)

    List<Diario> findByUsuarioIdOrderByDataDesc(UUID usuarioId);

    Optional<Diario> findByIdAndUsuarioId(UUID id, UUID usuarioId);

    Optional<Diario> findByUsuarioIdAndData(UUID usuarioId, LocalDate data);

    List<Diario> findByUsuarioIdAndDataBetweenOrderByDataDesc(
            UUID usuarioId, LocalDate inicio, LocalDate fim);

    boolean existsByIdAndUsuarioId(UUID id, UUID usuarioId);
}
