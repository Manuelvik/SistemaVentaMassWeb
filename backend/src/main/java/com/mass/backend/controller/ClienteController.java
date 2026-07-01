package com.mass.backend.controller;

import com.mass.backend.entity.Cliente;
import com.mass.backend.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteRepository clienteRepository;

    @GetMapping
    public List<Cliente> listar() {
        return clienteRepository.findByActivoTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Long id) {
        return clienteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Cliente cliente) {

        if (cliente.getDni() != null && clienteRepository.existsByDni(cliente.getDni())) {
            return ResponseEntity.badRequest().body("Ya existe un cliente con ese DNI");
        }

        cliente.setActivo(true);
        Cliente nuevoCliente = clienteRepository.save(cliente);

        return ResponseEntity.ok(nuevoCliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Cliente clienteActualizado) {

        return clienteRepository.findById(id)
                .map(cliente -> {
                    cliente.setDni(clienteActualizado.getDni());
                    cliente.setNombre(clienteActualizado.getNombre());
                    cliente.setTelefono(clienteActualizado.getTelefono());
                    cliente.setDireccion(clienteActualizado.getDireccion());

                    Cliente clienteGuardado = clienteRepository.save(cliente);
                    return ResponseEntity.ok(clienteGuardado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {

        return clienteRepository.findById(id)
                .map(cliente -> {
                    cliente.setActivo(false);
                    clienteRepository.save(cliente);
                    return ResponseEntity.ok("Cliente eliminado correctamente");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}