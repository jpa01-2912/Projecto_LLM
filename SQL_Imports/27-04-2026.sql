-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 27-04-2026 a las 12:17:20
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
  `aplicacion` varchar(200) NOT NULL,
  `plataforma` varchar(100) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `aplicaciones`
--

INSERT INTO `aplicaciones` (`id`, `aplicacion`, `plataforma`, `fecha`, `imagen`) VALUES
(1, 'Nintendo Store', 'Dispositivos inteligentes', '2025-11-05', './fotos/aplicaciones/nintendo-store-app.jpg'),
(2, 'Nintendo Today!', 'Dispositivos inteligentes', '2025-10-27', './fotos/aplicaciones/nintendo-today.jpg'),
(3, 'Nintendo Music', 'Dispositivos inteligentes', '2024-10-31', './fotos/aplicaciones/nintendo-music.jpg'),
(4, 'Fire Emblem Shadows', 'Dispositivos inteligentes', '2025-09-25', './fotos/aplicaciones/fire-emblem.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrousel`
--

CREATE TABLE `carrousel` (
  `id` int(11) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `alt` varchar(100) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `boton_texto` varchar(100) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrousel`
--

INSERT INTO `carrousel` (`id`, `url`, `alt`, `titulo`, `boton_texto`, `link`) VALUES
(1, './fotos/Carrousel/mario-tennis.jpg', 'Mario Tennis Aces', 'Disponible 12-02', 'Nuevo tráiler', 'https://www.youtube.com/watch?v=example5'),
(2, './fotos/Carrousel/nintendo-direct.jpg', 'Nintendo Direct', '¡Ya lo podéis ver!', 'Seguidlo aquí', 'https://www.youtube.com/watch?v=example5'),
(3, './fotos/Carrousel/tomodachi-live.jpg', 'Tomodachi Life', NULL, NULL, NULL),
(4, './fotos/Carrousel/pokopia.jpg', 'Pokopia', '¡Se lanza el 05-03!', 'Reservas disponibles', 'https://www.youtube.com/watch?v=example5'),
(5, './fotos/Carrousel/animal-crossing.jpg', 'Cuarto juego', 'Disfruta como nunca la vida insular', '¡Ya disponible!', 'https://www.youtube.com/watch?v=example4');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `juegos`
--

CREATE TABLE `juegos` (
  `id` int(11) NOT NULL,
  `juego` varchar(200) NOT NULL,
  `plataforma` varchar(100) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `esNuevaConsola` tinyint(1) DEFAULT 0,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `juegos`
--

INSERT INTO `juegos` (`id`, `juego`, `plataforma`, `fecha`, `imagen`, `esNuevaConsola`, `precio`) VALUES
(1, 'RESIDENT EVIL Requiem', 'Nintendo Switch 2', '2026-02-27', './fotos/juegos/resident-evil-requiem.jpg', 1, 69.99),
(2, 'DRAGON QUEST VII Reimagined', 'Nintendo Switch 2', '2026-02-03', './fotos/juegos/dragon-quest.jpg', 1, 59.60),
(3, 'Monster Hunter Stories 3: Twisted Reflection', 'Nintendo Switch 2', '2026-03-13', './fotos/juegos/monster-hunte.jpg', 1, 50.60),
(4, 'Mario Kart World', 'Nintendo Switch 2', '2025-06-25', './fotos/juegos/mario-kart-world.jpg', 1, 49.90),
(5, 'FALLOUT 4 - ANIVERSARY EDITION', 'Nintendo Switch', '2026-02-24', './fotos/juegos/fallout-4.jpg', 0, 29.99),
(6, 'POKEMON FIRERED EDITION', 'Nintendo Switch', '2026-06-27', './fotos/juegos/pokemon-firered.jpg', 0, 4.99),
(7, 'POKEMON SCARLET', 'Nintendo Switch', '2026-02-27', './fotos/juegos/pokemon-scarlet.jpg', 0, 25.99),
(8, 'PERSONA 5 ROYAL', 'Nintendo Switch', '2026-02-27', './fotos/juegos/persona-5-royal.jpg', 0, 17.99),
(9, 'The legend of zelda - Breath of the wild', 'Nintendo Switch', '2017-03-03', './fotos/juegos/zelda_botw.jpg', 0, 69.99),
(10, 'HADES II', 'Nintendo Switch 2', '2025-09-25', './fotos/juegos/hades_2.jpg', 1, 29.99),
(11, 'MIITOPIA', 'Nintendo Switch 2', '2025-05-21', './fotos/juegos/miitopia.jpg', 1, 19.99),
(12, 'CELESTE', 'Nintendo Switch', '2026-02-27', './fotos/juegos/celeste.jpg', 0, 29.99);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mynintendostore`
--

CREATE TABLE `mynintendostore` (
  `id` int(11) NOT NULL,
  `aplicacion` varchar(200) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mynintendostore`
--

INSERT INTO `mynintendostore` (`id`, `aplicacion`, `descripcion`, `imagen`) VALUES
(1, 'Pokémon Pokopia', 'Ya disponible', './fotos/MyNintendoStore/pokopia.jpg'),
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
  `etiqueta` varchar(50) DEFAULT NULL,
  `fecha` varchar(20) DEFAULT NULL,
  `link` varchar(255) DEFAULT '#'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `noticias`
--

INSERT INTO `noticias` (`id`, `titulo`, `imagen`, `etiqueta`, `fecha`, `link`) VALUES
(1, 'Destacados de Nintendo eShop – 23-04-2026', './fotos/noticias/noticia1.jpg', 'Nintendo Switch', '23/04/2026', '#'),
(2, '¡Ponte al volante y sobrevive a toda costa en el próximo evento europeo en línea de Mario Kart...', './fotos/noticias/noticia2.jpg', 'Nintendo Switch 2', '21/04/2026', '#'),
(3, 'Cómo añadir a Bubbles y demás familia a tu isla de Tomodachi Life: Una vida de ensueño', './fotos/noticias/noticia3.jpg', 'Nintendo Switch', '17/04/2026', '#'),
(4, '¡Aquí están las reseñas de Tomodachi Life: Una vida de ensueño para Nintendo Switch!', './fotos/noticias/noticia4.jpg', '', '17/04/2026', '#'),
(5, 'Destacados de Nintendo eShop – 16-04-2026', './fotos/noticias/noticia5.jpg', 'Nintendo Switch', '16/04/2026', '#'),
(6, '¡Sorteamos el Cuento de Estela!', './fotos/noticias/noticia6.jpg', '', '15/04/2026', '#'),
(7, '¡Ya puedes reservar Yoshi and the Mysterious Book!', './fotos/noticias/noticia7.jpg', 'Nintendo Switch 2', '14/04/2026', '#'),
(8, 'Pregunta al desarrollador, volumen 21. Tomodachi Life: Una vida de ensueño – Capítulo 3', './fotos/noticias/noticia8.jpg', 'Nintendo Switch 2', '14/04/2026', '#');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `novedades_principal`
--

CREATE TABLE `novedades_principal` (
  `id` int(11) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `etiqueta` varchar(100) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `novedades_principal`
--

INSERT INTO `novedades_principal` (`id`, `imagen`, `etiqueta`, `titulo`, `descripcion`, `created_at`, `updated_at`) VALUES
(1, './fotos/Novedades/tomodachi-desarrolladores.jpg', 'Noticias', 'Pregunta al desarrollador, volumen 21. Tomodachi Life: Una vida de ensueño', '¡Descubre cómo los desarrolladores\nconcentraron en el juego nueve años\nrepletos de ideas!', '2026-04-27 08:21:57', '2026-04-27 08:21:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `novedades_secundarias`
--

CREATE TABLE `novedades_secundarias` (
  `id` int(11) NOT NULL,
  `orden` int(11) DEFAULT 0,
  `imagen` varchar(255) DEFAULT NULL,
  `etiqueta` varchar(100) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `novedades_secundarias`
--

INSERT INTO `novedades_secundarias` (`id`, `orden`, `imagen`, `etiqueta`, `titulo`, `created_at`, `updated_at`) VALUES
(1, NULL, './fotos/Novedades/human-fall-flat.jpg', 'Juegos', '¡Prueba Human: Fall Flat con los juegos de muestra!', '2026-04-27 08:21:57', '2026-04-27 08:21:57'),
(2, NULL, './fotos/Novedades/kirby-air-raider.jpg', 'Noticias', 'Kirby Air Riders: Reflexiones sobre el desarrollo', '2026-04-27 08:21:57', '2026-04-27 08:21:57'),
(3, NULL, './fotos/Novedades/rythm-paradise-groove.jpg', 'Juegos', 'Rhythm Paradise Groove dará el do de pecho el 2 de julio', '2026-04-27 08:21:57', '2026-04-27 08:21:57'),
(4, NULL, './fotos/Novedades/nso-nes.jpg', 'Juegos', '¡Disfruta de estos laberinticos juegos de NES con Nintendo Switch...', '2026-04-27 08:21:57', '2026-04-27 08:21:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(50) DEFAULT 'user',
  `estado` enum('activo','inactivo','bloqueado') DEFAULT 'activo',
  `fecha_registro` date DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `estado`, `fecha_registro`, `avatar`) VALUES
(1, 'Admin Principal', 'admin@nintendo.com', 'admin', 'admin', 'activo', '2023-01-15', 'https://i.pinimg.com/736x/14/20/fd/1420fdb2c1b84a55bc9a61e3050b0fa5.jpg'),
(2, 'Jairo', 'jairo@nintendo.com', '123', 'admin', 'activo', '2023-05-19', 'https://i.pinimg.com/736x/e5/b5/84/e5b5845fd3c0ae43eb58403f792e46e5.jpg'),
(3, 'Mario Bros', 'mario.jump@mushroom.kr', '123', 'user', 'activo', '2023-06-01', 'https://ui-avatars.com/api/?name=MB&background=dc2626&color=fff'),
(4, 'Luigi', 'luigi.ghost@mushroom.kr', '123', 'user', 'activo', '2023-06-02', 'https://ui-avatars.com/api/?name=L&background=16a34a&color=fff'),
(5, 'Zelda', 'princess.zelda@hyrule.gov', '123', 'user', 'activo', '2023-08-11', 'https://ui-avatars.com/api/?name=Z&background=ca8a04&color=fff'),
(6, 'Link', 'hero.time@hyrule.gov', '123', 'user', 'inactivo', '2023-08-11', 'https://ui-avatars.com/api/?name=L&background=059669&color=fff'),
(7, 'Bowser', 'king.koopa@darkland.com', 'password', 'user', 'bloqueado', '2024-01-05', 'https://ui-avatars.com/api/?name=B&background=ea580c&color=fff'),
(8, 'Samus Aran', 'samus.hunter@bounty.gal', '123', 'user', 'activo', '2024-02-15', 'https://ui-avatars.com/api/?name=SA&background=d97706&color=fff'),
(10, 'Yoshi', 'yoshi.island@dino.net', '123', 'user', 'activo', '2024-04-01', 'https://i.pinimg.com/736x/60/8c/05/608c0528880df190753f757c4a73507f.jpg'),
(11, 'Kirby', 'poyo@dreamland.st', '123', 'user', 'activo', '2024-03-22', 'https://ui-avatars.com/api/?name=K&background=db2777&color=fff'),
(12, 'Test', 'test@example.com', 'password123', 'user', 'activo', '2026-04-25', 'https://ui-avatars.com/api/?name=Verified&background=0D8ABC&color=fff'),
(13, 'Editor de Contenido', 'editor@nintendo.com', 'editor123', 'content_editor', 'activo', '2026-04-25', 'https://ui-avatars.com/api/?name=EC&background=f59e0b&color=fff'),
(14, 'Gestor de Juegos', 'manager@nintendo.com', 'manager123', 'game_manager', 'activo', '2026-04-25', 'https://ui-avatars.com/api/?name=GJ&background=10b981&color=fff');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `aplicaciones`
--
ALTER TABLE `aplicaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `carrousel`
--
ALTER TABLE `carrousel`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `juegos`
--
ALTER TABLE `juegos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mynintendostore`
--
ALTER TABLE `mynintendostore`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `novedades_principal`
--
ALTER TABLE `novedades_principal`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `novedades_secundarias`
--
ALTER TABLE `novedades_secundarias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `aplicaciones`
--
ALTER TABLE `aplicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `carrousel`
--
ALTER TABLE `carrousel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `juegos`
--
ALTER TABLE `juegos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
