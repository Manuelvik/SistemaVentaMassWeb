package com.mass.backend.controller;

import com.mass.backend.entity.Proveedor;
import com.mass.backend.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proveedores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProveedorController {

    private final ProveedorRepository proveedorRepository;

    @GetMapping
    public List<Proveedor> listar() {
        return proveedorRepository.findByActivoTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> buscarPorId(@PathVariable Long id) {
        return proveedorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Proveedor proveedor) {

        if (proveedor.getRuc() != null && proveedorRepository.existsByRuc(proveedor.getRuc())) {
            return ResponseEntity.badRequest().body("Ya existe un proveedor con ese RUC");
        }

        proveedor.setActivo(true);
        Proveedor nuevoProveedor = proveedorRepository.save(proveedor);

        return ResponseEntity.ok(nuevoProveedor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Proveedor proveedorActualizado) {

        return proveedorRepository.findById(id)
                .map(proveedor -> {
                    proveedor.setRuc(proveedorActualizado.getRuc());
                    proveedor.setNombre(proveedorActualizado.getNombre());
                    proveedor.setTelefono(proveedorActualizado.getTelefono());
                    proveedor.setDireccion(proveedorActualizado.getDireccion());

                    Proveedor proveedorGuardado = proveedorRepository.save(proveedor);
                    return ResponseEntity.ok(proveedorGuardado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {

        return proveedorRepository.findById(id)
                .map(proveedor -> {
                    proveedor.setActivo(false);
                    proveedorRepository.save(proveedor);
                    return ResponseEntity.ok("Proveedor eliminado correctamente");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}