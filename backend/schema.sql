-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-07-2024 a las 18:00:00
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `adopcion_mascotas`
--
CREATE DATABASE IF NOT EXISTS `adopcion_mascotas` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `adopcion_mascotas`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adopciones`
--

DROP TABLE IF EXISTS `adopciones`;
CREATE TABLE `adopciones` (
  `id` int(11) NOT NULL,
  `mascota_id` int(11) NOT NULL,
  `adoptante_id` int(11) NOT NULL,
  `fecha_solicitud` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` enum('pendiente','aprobada','rechazada','completada') NOT NULL DEFAULT 'pendiente',
  `motivo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fundaciones`
--

DROP TABLE IF EXISTS `fundaciones`;
CREATE TABLE `fundaciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `sitio_web` varchar(255) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `aprobacion` enum('pendiente','aprobada','rechazada') NOT NULL DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascotas`
--

DROP TABLE IF EXISTS `mascotas`;
CREATE TABLE `mascotas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `especie` varchar(100) NOT NULL,
  `raza` varchar(100) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `sexo` enum('macho','hembra') DEFAULT NULL,
  `tamano` enum('pequeño','mediano','grande') DEFAULT NULL,
  `peso` decimal(6,2) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `estado_salud` text DEFAULT NULL,
  `historia` text DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `fecha_publicacion` datetime NOT NULL DEFAULT current_timestamp(),
  `publicado_por_id` int(11) DEFAULT NULL,
  `disponible` tinyint(1) DEFAULT 1,
  `esterilizado` tinyint(1) DEFAULT 0,
  `vacunas` tinyint(1) DEFAULT 0,
  `tags` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `enlace` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre_rol` varchar(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre_rol`) VALUES
(1, 'admin'),
(2, 'usuario'),
(3, 'refugio');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimiento_adopcion`
--

DROP TABLE IF EXISTS `seguimiento_adopcion`;
CREATE TABLE `seguimiento_adopcion` (
  `id` int(11) NOT NULL,
  `solicitud_id` int(11) NOT NULL,
  `fecha_seguimiento` datetime NOT NULL DEFAULT current_timestamp(),
  `comentarios` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_roles`
--

DROP TABLE IF EXISTS `usuario_roles`;
CREATE TABLE `usuario_roles` (
  `usuario_id` int(11) NOT NULL,
  `rol_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `contraseña` varchar(255) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1,
  `estado` enum('activo','bloqueado') NOT NULL DEFAULT 'activo',
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpire` datetime DEFAULT NULL,
  `biografia` TEXT DEFAULT NULL,
  `foto_perfil_url` VARCHAR(255) DEFAULT NULL,
  `solicitud_rol_refugio_estado` VARCHAR(50) DEFAULT 'ninguna' NOT NULL,
  `solicitud_rol_refugio_motivacion` TEXT DEFAULT NULL,
  `notificarEmail` TINYINT(1) DEFAULT 1 NOT NULL,
  `notificarWeb` TINYINT(1) DEFAULT 1 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `campanas_noticias`
--

DROP TABLE IF EXISTS `campanas_noticias`;
CREATE TABLE `campanas_noticias` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `contenido` longtext NOT NULL,
  `tipo` enum('campana','noticia') NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `estado` enum('activa','publicada','borrador','inactiva') NOT NULL DEFAULT 'borrador',
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_publicacion` datetime DEFAULT NULL,
  `autor_id` int(11) DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `fundacion_asociada` varchar(255) DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `objetivo` varchar(255) DEFAULT NULL,
  `progreso` int(11) DEFAULT 0,
  `tags` text DEFAULT NULL,
  `vistas` int(11) DEFAULT 0,
  `likes` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `campanas_noticias_likes`
--

DROP TABLE IF EXISTS `campanas_noticias_likes`;
CREATE TABLE `campanas_noticias_likes` (
  `id` int(11) NOT NULL,
  `campana_noticia_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_like` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `adopciones`
--
ALTER TABLE `adopciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mascota_id` (`mascota_id`),
  ADD KEY `adoptante_id` (`adoptante_id`);

--
-- Indices de la tabla `fundaciones`
--
ALTER TABLE `fundaciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `publicado_por_id` (`publicado_por_id`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_rol` (`nombre_rol`);

--
-- Indices de la tabla `seguimiento_adopcion`
--
ALTER TABLE `seguimiento_adopcion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `solicitud_id` (`solicitud_id`);

--
-- Indices de la tabla `usuario_roles`
--
ALTER TABLE `usuario_roles`
  ADD PRIMARY KEY (`usuario_id`,`rol_id`),
  ADD KEY `rol_id` (`rol_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `campanas_noticias`
--
ALTER TABLE `campanas_noticias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor_id` (`autor_id`),
  ADD KEY `tipo` (`tipo`),
  ADD KEY `estado` (`estado`),
  ADD KEY `categoria` (`categoria`);

--
-- Indices de la tabla `campanas_noticias_likes`
--
ALTER TABLE `campanas_noticias_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`campana_noticia_id`,`usuario_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `adopciones`
--
ALTER TABLE `adopciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fundaciones`
--
ALTER TABLE `fundaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `seguimiento_adopcion`
--
ALTER TABLE `seguimiento_adopcion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `campanas_noticias`
--
ALTER TABLE `campanas_noticias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `campanas_noticias_likes`
--
ALTER TABLE `campanas_noticias_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adopciones`
--
ALTER TABLE `adopciones`
  ADD CONSTRAINT `adopciones_ibfk_1` FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `adopciones_ibfk_2` FOREIGN KEY (`adoptante_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `fundaciones`
--
ALTER TABLE `fundaciones`
  ADD CONSTRAINT `fundaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD CONSTRAINT `mascotas_ibfk_1` FOREIGN KEY (`publicado_por_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `seguimiento_adopcion`
--
ALTER TABLE `seguimiento_adopcion`
  ADD CONSTRAINT `seguimiento_adopcion_ibfk_1` FOREIGN KEY (`solicitud_id`) REFERENCES `adopciones` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuario_roles`
--
ALTER TABLE `usuario_roles`
  ADD CONSTRAINT `usuario_roles_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuario_roles_ibfk_2` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;