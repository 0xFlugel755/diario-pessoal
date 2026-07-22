package com.diario.repository;

import com.diario.model.LogAcesso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogAcessoRepository extends JpaRepository<LogAcesso, Long> {
    List<LogAcesso> findTop50ByOrderByTimestampLogDesc();
}
