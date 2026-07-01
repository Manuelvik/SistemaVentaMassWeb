package com.mass.backend.controller;

import com.mass.backend.dto.LoginRequest;
import com.mass.backend.dto.LoginResponse;
import com.mass.backend.entity.Empleado;
import com.mass.backend.repository.EmpleadoRepository;
import com.mass.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final EmpleadoRepository empleadoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Empleado empleado = empleadoRepository.findByUsuario(request.getUsuario())
                .orElse(null);

        if (empleado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Usuario no encontrado");
        }

        if (!Boolean.TRUE.equals(empleado.getActivo())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Empleado inactivo");
        }

        if (!passwordEncoder.matches(request.getPassword(), empleado.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Contraseña incorrecta");
        }

        String token = jwtService.generarToken(empleado);

        LoginResponse response = new LoginResponse(
                token,
                empleado.getUsuario(),
                empleado.getNombre(),
                empleado.getRol()
        );

        return ResponseEntity.ok(response);
    }
}