package com.mass.backend.security;

import com.mass.backend.entity.Empleado;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET = "clave_super_secreta_para_sistema_venta_mass_2026_segura";
    private static final long EXPIRATION = 1000 * 60 * 60 * 8;

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generarToken(Empleado empleado) {
        return Jwts.builder()
                .setSubject(empleado.getUsuario())
                .claim("id", empleado.getId())
                .claim("nombre", empleado.getNombre())
                .claim("rol", empleado.getRol())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}