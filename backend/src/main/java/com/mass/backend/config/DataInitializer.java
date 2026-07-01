package com.mass.backend.config;

import com.mass.backend.entity.Empleado;
import com.mass.backend.repository.EmpleadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final EmpleadoRepository empleadoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (empleadoRepository.findByUsuario("admin").isEmpty()) {
            Empleado empleado = Empleado.builder()
                    .nombre("Administrador")
                    .usuario("admin")
                    .password(passwordEncoder.encode("123456"))
                    .rol("ADMIN")
                    .activo(true)
                    .build();

            empleadoRepository.save(empleado);
        }
    }
}