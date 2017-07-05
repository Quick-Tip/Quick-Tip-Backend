-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 05, 2017 at 03:17 PM
-- Server version: 5.6.35
-- PHP Version: 7.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `quick_tip`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` bigint(20) NOT NULL,
  `uid` bigint(20) NOT NULL,
  `balance` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `employ_relation`
--

CREATE TABLE `employ_relation` (
  `id` bigint(20) NOT NULL,
  `employer` bigint(20) NOT NULL,
  `employee` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `reward_list`
--

CREATE TABLE `reward_list` (
  `id` bigint(20) NOT NULL,
  `getter` bigint(20) NOT NULL,
  `setter` bigint(20) NOT NULL,
  `money` bigint(20) NOT NULL,
  `comment` text,
  `star` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `visible` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `uid` bigint(20) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(30) NOT NULL,
  `nickname` varchar(20) NOT NULL,
  `user_type` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid_2` (`uid`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `employ_relation`
--
ALTER TABLE `employ_relation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee` (`employee`),
  ADD KEY `employer` (`employer`);

--
-- Indexes for table `reward_list`
--
ALTER TABLE `reward_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `getter` (`getter`),
  ADD KEY `setter` (`setter`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `employ_relation`
--
ALTER TABLE `employ_relation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `reward_list`
--
ALTER TABLE `reward_list`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `uid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
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
-- Constraints for table `reward_list`
--
ALTER TABLE `reward_list`
  ADD CONSTRAINT `reward_list_ibfk_1` FOREIGN KEY (`getter`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reward_list_ibfk_2` FOREIGN KEY (`setter`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;
