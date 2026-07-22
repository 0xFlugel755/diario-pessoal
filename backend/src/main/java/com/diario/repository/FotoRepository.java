package com.diario.repository;

import com.diario.model.Foto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FotoRepository extends JpaRepository<Foto, UUID> {
    List<Foto> findByDiarioId(UUID diarioId);
    void deleteByDiarioId(UUID diarioId);
}
