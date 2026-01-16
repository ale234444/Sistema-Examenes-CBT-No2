-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 15-01-2026 a las 22:53:42
-- Versión del servidor: 8.0.17
-- Versión de PHP: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistemma_examenes`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `answers`
--

CREATE TABLE `answers` (
  `id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `exam_id` bigint(20) NOT NULL,
  `question_id` bigint(20) NOT NULL,
  `answer` text NOT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `answers`
--

INSERT INTO `answers` (`id`, `student_id`, `exam_id`, `question_id`, `answer`, `is_correct`, `created_at`) VALUES
(0, 15, 9, 24, 'algo', 0, '2025-11-10 04:17:58'),
(0, 15, 12, 32, 'nombres', 1, '2025-11-10 07:40:20'),
(0, 15, 12, 33, 'Falso', 1, '2025-11-10 07:40:20'),
(0, 15, 4, 1, 'Verdadero', 0, '2025-11-10 07:43:50'),
(0, 15, 4, 2, 'Verdadero', 0, '2025-11-10 07:43:50'),
(0, 15, 4, 20, 'aa', 0, '2025-11-10 07:43:50'),
(0, 15, 13, 34, 'Verdadero', 0, '2025-11-10 08:04:45'),
(0, 15, 13, 35, 'Q', 0, '2025-11-10 08:04:45'),
(0, 15, 13, 36, 'SQL', 1, '2025-11-10 08:04:45'),
(0, 15, 13, 37, 'Verdadero', 0, '2025-11-10 08:04:45'),
(0, 15, 14, 38, 'CODIGO', 1, '2025-11-10 08:06:50'),
(0, 15, 14, 39, 'Falso', 0, '2025-11-10 08:06:50'),
(0, 15, 15, 40, 'lengua', 0, '2025-11-10 08:13:47'),
(0, 15, 15, 41, 'Verdadero', 1, '2025-11-10 08:13:47'),
(0, 15, 15, 42, 'Falso', 0, '2025-11-10 08:13:47'),
(0, 15, 16, 43, 'no se ', 0, '2025-11-10 08:20:34'),
(0, 15, 16, 44, 'Falso', 0, '2025-11-10 08:20:34'),
(0, 15, 16, 45, 'Verdadero', 1, '2025-11-10 08:20:34'),
(0, 15, 18, 49, 'no se ', 0, '2025-11-10 14:27:03'),
(0, 15, 18, 50, 'Verdadero', 1, '2025-11-10 14:27:03'),
(0, 15, 18, 51, 'Verdadero', 1, '2025-11-10 14:27:03'),
(0, 15, 19, 52, 'Su rechazo total a la ciencia.', 0, '2025-11-10 14:42:29'),
(0, 15, 19, 53, 'Física.', 0, '2025-11-10 14:42:29'),
(0, 15, 19, 54, 'Virtud.', 0, '2025-11-10 14:42:29'),
(0, 15, 19, 55, 'El Príncipe', 0, '2025-11-10 14:42:29'),
(0, 15, 19, 56, 'Verdadero', 1, '2025-11-10 14:42:29'),
(0, 15, 19, 57, 'Verdadero', 1, '2025-11-10 14:42:29'),
(0, 18, 21, 62, 'nn', 1, '2025-11-10 19:14:29'),
(0, 18, 21, 63, 'Falso', 0, '2025-11-10 19:14:29'),
(0, 18, 21, 65, 'si', 1, '2025-11-10 19:14:29'),
(0, 18, 21, 66, 'cristobal colon', 0, '2025-11-10 19:14:29'),
(0, 18, 22, 67, 'Solo el uso de redes sociales.', 0, '2025-11-11 01:02:00'),
(0, 18, 22, 68, 'Monitor', 1, '2025-11-11 01:02:00'),
(0, 18, 22, 69, 'Falso', 1, '2025-11-11 01:02:00'),
(0, 18, 22, 70, 'Falso', 0, '2025-11-11 01:02:00'),
(0, 18, 22, 71, '{\"0\":\"Programa que controla los recursos del sistema\",\"1\":\"Elementos físicos del equipo de cómputo\",\"2\":\"Programa que permite interactuar con el hardware\",\"3\":\"Red global que conecta computadoras en todo el mundo\",\"4\":\"Aplicación usada para acceder a sitios web\"}', 0, '2025-11-11 01:02:00'),
(0, 18, 24, 73, 'Falso', 1, '2025-11-11 01:28:49'),
(0, 18, 27, 79, 'Falso', 0, '2025-11-11 02:59:45'),
(0, 18, 28, 80, 'Verdadero', 0, '2025-11-11 03:48:26'),
(0, 18, 28, 81, 'Verdadero', 1, '2025-11-11 03:48:27'),
(0, 18, 29, 82, 'Verdadero', 1, '2025-11-11 04:54:55'),
(0, 18, 29, 83, 'Verdadero', 0, '2025-11-11 04:54:55'),
(0, 19, 30, 84, 'La capacidad de imponer órdenes.', 0, '2025-11-11 06:37:50'),
(0, 19, 30, 85, 'Delegar y promover la participación del equipo.', 1, '2025-11-11 06:37:50'),
(0, 19, 30, 86, 'Escuchar las opiniones del grupo.', 0, '2025-11-11 06:37:50'),
(0, 19, 30, 87, 'Inseguridad.', 0, '2025-11-11 06:37:50'),
(0, 19, 30, 88, 'Manejar adecuadamente las emociones propias y las de los demás.', 1, '2025-11-11 06:37:50'),
(0, 19, 30, 89, 'Falso', 1, '2025-11-11 06:37:50'),
(0, 19, 30, 90, 'Falso', 0, '2025-11-11 06:37:50'),
(0, 19, 30, 91, 'Falso', 0, '2025-11-11 06:37:50'),
(0, 19, 30, 92, 'Falso', 0, '2025-11-11 06:37:51'),
(0, 19, 30, 93, 'Falso', 1, '2025-11-11 06:37:51'),
(0, 18, 30, 84, 'La habilidad para influir positivamente en otras personas para alcanzar metas comunes.', 1, '2025-11-11 06:42:03'),
(0, 18, 30, 85, 'Delegar y promover la participación del equipo.', 1, '2025-11-11 06:42:03'),
(0, 18, 30, 86, 'Controlar y tomar decisiones sin participación.', 1, '2025-11-11 06:42:03'),
(0, 18, 30, 87, 'Inseguridad.', 0, '2025-11-11 06:42:03'),
(0, 18, 30, 88, 'Manejar adecuadamente las emociones propias y las de los demás.', 1, '2025-11-11 06:42:03'),
(0, 18, 30, 89, 'Falso', 1, '2025-11-11 06:42:03'),
(0, 18, 30, 90, 'Verdadero', 1, '2025-11-11 06:42:03'),
(0, 18, 30, 91, 'Verdadero', 1, '2025-11-11 06:42:03'),
(0, 18, 30, 92, 'Verdadero', 1, '2025-11-11 06:42:03'),
(0, 18, 30, 93, 'Falso', 1, '2025-11-11 06:42:03'),
(0, 18, 32, 94, 'La capacidad de una persona o empresa para obtener dinero a cambio de una promesa de pago futuro.', 0, '2025-11-11 15:48:47'),
(0, 18, 32, 95, 'El monto original del préstamo', 0, '2025-11-11 15:48:47'),
(0, 18, 32, 96, 'Crédito hipotecario.', 0, '2025-11-11 15:48:47'),
(0, 18, 32, 97, 'Comprar alimentos', 0, '2025-11-11 15:48:47'),
(0, 18, 32, 98, 'Siempre obligatorio.', 0, '2025-11-11 15:48:47'),
(0, 18, 32, 99, 'Verdadero', 1, '2025-11-11 15:48:47'),
(0, 18, 32, 100, 'Falso', 0, '2025-11-11 15:48:47'),
(0, 18, 32, 101, 'Verdadero', 0, '2025-11-11 15:48:47'),
(0, 18, 32, 102, 'Verdadero', 1, '2025-11-11 15:48:47'),
(0, 18, 32, 103, 'Falso', 1, '2025-11-11 15:48:47'),
(0, 20, 32, 94, 'La obligación de pagar un préstamo de inmediato', 0, '2025-11-11 16:35:03'),
(0, 20, 32, 95, 'El porcentaje adicional que se paga por el uso del dinero prestado', 0, '2025-11-11 16:35:03'),
(0, 20, 32, 96, 'Crédito hipotecario.', 0, '2025-11-11 16:35:03'),
(0, 20, 32, 97, 'Comprar o construir una vivienda', 0, '2025-11-11 16:35:03'),
(0, 20, 32, 98, 'Opcional, dependiendo de la institución y el monto', 0, '2025-11-11 16:35:03'),
(0, 20, 32, 99, 'Verdadero', 1, '2025-11-11 16:35:04'),
(0, 20, 32, 100, 'Falso', 0, '2025-11-11 16:35:04'),
(0, 20, 32, 101, 'Verdadero', 0, '2025-11-11 16:35:04'),
(0, 20, 32, 102, 'Verdadero', 1, '2025-11-11 16:35:04'),
(0, 20, 32, 103, 'Verdadero', 0, '2025-11-11 16:35:04'),
(0, 20, 33, 104, 'Verdadero', 1, '2025-11-11 16:47:47'),
(0, 20, 34, 107, 'Verdadero', 1, '2025-11-11 20:54:24'),
(0, 21, 34, 107, 'Verdadero', 1, '2025-11-12 00:30:23'),
(0, 21, 32, 94, 'La capacidad de una persona o empresa para obtener dinero a cambio de una promesa de pago futuro.', 0, '2025-11-12 00:30:56'),
(0, 21, 32, 95, 'El pago mensual fijo', 0, '2025-11-12 00:30:56'),
(0, 21, 32, 96, 'Crédito de consumo', 0, '2025-11-12 00:30:56'),
(0, 21, 32, 97, 'Comprar o construir una vivienda', 0, '2025-11-12 00:30:56'),
(0, 21, 32, 98, 'Siempre obligatorio.', 0, '2025-11-12 00:30:56'),
(0, 21, 32, 99, 'Verdadero', 1, '2025-11-12 00:30:56'),
(0, 21, 32, 100, 'Verdadero', 1, '2025-11-12 00:30:56'),
(0, 21, 32, 101, 'Verdadero', 0, '2025-11-12 00:30:56'),
(0, 21, 32, 103, 'Verdadero', 0, '2025-11-12 00:30:56'),
(0, 21, 25, 77, 'Verdadero', 1, '2025-11-12 00:46:07'),
(0, 21, 33, 105, 'Verdadero', 1, '2025-11-12 00:57:42'),
(0, 21, 33, 106, 'Falso', 0, '2025-11-12 00:57:43'),
(0, 18, 35, 108, 'Verdadero', 0, '2025-11-12 16:36:36'),
(0, 22, 25, 74, 'Solo fórmulas trigonométricas.', 1, '2025-11-15 04:57:42'),
(0, 22, 25, 75, '5', 0, '2025-11-15 04:57:42'),
(0, 22, 25, 76, 'Verdadero', 0, '2025-11-15 04:57:42'),
(0, 22, 25, 77, 'Verdadero', 1, '2025-11-15 04:57:42'),
(0, 22, 25, 78, '{\"0\":\"Ax+By+C=0\",\"1\":\"Ecuación de una circunferencia con centro y radio\",\"2\":\"Ecuación de una circunferencia con centro y radio\",\"3\":\"Ax+By+C=0\",\"4\":\"( 𝑥 1 + 𝑥 2 2 , 𝑦 1 + 𝑦 2 2 ) ( 2 x 1 \\t​  +x 2 \\t​  \\t​  , 2 y 1 \\t​  +y 2 \\t​  \\t​  )\"}', 0, '2025-11-15 04:57:42'),
(0, 22, 39, 111, 'gvbhn', 1, '2025-11-15 05:37:06'),
(0, 22, 39, 112, 'Falso', 1, '2025-11-15 05:37:06'),
(0, 18, 33, 104, 'Verdadero', 1, '2025-11-18 20:18:47'),
(0, 18, 33, 105, 'Verdadero', 1, '2025-11-18 20:18:47'),
(0, 18, 33, 106, 'Verdadero', 1, '2025-11-18 20:18:47'),
(0, 18, 45, 131, 'Verdadero', 0, '2025-11-24 15:04:13'),
(0, 26, 54, 148, 'no se ', 0, '2025-11-24 16:07:47'),
(0, 26, 54, 149, 'Verdadero', 1, '2025-11-24 16:07:47'),
(0, 28, 52, 143, 'Verdadero', 0, '2025-11-25 02:39:35'),
(0, 28, 52, 144, 'Verdadero', 0, '2025-11-25 02:39:35'),
(0, 28, 52, 145, 'Verdadero', 0, '2025-11-25 02:39:35'),
(0, 28, 49, 144, 'Verdadero', 0, '2025-11-25 02:39:45'),
(0, 28, 49, 145, 'Verdadero', 0, '2025-11-25 02:39:45'),
(0, 29, 22, 67, 'La cultura tradicional en formato electrónico', 0, '2025-11-27 17:06:25'),
(0, 29, 22, 68, 'Monitor', 1, '2025-11-27 17:06:25'),
(0, 29, 22, 69, 'Verdadero', 0, '2025-11-27 17:06:25'),
(0, 29, 22, 70, 'Verdadero', 1, '2025-11-27 17:06:25'),
(0, 29, 22, 71, '{\"0\":\"Programa que controla los recursos del sistema\",\"1\":\"Programa que controla los recursos del sistema\",\"2\":\"Programa que controla los recursos del sistema\",\"3\":\"Elementos físicos del equipo de cómputo\",\"4\":\"Programa que controla los recursos del sistema\"}', 0, '2025-11-27 17:06:25'),
(0, 44, 49, 144, 'Verdadero', 0, '2025-11-29 01:44:36'),
(0, 44, 49, 145, 'Verdadero', 0, '2025-11-29 01:44:36'),
(0, 44, 103, 163, 'Verdadero', 1, '2025-11-29 01:44:56'),
(0, 44, 52, 143, 'Verdadero', 0, '2025-11-29 01:47:56'),
(0, 44, 52, 144, 'Falso', 1, '2025-11-29 01:47:56'),
(0, 44, 52, 145, 'Verdadero', 0, '2025-11-29 01:47:56'),
(0, 45, 101, 162, 'SQL', 1, '2025-11-29 01:48:45'),
(0, 45, 52, 143, 'Falso', 1, '2025-11-29 01:49:13'),
(0, 45, 52, 144, 'Falso', 1, '2025-11-29 01:49:13'),
(0, 45, 52, 145, 'Falso', 1, '2025-11-29 01:49:13'),
(0, 45, 100, 162, 'SQL', 1, '2025-11-29 01:49:45'),
(0, 18, 107, 177, 'Verdadero', 1, '2025-12-03 16:17:39'),
(0, 18, 96, 175, 'NO SE ALGO', 0, '2025-12-03 16:18:00'),
(0, 18, 96, 176, 'm', 0, '2025-12-03 16:18:00'),
(0, 18, 108, 178, 'OPCION 1', 0, '2025-12-05 15:06:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `exams`
--

CREATE TABLE `exams` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text,
  `teacher_id` int(11) NOT NULL,
  `grade_id` varchar(20) DEFAULT NULL,
  `group_id` varchar(50) DEFAULT NULL,
  `career` varchar(100) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT '1',
  `publish_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `resource_path` varchar(255) DEFAULT NULL,
  `time_limit` int(11) DEFAULT NULL,
  `is_enabled` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `exams`
--

INSERT INTO `exams` (`id`, `titulo`, `descripcion`, `teacher_id`, `grade_id`, `group_id`, `career`, `enabled`, `publish_date`, `resource_path`, `time_limit`, `is_enabled`) VALUES
(50, 'BB', 'BB', 13, '2', '1', NULL, 1, '2025-11-23 22:53:37', NULL, 10, 0),
(54, 'Literatura ', 'dibujo ', 25, '2', '1', NULL, 1, '2025-11-24 15:16:35', NULL, 10, 1),
(55, 'Ciencias Sociales ', 'átomos ', 25, '2', '1', NULL, 1, '2025-11-24 16:29:31', NULL, 10, 0),
(96, 'CONTABILIDAD ', 'Q', 2, '1', '1', 'Administración', 1, '2025-11-29 00:51:45', NULL, 20, 0),
(97, 'PROGRAMACION', 'Q', 2, '1', '1', 'Informática', 1, '2025-11-29 00:52:36', NULL, 10, 0),
(98, 'CODIGO', 'HUH', 2, '1', '1', 'Informática', 1, '2025-11-29 01:03:25', NULL, 9, 1),
(100, 'Sentencias SQL', 'SQL', 46, '2', '2', 'Informática', 1, '2025-11-29 01:24:01', NULL, 20, 0),
(101, 'Casos de uso', 'Recuadros', 46, '2', '2', 'Informática', 1, '2025-11-29 01:24:52', NULL, 20, 0),
(102, 'Empresas ', 'venta', 46, '2', '2', 'Administración', 1, '2025-11-29 01:38:26', NULL, 10, 0),
(103, 'Ingresos', 'dinero', 46, '2', '2', 'Administración', 1, '2025-11-29 01:38:51', NULL, 10, 0),
(104, 'Programacion', 'objeto', 46, '2', '2', 'Informática', 1, '2025-11-29 02:40:13', NULL, 20, 0),
(105, 'Paginas web', 'servicios ', 46, '2', '2', 'Informática', 1, '2025-12-01 00:24:49', NULL, 10, 0),
(106, 'PROGRMACION MOVIL', 'HGB', 2, '2', '2', 'Informática', 1, '2025-12-01 02:21:40', NULL, 10, 1),
(107, 'mm', 'mm', 2, '1', '1', 'Administración', 1, '2025-12-03 16:17:01', NULL, 200, 1),
(108, 'CIECIAS SOCIALES', 'PRUEBA', 48, '1', '1', 'Administración', 1, '2025-12-05 14:57:05', NULL, 20, 1),
(109, 'Matemática ', 'números ', 32, '1', '2', 'Administración', 1, '2026-01-07 03:36:06', NULL, 20, 0),
(110, 'Español', 'cuentos ', 32, '1', '1', 'Administración', 1, '2026-01-07 03:36:47', NULL, 20, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `exam_questions`
--

CREATE TABLE `exam_questions` (
  `id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `question_order` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `exam_questions`
--

INSERT INTO `exam_questions` (`id`, `exam_id`, `question_id`, `created_at`, `question_order`) VALUES
(1, 1, 38, '2025-11-21 05:55:07', 0),
(2, 1, 39, '2025-11-21 05:55:07', 0),
(3, 15, 40, '2025-11-21 17:07:55', 1),
(4, 32, 94, '2025-11-21 17:08:26', 1),
(5, 15, 41, '2025-11-21 18:39:50', 2),
(6, 16, 44, '2025-11-21 18:40:14', 1),
(7, 32, 97, '2025-11-21 18:49:54', 2),
(8, 14, 38, '2025-11-21 18:58:56', 1),
(9, 15, 42, '2025-11-21 22:37:08', 3),
(10, 14, 39, '2025-11-21 22:37:49', 2),
(11, 16, 43, '2025-11-21 22:52:27', 2),
(12, 18, 51, '2025-11-21 23:00:25', 1),
(13, 48, 130, '2025-11-21 23:03:09', 1),
(14, 16, 45, '2025-11-22 01:02:56', 3),
(15, 44, 119, '2025-11-22 01:12:50', 1),
(16, 44, 118, '2025-11-22 01:13:07', 2),
(17, 45, 131, '2025-11-22 01:18:13', 1),
(18, 32, 100, '2025-11-22 01:24:24', 3),
(19, 32, 101, '2025-11-22 01:24:28', 4),
(20, 32, 96, '2025-11-22 01:35:23', 5),
(21, 32, 95, '2025-11-22 05:24:24', 6),
(22, 44, 133, '2025-11-22 05:50:47', 3),
(23, 47, 135, '2025-11-22 06:06:07', 1),
(24, 47, 122, '2025-11-22 06:07:22', 2),
(25, 33, 104, '2025-11-22 06:10:18', 1),
(26, 33, 106, '2025-11-22 06:21:24', 2),
(27, 33, 105, '2025-11-22 06:21:39', 3),
(28, 50, 136, '2025-11-23 22:54:15', 1),
(29, 50, 137, '2025-11-23 22:59:25', 2),
(30, 50, 138, '2025-11-23 23:03:05', 3),
(31, 50, 139, '2025-11-23 23:17:53', 4),
(32, 50, 140, '2025-11-23 23:27:53', 5),
(33, 50, 141, '2025-11-23 23:42:05', 6),
(34, 50, 142, '2025-11-23 23:47:52', 7),
(35, 52, 143, '2025-11-24 00:38:27', 1),
(36, 52, 144, '2025-11-24 00:47:58', 2),
(37, 49, 145, '2025-11-24 03:05:20', 1),
(38, 49, 144, '2025-11-24 03:05:44', 2),
(39, 49, 140, '2025-11-24 03:10:24', 3),
(40, 49, 141, '2025-11-24 03:12:45', 4),
(41, 55, 148, '2025-11-24 19:32:01', 1),
(42, 54, 150, '2025-11-24 19:32:30', 1),
(43, 55, 149, '2025-11-25 00:22:28', 2),
(44, 55, 150, '2025-11-25 00:51:03', 3),
(45, 43, 105, '2025-11-25 01:26:07', 1),
(46, 43, 106, '2025-11-25 01:52:22', 2),
(47, 43, 104, '2025-11-25 01:55:40', 3),
(48, 53, 43, '2025-11-27 00:54:31', 1),
(49, 53, 41, '2025-11-27 02:02:16', 2),
(50, 53, 104, '2025-11-27 02:02:29', 3),
(51, 57, 155, '2025-11-27 14:51:14', 1),
(52, 101, 162, '2025-11-29 01:37:57', 1),
(53, 98, 173, '2025-12-01 02:41:17', 1),
(54, 98, 174, '2025-12-01 02:41:41', 2),
(55, 106, 173, '2025-12-01 14:12:58', 1),
(56, 106, 160, '2025-12-01 14:53:05', 2),
(57, 107, 173, '2025-12-05 14:57:40', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `texto` varchar(255) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `opciones` text,
  `correcta` text,
  `metadata` text,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `questions`
--

INSERT INTO `questions` (`id`, `exam_id`, `texto`, `tipo`, `opciones`, `correcta`, `metadata`, `image_url`, `created_at`) VALUES
(136, 50, 'QQQQ', 'falso_verdadero', '[]', '[\"Falso\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', NULL, '2025-11-23 22:53:50'),
(137, 50, 'AAA', 'multiple', '[]', '[\"B\"]', '{\"opciones\":[\"Q\",\"B\"]}', NULL, '2025-11-23 22:54:03'),
(138, 50, 'CC', 'falso_verdadero', '[]', '[\"Falso\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', NULL, '2025-11-23 23:02:57'),
(139, 50, 'IIII', 'falso_verdadero', '[]', '[\"Falso\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', NULL, '2025-11-23 23:17:43'),
(142, 50, 'LLLL', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', NULL, '2025-11-23 23:47:40'),
(148, 54, 'que es', 'multiple', '[]', '[\"algo\"]', '{\"opciones\":[\"no se \",\"algo\"]}', 'http://localhost/sistemaexamenescbtn2_ready/backend/uploads/questions/question_692476facb861_descarga (1).jfif', '2025-11-24 15:17:14'),
(149, 54, 'es verdad', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', NULL, '2025-11-24 15:17:28'),
(150, 55, 'qwesxfctgvhbj1', 'falso_verdadero', '[]', '[\"\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', NULL, '2025-11-24 16:29:48'),
(151, 55, 'qwerty', 'falso_verdadero', '[]', '[\"Falso\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', NULL, '2025-11-24 16:29:59'),
(152, 55, 'FCGVHBJN', 'falso_verdadero', '[]', '[\"\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', 'http://localhost/sistemaexamenescbtn2_ready/backend/uploads/questions/question_692512311f0e0_Captura5.PNG', '2025-11-25 02:19:29'),
(160, 98, 'EDRCTFRVGYBH', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', 'http://localhost/sistemaexamenescbtn2_ready/backend/uploads/questions/question_692a466f4c920_descarga (1).png', '2025-11-29 01:03:43'),
(162, 100, 'QUE ES', 'multiple', '[]', '[\"SQL\"]', '{\"opciones\":[\"SQL\",\"SENTENCIAS \"]}', NULL, '2025-11-29 01:24:22'),
(163, 103, 'bhnj', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', NULL, '2025-11-29 01:39:01'),
(164, 104, 'b nm m', 'falso_verdadero', '[]', '[\"Falso\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', 'http://localhost/sistemaexamenescbtn2_ready/backend/uploads/questions/question_692a5d2cdb4f5_1.1.png', '2025-11-29 02:40:44'),
(165, 104, 'cdfvgbhn', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', 'http://localhost/sistemaexamenescbtn2_ready/backend/uploads/questions/question_692a607143779_IMG-20240616-WA0004.jpg', '2025-11-29 02:54:41'),
(166, 104, 'fgvbhn', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', 'http://localhost/sistemaexamenescbtn2_ready/backend/uploads/questions/question_692a618ac0f9a_IMG-20240617-WA0010.jpg', '2025-11-29 02:59:22'),
(167, 104, 'HB', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', NULL, '2025-11-29 03:13:02'),
(168, 104, 'hbhb', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', 'http://localhost/sistemaexamenescbtn2_ready/backend/uploads/questions/question_692a68465442b_IMG-20240617-WA0015.jpg', '2025-11-29 03:28:06'),
(169, 105, 'ggg', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', 'http://192.168.1.94/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/uploads/questions/question_692ce06b06c42_431202782_7683293748453812_5725038030837257019_n.jpg', '2025-12-01 00:25:15'),
(170, 105, 'bgg', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', 'http://192.168.1.94/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/uploads/questions/question_692ce386ed189_1550463139493.jpg', '2025-12-01 00:38:30'),
(171, 105, 'dfcgvhb', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', 'http://192.168.1.94/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/uploads/questions/question_692ce6f201133.png', '2025-12-01 00:53:06'),
(172, 105, 'aaaaaaaaaaaaaa', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', 'http://192.168.1.94/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/uploads/questions/question_692ce9b93624a.png', '2025-12-01 01:04:57'),
(173, 106, 'NJN', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', 'http://192.168.1.94/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/uploads/questions/question_692cfbc47098f.jpg', '2025-12-01 02:21:56'),
(174, 106, 'JNJ', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', 'http://192.168.1.94/sistemaexamenescbtn2_ready1/sistemaexamenescbtn2_ready/uploads/questions/question_692cfe57d8d1c.jpg', '2025-12-01 02:32:55'),
(175, 96, 'QUES CONTABILIDAD', 'multiple', '[]', '[\"TALVEZ \"]', '{\"opciones\":[\"NO SE ALGO\",\"TALVEZ \"]}', NULL, '2025-12-02 19:49:07'),
(176, 96, 'Características de contabilidad', 'multiple', '[]', '[\"n\"]', '{\"opciones\":[\"m\",\"n\"]}', NULL, '2025-12-02 19:49:42'),
(177, 107, 'jjj', 'falso_verdadero', '[]', '[\"Verdadero\"]', '{\"opciones\":[\"Verdadero\",\"Falso\"]}', NULL, '2025-12-03 16:17:12'),
(178, 108, 'QUE SON LAS CIENCIAS SOCIALES', 'multiple', '[]', '[\"OPCION 2\"]', '{\"opciones\":[\"OPCION 1\",\"OPCION 2\",\"OPCION 3\"]}', NULL, '2025-12-05 15:04:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `results`
--

CREATE TABLE `results` (
  `id` bigint(20) NOT NULL,
  `answers` varchar(255) DEFAULT NULL,
  `exam_id` bigint(20) DEFAULT NULL,
  `score` int(11) NOT NULL,
  `student_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `results`
--

INSERT INTO `results` (`id`, `answers`, `exam_id`, `score`, `student_id`) VALUES
(0, '[{\"question_id\":\"24\",\"answer\":\"algo\"}]', 9, 0, 15),
(0, '[{\"question_id\":\"32\",\"answer\":\"nombres\"},{\"question_id\":\"33\",\"answer\":\"Falso\"}]', 12, 100, 15),
(0, '[{\"question_id\":\"1\",\"answer\":\"Verdadero\"},{\"question_id\":\"2\",\"answer\":\"Verdadero\"},{\"question_id\":\"20\",\"answer\":\"aa\"}]', 4, 0, 15),
(0, '[{\"question_id\":\"34\",\"answer\":\"Verdadero\"},{\"question_id\":\"35\",\"answer\":\"Q\"},{\"question_id\":\"36\",\"answer\":\"SQL\"},{\"question_id\":\"37\",\"answer\":\"Verdadero\"}]', 13, 25, 15),
(0, '[{\"question_id\":\"38\",\"answer\":\"CODIGO\"},{\"question_id\":\"39\",\"answer\":\"Falso\"}]', 14, 50, 15),
(0, '[{\"question_id\":\"40\",\"answer\":\"lengua\"},{\"question_id\":\"41\",\"answer\":\"Verdadero\"},{\"question_id\":\"42\",\"answer\":\"Falso\"}]', 15, 33, 15),
(0, '[{\"question_id\":\"43\",\"answer\":\"no se \"},{\"question_id\":\"44\",\"answer\":\"Falso\"},{\"question_id\":\"45\",\"answer\":\"Verdadero\"}]', 16, 33, 15),
(0, '[{\"question_id\":\"49\",\"answer\":\"no se \"},{\"question_id\":\"50\",\"answer\":\"Verdadero\"},{\"question_id\":\"51\",\"answer\":\"Verdadero\"}]', 18, 67, 15),
(0, '[{\"question_id\":\"52\",\"answer\":\"Su rechazo total a la ciencia.\"},{\"question_id\":\"53\",\"answer\":\"F\\u00edsica.\"},{\"question_id\":\"54\",\"answer\":\"Virtud.\"},{\"question_id\":\"55\",\"answer\":\"El Pr\\u00edncipe\"},{\"question_id\":\"56\",\"answer\":\"Verdadero\"},{\"question_id\":', 19, 33, 15),
(0, '[{\"question_id\":\"62\",\"answer\":\"nn\"},{\"question_id\":\"63\",\"answer\":\"Falso\"},{\"question_id\":\"65\",\"answer\":\"si\"},{\"question_id\":\"66\",\"answer\":\"cristobal colon\"}]', 21, 50, 18),
(0, '[{\"question_id\":\"67\",\"answer\":\"Solo el uso de redes sociales.\"},{\"question_id\":\"68\",\"answer\":\"Monitor\"},{\"question_id\":\"69\",\"answer\":\"Falso\"},{\"question_id\":\"70\",\"answer\":\"Falso\"},{\"question_id\":\"71\",\"answer\":\"{\\\"0\\\":\\\"Programa que controla los recursos d', 22, 40, 18),
(0, '[{\"question_id\":\"73\",\"answer\":\"Falso\"}]', 24, 100, 18),
(0, '[{\"question_id\":\"79\",\"answer\":\"Falso\"}]', 27, 0, 18),
(0, '[{\"question_id\":\"80\",\"answer\":\"Verdadero\"},{\"question_id\":\"81\",\"answer\":\"Verdadero\"}]', 28, 50, 18),
(0, '[{\"question_id\":\"82\",\"answer\":\"Verdadero\"},{\"question_id\":\"83\",\"answer\":\"Verdadero\"}]', 29, 50, 18),
(0, '[{\"question_id\":\"84\",\"answer\":\"La capacidad de imponer \\u00f3rdenes.\"},{\"question_id\":\"85\",\"answer\":\"Delegar y promover la participaci\\u00f3n del equipo.\"},{\"question_id\":\"86\",\"answer\":\"Escuchar las opiniones del grupo.\"},{\"question_id\":\"87\",\"answer\":\"Ins', 30, 40, 19),
(0, '[{\"question_id\":\"84\",\"answer\":\"La habilidad para influir positivamente en otras personas para alcanzar metas comunes.\"},{\"question_id\":\"85\",\"answer\":\"Delegar y promover la participaci\\u00f3n del equipo.\"},{\"question_id\":\"86\",\"answer\":\"Controlar y tomar de', 30, 90, 18),
(0, '[{\"question_id\":\"94\",\"answer\":\"La capacidad de una persona o empresa para obtener dinero a cambio de una promesa de pago futuro.\"},{\"question_id\":\"95\",\"answer\":\"El monto original del pr\\u00e9stamo\"},{\"question_id\":\"96\",\"answer\":\"Cr\\u00e9dito hipotecario.\"', 32, 30, 18),
(0, '[{\"question_id\":\"94\",\"answer\":\"La obligaci\\u00f3n de pagar un pr\\u00e9stamo de inmediato\"},{\"question_id\":\"95\",\"answer\":\"El porcentaje adicional que se paga por el uso del dinero prestado\"},{\"question_id\":\"96\",\"answer\":\"Cr\\u00e9dito hipotecario.\"},{\"quest', 32, 20, 20),
(0, '[{\"question_id\":\"104\",\"answer\":\"Verdadero\"}]', 33, 100, 20),
(0, '[{\"question_id\":\"107\",\"answer\":\"Verdadero\"}]', 34, 100, 20),
(0, '[{\"question_id\":\"107\",\"answer\":\"Verdadero\"}]', 34, 100, 21),
(0, '[{\"question_id\":\"94\",\"answer\":\"La capacidad de una persona o empresa para obtener dinero a cambio de una promesa de pago futuro.\"},{\"question_id\":\"95\",\"answer\":\"El pago mensual fijo\"},{\"question_id\":\"96\",\"answer\":\"Cr\\u00e9dito de consumo\"},{\"question_id\":', 32, 22, 21),
(0, '[{\"question_id\":\"77\",\"answer\":\"Verdadero\"}]', 25, 100, 21),
(0, '[{\"question_id\":\"105\",\"answer\":\"Verdadero\"},{\"question_id\":\"106\",\"answer\":\"Falso\"}]', 33, 50, 21),
(0, '[{\"question_id\":\"108\",\"answer\":\"Verdadero\"}]', 35, 0, 18),
(0, '[{\"question_id\":\"74\",\"answer\":\"Solo f\\u00f3rmulas trigonom\\u00e9tricas.\"},{\"question_id\":\"75\",\"answer\":\"5\"},{\"question_id\":\"76\",\"answer\":\"Verdadero\"},{\"question_id\":\"77\",\"answer\":\"Verdadero\"},{\"question_id\":\"78\",\"answer\":\"{\\\"0\\\":\\\"Ax+By+C=0\\\",\\\"1\\\":\\\"Ecua', 25, 40, 22),
(0, '[{\"question_id\":\"111\",\"answer\":\"gvbhn\"},{\"question_id\":\"112\",\"answer\":\"Falso\"}]', 39, 100, 22),
(0, '[{\"question_id\":\"104\",\"answer\":\"Verdadero\"},{\"question_id\":\"105\",\"answer\":\"Verdadero\"},{\"question_id\":\"106\",\"answer\":\"Verdadero\"}]', 33, 100, 18),
(0, '[{\"question_id\":\"131\",\"answer\":\"Verdadero\"}]', 45, 0, 18),
(0, '[{\"question_id\":\"148\",\"answer\":\"no se \"},{\"question_id\":\"149\",\"answer\":\"Verdadero\"}]', 54, 50, 26),
(0, '[{\"question_id\":\"143\",\"answer\":\"Verdadero\"},{\"question_id\":\"144\",\"answer\":\"Verdadero\"},{\"question_id\":\"145\",\"answer\":\"Verdadero\"}]', 52, 0, 28),
(0, '[{\"question_id\":\"144\",\"answer\":\"Verdadero\"},{\"question_id\":\"145\",\"answer\":\"Verdadero\"}]', 49, 0, 28),
(0, '[{\"question_id\":\"67\",\"answer\":\"La cultura tradicional en formato electr\\u00f3nico\"},{\"question_id\":\"68\",\"answer\":\"Monitor\"},{\"question_id\":\"69\",\"answer\":\"Verdadero\"},{\"question_id\":\"70\",\"answer\":\"Verdadero\"},{\"question_id\":\"71\",\"answer\":\"{\\\"0\\\":\\\"Programa', 22, 40, 29),
(0, '[{\"question_id\":\"144\",\"answer\":\"Verdadero\"},{\"question_id\":\"145\",\"answer\":\"Verdadero\"}]', 49, 0, 44),
(0, '[{\"question_id\":\"163\",\"answer\":\"Verdadero\"}]', 103, 100, 44),
(0, '[{\"question_id\":\"143\",\"answer\":\"Verdadero\"},{\"question_id\":\"144\",\"answer\":\"Falso\"},{\"question_id\":\"145\",\"answer\":\"Verdadero\"}]', 52, 33, 44),
(0, '[{\"question_id\":\"162\",\"answer\":\"SQL\"}]', 101, 100, 45),
(0, '[{\"question_id\":\"143\",\"answer\":\"Falso\"},{\"question_id\":\"144\",\"answer\":\"Falso\"},{\"question_id\":\"145\",\"answer\":\"Falso\"}]', 52, 100, 45),
(0, '[{\"question_id\":\"162\",\"answer\":\"SQL\"}]', 100, 100, 45),
(0, '[{\"question_id\":\"177\",\"answer\":\"Verdadero\"}]', 107, 100, 18),
(0, '[{\"question_id\":\"175\",\"answer\":\"NO SE ALGO\"},{\"question_id\":\"176\",\"answer\":\"m\"}]', 96, 0, 18),
(0, '[{\"question_id\":\"178\",\"answer\":\"OPCION 1\"}]', 108, 0, 18);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `name` enum('ROLE_STUDENT','ROLE_TEACHER') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `matricula` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `username` varchar(100) NOT NULL,
  `semester` varchar(20) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `group_name` varchar(50) DEFAULT NULL,
  `career` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `matricula`, `password`, `role`, `username`, `semester`, `group_id`, `group_name`, `career`) VALUES
(2, 'E2025', '$2y$10$5FrWAvG9v7bvw017OijrgOnWHVE5tc7T9xLrPTtMZXx4oe7oQGZQ6', 'ROLE_TEACHER', 'Esmeralda', '', NULL, '', NULL),
(9, 'admin', 'admin123', 'ROLE_ADMIN', 'Administrador', NULL, NULL, NULL, NULL),
(10, 'G2025', '$2y$10$oFn8HCN.UNir4/NAmgj.SeG0/w2VphMRja4RpqqHTnjVNrw23kaKe', 'ROLE_STUDENT', 'Gabriel', '2', NULL, '2 de Administración', 'Administración'),
(11, 'P2026', '$2y$10$.MYPNl79WZ0vOUAri6Gd6.vrWdw0Tj9g7cyvjDOOns1Df3AYbLiwy', 'ROLE_STUDENT', 'paola', '2', NULL, '1 de Administración', 'Administración'),
(12, 'A123', '$2y$10$qNmQ//bXSmRvFh1PZiDZCOTV8NrpgECWUFKU5S54Ux7P.pd0/MpwC', 'ROLE_TEACHER', 'aa', '', NULL, '', NULL),
(13, 'P2025', '12345', 'ROLE_TEACHER', 'pamela', '', NULL, '', NULL),
(14, 'N2025', '12345', 'ROLE_STUDENT', 'Norma', '2', NULL, '2 de Administración', 'Administración'),
(15, 'M2025', '12345', 'ROLE_STUDENT', 'Melisa', '6', NULL, '3 de Informática', 'Informática'),
(16, 'B2025', '12345', 'ROLE_STUDENT', 'Belen Diaz Juárez', '2', NULL, '1 de Administración', 'Administración'),
(17, 'AG2025', '12345', 'ROLE_STUDENT', 'Antonia Gabriela Cristóbal', '2', NULL, '2 de Administración', 'Administración'),
(18, 'I2025', '12345', 'ROLE_STUDENT', 'Isabel', '1', NULL, '1 de Administración', 'Administración'),
(19, 'MA20', '12345', 'ROLE_STUDENT', 'Maria Antonia', '1', NULL, '1 de Administración', 'Administración'),
(20, 'SR20', '12345', 'ROLE_STUDENT', 'Saul Rojas', '1', NULL, '1 de Administración', 'Administración'),
(21, 'PP2025', '12345', 'ROLE_STUDENT', 'Pancho', '1', NULL, '1 de Administración', 'Administración'),
(22, 'ML2025', '12345', 'ROLE_STUDENT', 'Luis Mario', '1', NULL, '1 de Administración', 'Administración'),
(23, 'J2025', '12345', 'ROLE_STUDENT', 'Juana', '2', NULL, '2 de Administración', 'Administración'),
(24, 'L2025', '12345', 'ROLE_STUDENT', 'Laura', '2', NULL, '2 de Administración', 'Administración'),
(25, 'D2025', '12345', 'ROLE_TEACHER', 'Daniela', '', NULL, '', NULL),
(26, 'BE2025', '12345', 'ROLE_STUDENT', 'Brandon Enrique', '2', NULL, '1 de Informática', 'Informática'),
(27, 'G2026', '12345', 'ROLE_STUDENT', 'Gabriela', '2', NULL, '2 de Administración', 'Administración'),
(28, 'Aa2025', '12345', 'ROLE_STUDENT', 'Aarón', '2', NULL, '2 de Administración', 'Administración'),
(29, 'JD2025', '12345', 'ROLE_STUDENT', 'Juana Daniela', '1', NULL, '1 de Informática', 'Informática'),
(30, 'LP2025', '12345', 'ROLE_STUDENT', 'Liliana Perez', '1', NULL, '1 de Administración', 'Administración'),
(31, 'P20250', '12345', 'ROLE_STUDENT', 'Pedro', '2', NULL, '2 de Informática', 'Informática'),
(32, 'AP2026', '12345', 'ROLE_TEACHER', 'Alicia Paulino', '', NULL, '', NULL),
(33, 'J20256', '12345', 'ROLE_STUDENT', 'Juana', '1', NULL, '1 de Informática', 'Informática'),
(34, 'I20256', '12345', 'ROLE_STUDENT', 'Ignacia', '1', NULL, '1 de Administración', 'Administración'),
(35, 'GD2025', '12345', 'ROLE_TEACHER', 'Gilberto  Diaz', '', NULL, '', NULL),
(36, 'PJ2025', '1235', 'ROLE_STUDENT', 'Pamela Juarez', '1', NULL, '1 de Administración', 'Administración'),
(37, 'RP2025', '12345', 'ROLE_STUDENT', 'Ricardo Perez', '1', NULL, '1 de Informática', 'Informática'),
(38, 'SC20', '12345', 'ROLE_STUDENT', 'Samantha Catillo', '2', NULL, '2 de Administración', 'Administración'),
(39, 'PL20', '12345', 'ROLE_STUDENT', 'Pancho Lalo', '2', NULL, '2 de Informática', 'Informática'),
(40, 'LP20256', '12345', 'ROLE_STUDENT', 'Laura Lopez', '3', NULL, '2 de Administración', 'Administración'),
(42, 'ED2025', '12345', 'ROLE_STUDENT', 'Esmeralda de Jesus', '1', NULL, '1 de Administración', 'Administración'),
(43, 'GD2026', '12345', 'ROLE_STUDENT', 'Gabriel de Jesus', '1', NULL, '1 de Informática', 'Informática'),
(44, 'PJ2026', '12345', 'ROLE_STUDENT', 'Pedro Juarez', '2', NULL, '2 de Administración', 'Administración'),
(45, 'AA2026', '12345', 'ROLE_STUDENT', 'Alicia Antonio', '2', NULL, '2 de Informática', 'Informática'),
(46, 'LPA2025', '12345', 'ROLE_TEACHER', 'Leonel Pancho', '', NULL, '', NULL),
(47, 'jn2025', '12345', 'ROLE_TEACHER', 'jn', '', NULL, '', NULL),
(48, '997544026', '026', 'ROLE_TEACHER', 'MARIA GARCIA RODRIGUEZ', '', NULL, '', NULL);

--
-- Disparadores `users`
--
DELIMITER $$
CREATE TRIGGER `set_user_career` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
    IF NEW.group_name LIKE '%Administración%' THEN
        SET NEW.career = 'Administración';
    ELSEIF NEW.group_name LIKE '%Informática%' THEN
        SET NEW.career = 'Informática';
    ELSE
        SET NEW.career = NULL;
    END IF;
END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_exam_question` (`exam_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matricula` (`matricula`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT de la tabla `exam_questions`
--
ALTER TABLE `exam_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT de la tabla `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=179;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `fk_exam_question` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
