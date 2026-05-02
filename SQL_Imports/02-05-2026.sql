-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 02-05-2026 a las 18:25:14
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
-- Base de datos: `tienda`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aplicaciones`
--

CREATE TABLE `aplicaciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `plataforma_id` int(11) DEFAULT NULL,
  `fecha_lanzamiento` date DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `aplicaciones`
--

INSERT INTO `aplicaciones` (`id`, `nombre`, `plataforma_id`, `fecha_lanzamiento`, `imagen`) VALUES
(1, 'Nintendo Store', 3, '2025-11-05', './fotos/aplicaciones/nintendo-store-app.jpg'),
(2, 'Nintendo Today!', 3, '2025-10-27', './fotos/aplicaciones/nintendo-today.jpg'),
(3, 'Nintendo Music', 3, '2024-10-31', './fotos/aplicaciones/nintendo-music.jpg'),
(4, 'Fire Emblem Shadows', 3, '2025-09-25', './fotos/aplicaciones/fire-emblem.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `juego_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrousel`
--

CREATE TABLE `carrousel` (
  `id` int(11) NOT NULL,
  `url_imagen` varchar(255) DEFAULT NULL,
  `alt` varchar(100) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `boton_texto` varchar(100) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `orden` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrousel`
--

INSERT INTO `carrousel` (`id`, `url_imagen`, `alt`, `titulo`, `boton_texto`, `link`, `orden`) VALUES
(1, './fotos/Carrousel/mario-tennis.jpg', 'Mario Tennis Aces', 'Disponible 12-02', 'Nuevo tráiler', 'https://www.youtube.com/watch?v=example5', 1),
(2, './fotos/Carrousel/nintendo-direct.jpg', 'Nintendo Direct', '¡Ya lo podéis ver!', 'Seguidlo aquí', 'https://www.youtube.com/watch?v=example5', 2),
(3, './fotos/Carrousel/tomodachi-live.jpg', 'Tomodachi Life', NULL, NULL, NULL, 3),
(4, './fotos/Carrousel/pokopia.jpg', 'Pokopia', '¡Se lanza el 05-03!', 'Reservas disponibles', 'https://www.youtube.com/watch?v=example5', 4),
(5, './fotos/Carrousel/animal-crossing.jpg', 'Animal Crossing', 'Disfruta como nunca la vida insular', '¡Ya disponible!', 'https://www.youtube.com/watch?v=example4', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `etiquetas`
--

CREATE TABLE `etiquetas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `etiquetas`
--

INSERT INTO `etiquetas` (`id`, `nombre`) VALUES
(4, 'Juegos'),
(1, 'Nintendo Switch'),
(2, 'Nintendo Switch 2'),
(3, 'Noticias');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favoritos`
--

CREATE TABLE `favoritos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `juego_id` int(11) NOT NULL,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `favoritos`
--

INSERT INTO `favoritos` (`id`, `usuario_id`, `juego_id`, `fecha_agregado`) VALUES
(3, 1, 1, '2026-04-28 08:35:00'),
(4, 1, 4, '2026-05-01 14:24:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `juegos`
--

CREATE TABLE `juegos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `plataforma_id` int(11) DEFAULT NULL,
  `fecha_lanzamiento` date DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `es_nueva_consola` tinyint(1) NOT NULL DEFAULT 0,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `juegos`
--

INSERT INTO `juegos` (`id`, `titulo`, `plataforma_id`, `fecha_lanzamiento`, `imagen`, `es_nueva_consola`, `precio`) VALUES
(1, 'RESIDENT EVIL Requiem', 1, '2026-02-27', './fotos/juegos/resident-evil-requiem.jpg', 1, 69.99),
(2, 'DRAGON QUEST VII Reimagined', 1, '2026-02-03', './fotos/juegos/dragon-quest.jpg', 1, 59.60),
(3, 'Monster Hunter Stories 3: Twisted Reflection', 1, '2026-03-13', './fotos/juegos/monster-hunte.jpg', 1, 50.60),
(4, 'Mario Kart World', 1, '2025-06-25', './fotos/juegos/mario-kart-world.jpg', 1, 49.90),
(5, 'Celeste', 2, '2023-07-23', './fotos/juegos/celeste.jpg', 0, 9.99),
(6, 'FALLOUT 4', 1, '2017-06-21', './fotos/juegos/fallout-4.jpg', 1, 79.99),
(7, 'Persona 5 Royal', 2, '2026-03-03', './fotos/juegos/persona-5-royal.jpg', 0, 59.99),
(8, 'Hades II', 1, '2019-06-28', './fotos/juegos/hades_2.jpg', 1, 29.99),
(9, 'Miitopia', 2, '2026-04-01', './fotos/juegos/miitopia.jpg', 0, 89.99),
(10, 'Animal Croosing New Horizons', 2, '2020-05-05', './fotos/juegos/nh.jpg', 0, 59.99),
(11, 'Pokemon FireRed Version', 1, '2009-01-14', './fotos/juegos/pokemon-firered.jpg', 1, 9.99),
(12, 'Pokemon Escarlata', 2, '2024-11-07', './fotos/juegos/pokemon-scarlet.jpg', 0, 8.99),
(13, 'Zelda Breath Of The Wild', 2, '2017-06-16', './fotos/juegos/Zelda_botw.jpg', 0, 49.99);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mynintendostore`
--

CREATE TABLE `mynintendostore` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mynintendostore`
--

INSERT INTO `mynintendostore` (`id`, `nombre`, `descripcion`, `imagen`) VALUES
(1, 'Pokopia', 'Ya disponible', './fotos/MyNintendoStore/pokopia.jpg'),
(2, 'Artículos exclusivos de Animal Crossing', 'Ver el catálogo', './fotos/MyNintendoStore/acnh-collection-logo.jpg'),
(3, 'Tomodachi Life: Una vida de ensueño', '16-04-2026', './fotos/MyNintendoStore/tomodachi-life-ltd.jpg'),
(4, 'Camisetas de Super Mario Bros. 40th', 'Ya disponibles', './fotos/MyNintendoStore/super-mario-bros-40th-t-shirt.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `etiqueta_id` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `link` varchar(255) DEFAULT '#'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `noticias`
--

INSERT INTO `noticias` (`id`, `titulo`, `imagen`, `etiqueta_id`, `fecha`, `link`) VALUES
(1, 'Destacados de Nintendo eShop – 23-04-2026', './fotos/noticias/noticia1.jpg', 1, '2026-04-23', '#'),
(2, '¡Ponte al volante y sobrevive a toda costa en el próximo evento europeo en línea de Mario Kart...', './fotos/noticias/noticia2.jpg', 2, '2026-04-21', '#'),
(3, 'Cómo añadir a Bubbles y demás familia a tu isla de Tomodachi Life: Una vida de ensueño', './fotos/noticias/noticia3.jpg', 1, '2026-04-17', '#'),
(4, '¡Aquí están las reseñas de Tomodachi Life: Una vida de ensueño para Nintendo Switch!', './fotos/noticias/noticia4.jpg', NULL, '2026-04-17', '#'),
(5, 'Destacados de Nintendo eShop – 16-04-2026', './fotos/noticias/noticia5.jpg', 1, '2026-04-16', '#'),
(6, '¡Sorteamos el Cuento de Estela!', './fotos/noticias/noticia6.jpg', NULL, '2026-04-15', '#'),
(7, '¡Ya puedes reservar Yoshi and the Mysterious Book!', './fotos/noticias/noticia7.jpg', 2, '2026-04-14', '#'),
(8, 'Pregunta al desarrollador, volumen 21. Tomodachi Life: Una vida de ensueño – Capítulo 3', './fotos/noticias/noticia8.jpg', 2, '2026-04-14', '#');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `novedades_principal`
--

CREATE TABLE `novedades_principal` (
  `id` int(11) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `etiqueta_id` int(11) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `novedades_principal`
--

INSERT INTO `novedades_principal` (`id`, `imagen`, `etiqueta_id`, `titulo`, `descripcion`, `created_at`, `updated_at`) VALUES
(1, './fotos/Novedades/tomodachi-desarrolladores.jpg', 3, 'Pregunta al desarrollador, volumen 21. Tomodachi Life: Una vida de ensueño', '¡Descubre cómo los desarrolladores concentraron en el juego nueve años repletos de ideas!', '2026-04-27 14:41:25', '2026-04-27 14:41:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `novedades_secundarias`
--

CREATE TABLE `novedades_secundarias` (
  `id` int(11) NOT NULL,
  `orden` int(11) NOT NULL DEFAULT 0,
  `imagen` varchar(255) DEFAULT NULL,
  `etiqueta_id` int(11) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `novedades_secundarias`
--

INSERT INTO `novedades_secundarias` (`id`, `orden`, `imagen`, `etiqueta_id`, `titulo`, `created_at`, `updated_at`) VALUES
(1, 1, './fotos/Novedades/human-fall-flat.jpg', 4, '¡Prueba Human: Fall Flat con los juegos de muestra!', '2026-04-27 14:41:25', '2026-04-27 14:41:25'),
(2, 2, './fotos/Novedades/kirby-air-raider.jpg', 3, 'Kirby Air Riders: Reflexiones sobre el desarrollo', '2026-04-27 14:41:25', '2026-04-27 14:41:25'),
(3, 3, './fotos/Novedades/rythm-paradise-groove.jpg', 4, 'Rhythm Paradise Groove dará el do de pecho el 2 de julio', '2026-04-27 14:41:25', '2026-04-27 14:41:25'),
(4, 4, './fotos/Novedades/nso-nes.jpg', 4, '¡Disfruta de estos laberinticos juegos de NES con Nintendo Switch...', '2026-04-27 14:41:25', '2026-04-27 14:41:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plataformas`
--

CREATE TABLE `plataformas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL COMMENT 'consola, movil, pc...'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `plataformas`
--

INSERT INTO `plataformas` (`id`, `nombre`, `tipo`) VALUES
(1, 'Nintendo Switch 2', 'consola'),
(2, 'Nintendo Switch', 'consola'),
(3, 'Dispositivos inteligentes', 'movil');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL COMMENT 'Guardar siempre con password_hash()',
  `rol` enum('user','admin','content_editor','game_manager') NOT NULL DEFAULT 'user',
  `estado` enum('activo','inactivo','bloqueado') NOT NULL DEFAULT 'activo',
  `fecha_registro` date DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `debe_cambiar_password` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 = forzar cambio en el próximo login'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `estado`, `fecha_registro`, `avatar`, `debe_cambiar_password`) VALUES
(1, 'Admin Principal', 'admin@nintendo.com', 'admin', 'admin', 'activo', '2023-01-15', 'https://ui-avatars.com/api/?name=Admin&background=E60012&color=fff', 1),
(2, 'Jairo', 'jairo@nintendo.com', 'Jairo123', 'admin', 'activo', '2023-05-19', 'https://i.pinimg.com/736x/e5/b5/84/e5b5845fd3c0ae43eb58403f792e46e5.jpg', 1),
(3, 'Mario Bros', 'mario.jump@mushroom.kr', '123', 'user', 'activo', '2023-06-01', 'https://ui-avatars.com/api/?name=MB&background=dc2626&color=fff', 1),
(4, 'Luigi', 'luigi.ghost@mushroom.kr', '123', 'user', 'activo', '2023-06-02', 'https://ui-avatars.com/api/?name=L&background=16a34a&color=fff', 1),
(5, 'Zelda', 'princess.zelda@hyrule.gov', '123', 'user', 'activo', '2023-08-11', 'https://ui-avatars.com/api/?name=Z&background=ca8a04&color=fff', 1),
(6, 'Link', 'hero.time@hyrule.gov', '123', 'user', 'inactivo', '2023-08-11', 'https://ui-avatars.com/api/?name=L&background=059669&color=fff', 1),
(7, 'Bowser', 'king.koopa@darkland.com', 'password', 'user', 'bloqueado', '2024-01-05', 'https://ui-avatars.com/api/?name=B&background=ea580c&color=fff', 1),
(8, 'Samus Aran', 'samus.hunter@bounty.gal', '123', 'user', 'activo', '2024-02-15', 'https://ui-avatars.com/api/?name=SA&background=d97706&color=fff', 1),
(10, 'Yoshi', 'yoshi.island@dino.net', '123', 'user', 'activo', '2024-04-01', 'https://ui-avatars.com/api/?name=Y&background=84cc16&color=fff', 1),
(11, 'Kirby', 'poyo@dreamland.st', '123', 'user', 'activo', '2024-03-22', 'https://ui-avatars.com/api/?name=K&background=db2777&color=fff', 1),
(12, 'Test', 'test@example.com', 'password123', 'admin', 'bloqueado', '2026-04-28', 'https://ui-avatars.com/api/?name=Verified&background=0D8ABC&color=fff', 0),
(13, 'Editor de Contenido', 'editor@nintendo.com', 'editor123', 'content_editor', 'activo', '2026-04-25', 'https://ui-avatars.com/api/?name=EC&background=f59e0b&color=fff', 0),
(14, 'Gestor de Juegos', 'manager@nintendo.com', 'manager123', 'game_manager', 'activo', '2026-04-25', 'https://ui-avatars.com/api/?name=GJ&background=10b981&color=fff', 0),
(15, 'Invitado', 'invitado@nintendo.com', 'Invitado123', 'user', 'activo', '2026-05-02', 'https://ui-avatars.com/api/?name=I&background=E60012&color=fff', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `aplicaciones`
--
ALTER TABLE `aplicaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_aplicaciones_plataforma` (`plataforma_id`);

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_usuario_juego` (`usuario_id`,`juego_id`),
  ADD KEY `fk_carrito_usuario` (`usuario_id`),
  ADD KEY `fk_carrito_juego` (`juego_id`);

--
-- Indices de la tabla `carrousel`
--
ALTER TABLE `carrousel`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `etiquetas`
--
ALTER TABLE `etiquetas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_nombre` (`nombre`);

--
-- Indices de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_usuario_juego` (`usuario_id`,`juego_id`),
  ADD KEY `fk_favoritos_usuario` (`usuario_id`),
  ADD KEY `fk_favoritos_juego` (`juego_id`);

--
-- Indices de la tabla `juegos`
--
ALTER TABLE `juegos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_juegos_plataforma` (`plataforma_id`);

--
-- Indices de la tabla `mynintendostore`
--
ALTER TABLE `mynintendostore`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_noticias_etiqueta` (`etiqueta_id`);

--
-- Indices de la tabla `novedades_principal`
--
ALTER TABLE `novedades_principal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_novprincipal_etiqueta` (`etiqueta_id`);

--
-- Indices de la tabla `novedades_secundarias`
--
ALTER TABLE `novedades_secundarias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_novsecundarias_etiqueta` (`etiqueta_id`);

--
-- Indices de la tabla `plataformas`
--
ALTER TABLE `plataformas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_nombre` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `aplicaciones`
--
ALTER TABLE `aplicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `carrousel`
--
ALTER TABLE `carrousel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `etiquetas`
--
ALTER TABLE `etiquetas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `juegos`
--
ALTER TABLE `juegos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `mynintendostore`
--
ALTER TABLE `mynintendostore`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `novedades_principal`
--
ALTER TABLE `novedades_principal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `novedades_secundarias`
--
ALTER TABLE `novedades_secundarias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `plataformas`
--
ALTER TABLE `plataformas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `aplicaciones`
--
ALTER TABLE `aplicaciones`
  ADD CONSTRAINT `fk_aplicaciones_plataforma` FOREIGN KEY (`plataforma_id`) REFERENCES `plataformas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `fk_carrito_juego` FOREIGN KEY (`juego_id`) REFERENCES `juegos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_carrito_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `fk_favoritos_juego` FOREIGN KEY (`juego_id`) REFERENCES `juegos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_favoritos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `juegos`
--
ALTER TABLE `juegos`
  ADD CONSTRAINT `fk_juegos_plataforma` FOREIGN KEY (`plataforma_id`) REFERENCES `plataformas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD CONSTRAINT `fk_noticias_etiqueta` FOREIGN KEY (`etiqueta_id`) REFERENCES `etiquetas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `novedades_principal`
--
ALTER TABLE `novedades_principal`
  ADD CONSTRAINT `fk_novprincipal_etiqueta` FOREIGN KEY (`etiqueta_id`) REFERENCES `etiquetas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `novedades_secundarias`
--
ALTER TABLE `novedades_secundarias`
  ADD CONSTRAINT `fk_novsecundarias_etiqueta` FOREIGN KEY (`etiqueta_id`) REFERENCES `etiquetas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
