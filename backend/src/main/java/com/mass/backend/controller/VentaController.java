package com.mass.backend.controller;

import com.mass.backend.dto.DetalleRequest;
import com.mass.backend.dto.VentaRequest;
import com.mass.backend.entity.*;
import com.mass.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/ventas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VentaController {

    private final VentaRepository ventaRepository;
    private final ClienteRepository clienteRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ProductoRepository productoRepository;

    @GetMapping
    public List<Venta> listar() {
        return ventaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> buscarPorId(@PathVariable Long id) {
        return ventaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> registrarVenta(@RequestBody VentaRequest request) {

        Cliente cliente = clienteRepository.findById(request.getClienteId()).orElse(null);
        if (cliente == null) {
            return ResponseEntity.badRequest().body("Cliente no encontrado");
        }

        Empleado empleado = empleadoRepository.findById(request.getEmpleadoId()).orElse(null);
        if (empleado == null) {
            return ResponseEntity.badRequest().body("Empleado no encontrado");
        }

        if (request.getDetalles() == null || request.getDetalles().isEmpty()) {
            return ResponseEntity.badRequest().body("La venta debe tener al menos un producto");
        }

        Venta venta = new Venta();
        venta.setFecha(LocalDateTime.now());
        venta.setCliente(cliente);
        venta.setEmpleado(empleado);
        venta.setEstado("REGISTRADA");

        List<DetalleVenta> detallesVenta = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (DetalleRequest detalleRequest : request.getDetalles()) {

            Producto producto = productoRepository.findById(detalleRequest.getProductoId()).orElse(null);

            if (producto == null) {
                return ResponseEntity.badRequest().body("Producto no encontrado con ID: " + detalleRequest.getProductoId());
            }

            if (!Boolean.TRUE.equals(producto.getActivo())) {
                return ResponseEntity.badRequest().body("Producto inactivo: " + producto.getNombre());
            }

            if (detalleRequest.getCantidad() == null || detalleRequest.getCantidad() <= 0) {
                return ResponseEntity.badRequest().body("Cantidad inválida para el producto: " + producto.getNombre());
            }

            if (producto.getStock() < detalleRequest.getCantidad()) {
                return ResponseEntity.badRequest().body("Stock insuficiente para el producto: " + producto.getNombre());
            }

            BigDecimal precioUnitario = producto.getPrecio();
            BigDecimal subtotal = precioUnitario.multiply(BigDecimal.valueOf(detalleRequest.getCantidad()));

            DetalleVenta detalleVenta = new DetalleVenta();
            detalleVenta.setVenta(venta);
            detalleVenta.setProducto(producto);
            detalleVenta.setCantidad(detalleRequest.getCantidad());
            detalleVenta.setPrecioUnitario(precioUnitario);
            detalleVenta.setSubtotal(subtotal);

            detallesVenta.add(detalleVenta);
            total = total.add(subtotal);

            producto.setStock(producto.getStock() - detalleRequest.getCantidad());
            productoRepository.save(producto);
        }

        venta.setTotal(total);
        venta.setDetalles(detallesVenta);

        Venta ventaGuardada = ventaRepository.save(venta);

        return ResponseEntity.ok(ventaGuardada);
    }
}