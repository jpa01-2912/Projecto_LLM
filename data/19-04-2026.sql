-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 19-04-2026 a las 22:34:41
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
(1, 'Nintendo Store', 'Dispositivos inteligentes', '0000-00-00', './fotos/aplicaciones/nintendoStoreApp.jpg'),
(2, 'Nintendo Today!', 'Dispositivos inteligentes', '0000-00-00', './fotos/aplicaciones/nintendoToday.jpg'),
(3, 'Nintendo Music', 'Dispositivos inteligentes', '0000-00-00', './fotos/aplicaciones/nintendoMusic.jpg'),
(4, 'Fire Emblem Shadows', 'Dispositivos inteligentes', '0000-00-00', './fotos/aplicaciones/fireEmblem.jpg');

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
(1, './fotos/Carrousel/MarioTennis.jpg', 'Mario Tennis Aces', 'Disponible 12-02', 'Nuevo tráiler', 'https://www.youtube.com/watch?v=example5'),
(2, './fotos/Carrousel/nintendo-direct.jpg', 'Nintendo Direct', '¡Ya lo podéis ver!', 'Seguidlo aquí', 'https://www.youtube.com/watch?v=example5'),
(3, './fotos/Carrousel/TomodachiLive.jpg', 'Tomodachi Life', NULL, NULL, NULL),
(4, './fotos/Carrousel/Pokopia.jpg', 'Pokopia', '¡Se lanza el 05-03!', 'Reservas disponibles', 'https://www.youtube.com/watch?v=example5'),
(5, './fotos/Carrousel/animalcrossing.jpg', 'Cuarto juego', 'Disfruta como nunca la vida insular', '¡Ya disponible!', 'https://www.youtube.com/watch?v=example4');

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
(1, 'RESIDENT EVIL Requiem', 'Nintendo Switch 2', '0000-00-00', './fotos/juegos/ResidentEvilRequiem.jpg', 1, 69.80),
(2, 'DRAGON QUEST VII Reimagined', 'Nintendo Switch 2', '0000-00-00', './fotos/juegos/DragonQuest.jpg', 1, 59.60),
(3, 'Monster Hunter Stories 3: Twisted Reflection', 'Nintendo Switch 2', '0000-00-00', './fotos/juegos/MonsterHunte.jpg', 1, 50.60),
(4, 'Mario Kart World', 'Nintendo Switch 2', '0000-00-00', './fotos/juegos/MarioKartWorld.jpg', 1, 49.90);

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
(1, 'Pokémon Pokopia', 'Ya disponible', './fotos/MyNintendoStore/Pokopia.jpg'),
(2, 'Artículos exclusivos de Animal Crossing', 'Ver el catálogo', './fotos/MyNintendoStore/ACNH_COLLECTION_LOGO.jpg'),
(3, 'Tomodachi Life: Una vida de ensueño', '16-04-2026', './fotos/MyNintendoStore/TomodachiLifeLTD.jpg'),
(4, 'Camisetas de Super Mario Bros. 40th', 'Ya disponibles', './fotos/MyNintendoStore/SuperMarioBros40thTShirt.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `novedades`
--

CREATE TABLE `novedades` (
  `id` int(11) NOT NULL DEFAULT 1,
  `principal` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`principal`)),
  `secundarias` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`secundarias`)),
  `otrasNoticias` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`otrasNoticias`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `novedades`
--

INSERT INTO `novedades` (`id`, `principal`, `secundarias`, `otrasNoticias`) VALUES
(1, '{\"imagen\":\"./fotos/Novedades/tomodachi_desarrolladores.jpg\",\"etiqueta\":\"Noticias\",\"titulo\":\"Pregunta al desarrollador, volumen 21. Tomodachi Life: Una vida de ensueño\",\"descripcion\":\"¡Descubre cómo los desarrolladores\\nconcentraron en el juego nueve años\\nrepletos de ideas!\"}', '[{\"imagen\":\"./fotos/Novedades/HumanFallFlat.jpg\",\"etiqueta\":\"Juegos\",\"titulo\":\"¡Prueba Human: Fall Flat con los juegos de muestra!\"},{\"imagen\":\"./fotos/Novedades/kirby_air_raider.jpg\",\"etiqueta\":\"Noticias\",\"titulo\":\"Kirby Air Riders: Reflexiones sobre el desarrollo\"},{\"imagen\":\"./fotos/Novedades/RythmParadiseGroove.jpg\",\"etiqueta\":\"Juegos\",\"titulo\":\"Rhythm Paradise Groove dará el do de pecho el 2 de julio\"},{\"imagen\":\"./fotos/Novedades/NSO_NES.jpg\",\"etiqueta\":\"Juegos\",\"titulo\":\"¡Disfruta de estos laberinticos juegos de NES con Nintendo Switch...\"}]', '[]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','user') DEFAULT 'user',
  `estado` enum('activo','inactivo','bloqueado') DEFAULT 'activo',
  `fecha_registro` date DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `estado`, `fecha_registro`, `avatar`) VALUES
(1, 'Admin Principal', 'admin@nintendo.com', 'admin', 'admin', 'activo', '2023-01-15', 'https://ui-avatars.com/api/?name=Admin&background=E60012&color=fff'),
(2, 'Jairo', 'jairo@nintendo.com', '123', 'admin', 'activo', '2023-05-20', 'https://ui-avatars.com/api/?name=J&background=0284c7&color=fff'),
(3, 'Mario Bros', 'mario.jump@mushroom.kr', '123', 'user', 'activo', '2023-06-01', 'https://ui-avatars.com/api/?name=MB&background=dc2626&color=fff'),
(4, 'Luigi', 'luigi.ghost@mushroom.kr', '123', 'user', 'activo', '2023-06-02', 'https://ui-avatars.com/api/?name=L&background=16a34a&color=fff'),
(5, 'Zelda', 'princess.zelda@hyrule.gov', '123', 'user', 'activo', '2023-08-11', 'https://ui-avatars.com/api/?name=Z&background=ca8a04&color=fff'),
(6, 'Link', 'hero.time@hyrule.gov', '123', 'user', 'inactivo', '2023-08-11', 'https://ui-avatars.com/api/?name=L&background=059669&color=fff'),
(7, 'Bowser', 'king.koopa@darkland.com', 'password', 'user', 'bloqueado', '2024-01-05', 'https://ui-avatars.com/api/?name=B&background=ea580c&color=fff'),
(8, 'Samus Aran', 'samus.hunter@bounty.gal', '123', 'user', 'activo', '2024-02-15', 'https://ui-avatars.com/api/?name=SA&background=d97706&color=fff'),
(10, 'Yoshi', 'yoshi.island@dino.net', '123', 'user', 'activo', '2024-04-01', 'https://ui-avatars.com/api/?name=Y&background=84cc16&color=fff'),
(11, 'Kirby', 'poyo@dreamland.st', '123', 'user', 'activo', '2024-03-22', 'https://ui-avatars.com/api/?name=K&background=db2777&color=fff');

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
-- Indices de la tabla `novedades`
--
ALTER TABLE `novedades`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `mynintendostore`
--
ALTER TABLE `mynintendostore`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
