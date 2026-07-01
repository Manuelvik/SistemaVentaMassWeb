package com.mass.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VentaRequest {

    private Long clienteId;
    private Long empleadoId;
    private List<DetalleRequest> detalles;
}