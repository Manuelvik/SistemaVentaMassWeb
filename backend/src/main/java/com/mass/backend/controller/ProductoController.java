package com.mass.backend.controller;

import com.mass.backend.entity.Producto;
import com.mass.backend.entity.Proveedor;
import com.mass.backend.repository.ProductoRepository;
import com.mass.backend.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoRepository productoRepository;
    private final ProveedorRepository proveedorRepository;

    @GetMapping
    public List<Producto> listar() {
        return productoRepository.findByActivoTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarPorId(@PathVariable Long id) {
        return productoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Producto> buscarPorCodigo(@PathVariable String codigo) {
        return productoRepository.findByCodigo(codigo)
                .filter(producto -> Boolean.TRUE.equals(producto.getActivo()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Producto producto) {

        if (producto.getCodigo() != null && productoRepository.existsByCodigo(producto.getCodigo())) {
            return ResponseEntity.badRequest().body("Ya existe un producto con ese código");
        }

        if (producto.getProveedor() != null && producto.getProveedor().getId() != null) {
            Proveedor proveedor = proveedorRepository.findById(producto.getProveedor().getId())
                    .orElse(null);

            if (proveedor == null) {
                return ResponseEntity.badRequest().body("Proveedor no encontrado");
            }

            producto.setProveedor(proveedor);
        }

        producto.setActivo(true);
        Producto nuevoProducto = productoRepository.save(producto);

        return ResponseEntity.ok(nuevoProducto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Producto productoActualizado) {

        return productoRepository.findById(id)
                .map(producto -> {
                    producto.setCodigo(productoActualizado.getCodigo());
                    producto.setNombre(productoActualizado.getNombre());
                    producto.setDescripcion(productoActualizado.getDescripcion());
                    producto.setPrecio(productoActualizado.getPrecio());
                    producto.setStock(productoActualizado.getStock());
                    producto.setCategoria(productoActualizado.getCategoria());

                    if (productoActualizado.getProveedor() != null && productoActualizado.getProveedor().getId() != null) {
                        proveedorRepository.findById(productoActualizado.getProveedor().getId())
                                .ifPresent(producto::setProveedor);
                    }

                    Producto productoGuardado = productoRepository.save(producto);
                    return ResponseEntity.ok(productoGuardado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {

        return productoRepository.findById(id)
                .map(producto -> {
                    producto.setActivo(false);
                    productoRepository.save(producto);
                    return ResponseEntity.ok("Producto eliminado correctamente");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}