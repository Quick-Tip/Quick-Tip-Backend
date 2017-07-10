-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 10, 2017 at 05:01 AM
-- Server version: 5.6.35
-- PHP Version: 7.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `quick_tip`
--
CREATE DATABASE IF NOT EXISTS `quick_tip` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `quick_tip`;

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
CREATE TABLE IF NOT EXISTS `account` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) NOT NULL,
  `balance` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid_2` (`uid`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `account`
--



-- --------------------------------------------------------

--
-- Table structure for table `employ_relation`
--

DROP TABLE IF EXISTS `employ_relation`;
CREATE TABLE IF NOT EXISTS `employ_relation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `employer` bigint(20) NOT NULL,
  `employee` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee` (`employee`),
  KEY `employer` (`employer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `employ_relation`
--



-- --------------------------------------------------------

--
-- Table structure for table `nfc_bind`
--

DROP TABLE IF EXISTS `nfc_bind`;
CREATE TABLE IF NOT EXISTS `nfc_bind` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `shop_id` bigint(20) NOT NULL,
  `waitor_id` bigint(20) DEFAULT NULL,
  `desktop_id` bigint(20) NOT NULL,
  `data` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `data` (`data`),
  KEY `shop_id` (`shop_id`),
  KEY `waitor_id` (`waitor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `reward_list`
--

DROP TABLE IF EXISTS `reward_list`;
CREATE TABLE IF NOT EXISTS `reward_list` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `getter` bigint(20) NOT NULL,
  `setter` bigint(20) NOT NULL,
  `shop` bigint(20) NOT NULL,
  `money` bigint(20) NOT NULL,
  `comment` text,
  `star` int(11) NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `visible` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `getter` (`getter`),
  KEY `setter` (`setter`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `reward_list`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `uid` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(30) NOT NULL,
  `nickname` varchar(20) NOT NULL,
  `user_type` varchar(1) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `user`
--



--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `account_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employ_relation`
--
ALTER TABLE `employ_relation`
  ADD CONSTRAINT `employ_relation_ibfk_1` FOREIGN KEY (`employer`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employ_relation_ibfk_2` FOREIGN KEY (`employee`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `nfc_bind`
--
ALTER TABLE `nfc_bind`
  ADD CONSTRAINT `nfc_bind_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `nfc_bind_ibfk_2` FOREIGN KEY (`waitor_id`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reward_list`
--
ALTER TABLE `reward_list`
  ADD CONSTRAINT `reward_list_ibfk_1` FOREIGN KEY (`getter`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reward_list_ibfk_2` FOREIGN KEY (`setter`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;
