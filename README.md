Ágora Digital - Backend API (Laravel)

Este repositorio contiene la API RESTful que sirve como backend para **Ágora Digital**, una aplicación de gestión integral para clínicas de psicología. 

Este proyecto ha sido desarrollado como Proyecto Final del **Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW)**.

## Descripción del Proyecto

El objetivo de esta API es proporcionar un sistema centralizado, seguro y escalable para gestionar los pilares fundamentales de una clínica: **Usuarios, Pacientes y Citas**. Se ha diseñado siguiendo una arquitectura orientada a servicios (API REST), desacoplando completamente el backend del frontend (desarrollado en React).

Se ha hecho especial hincapié en la **seguridad, la autenticación y el control de acceso basado en roles (RBAC)**, garantizando que cada tipo de usuario solo pueda acceder a los recursos que le corresponden.

## Tecnologías Utilizadas

* **Framework:** Laravel (PHP)
* **Base de Datos:** SQLite (Configurada con borrado en cascada e integridad referencial)
* **Autenticación:** Laravel Sanctum (Autenticación basada en Tokens)
* **Testing de API:** Postman

## Características Principales y Lógica de Negocio

La API maneja tres roles principales de usuarios:
1. **Administradores (Rol 1):** Acceso total a los registros de la clínica.
2. **Profesionales/Psicólogos (Rol 2):** Pueden gestionar *únicamente* a sus propios pacientes y su propia agenda de citas.
3. **Pacientes (Rol 3):** Tienen acceso restringido para consultar y actualizar su información de contacto y credenciales.

### Hitos Técnicos Destacados:
* **CRUD Completo y Relacional:** Gestión de Pacientes y Citas conectados a través de Modelos Eloquent (`HasMany`, `BelongsTo`).
* **Actualización Sincronizada:** Lógica de actualización doble que permite modificar datos en tablas separadas (`pacientes` y `users`) con una sola petición HTTP.
* **Middlewares de Seguridad:** Rutas protegidas mediante `auth:sanctum` para garantizar que ninguna petición sin token válido sea procesada.
* **Consultas Optimizadas:** Uso de métodos como `whereIn` y `pluck` para evitar problemas de N+1 y mejorar el rendimiento de las consultas relacionales.

## Endpoints Principales

A continuación se muestra un resumen de las rutas principales de la API. *Todas requieren un Token de Sanctum en el header (`Authorization: Bearer <token>`).*

### Autenticación
* `POST /api/login` - Autenticación y generación de Token.
* `POST /api/logout` - Revocación del Token activo.

### Pacientes
* `GET /api/pacientes` - Lista de pacientes filtrada por el rol del usuario logueado.
* `POST /api/pacientes` - Creación simultánea de usuario (User) y ficha médica (Paciente).
* `PUT /api/pacientes/{id}` - Modificación de datos del paciente.
* `DELETE /api/pacientes/{id}` - Eliminación del paciente y su cuenta de acceso asociada.

### Citas
* `GET /api/citas` - Lectura de la agenda de citas filtrada por profesional.
* `POST /api/citas` - Asignación de una nueva cita a un paciente.
* `PUT /api/citas/{id}` - Modificación de fecha, modalidad o estado de la cita.
* `DELETE /api/citas/{id}` - Cancelación/Eliminación de la cita.
