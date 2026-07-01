package com.mass.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DetalleRequest {

    private Long productoId;
    private Integer cantidad;
}