-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2013 at 03:54 AM
-- Server version: 5.5.32
-- PHP Version: 5.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `task_management`
--
CREATE DATABASE IF NOT EXISTS `task_management` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `task_management`;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `CategoryId` int(11) NOT NULL AUTO_INCREMENT,
  `ParentId` int(11) NOT NULL,
  `CategoryTitle` text NOT NULL,
  PRIMARY KEY (`CategoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`CategoryId`, `ParentId`, `CategoryTitle`) VALUES
(1, 0, 'Root1'),
(2, 0, 'Root2'),
(3, 1, 'child of root1'),
(4, 2, 'child of root2'),
(5, 3, 'grandchild1 of root1'),
(6, 4, 'grandchild1 of root2'),
(7, 3, 'grandchild2 of root1'),
(8, 4, 'grandchild2 of root2'),
(9, 5, 'grand-grandchild of root1'),
(10, 6, 'grand-grandchild of root2');

-- --------------------------------------------------------

--
-- Table structure for table `membership`
--

CREATE TABLE IF NOT EXISTS `membership` (
  `UserId` int(11) NOT NULL AUTO_INCREMENT,
  `UserFirstName` text NOT NULL,
  `UserLastName` text NOT NULL,
  `UserName` text NOT NULL,
  `Password` text NOT NULL,
  `EmailAddress` text NOT NULL,
  PRIMARY KEY (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE IF NOT EXISTS `task` (
  `TaskId` int(11) NOT NULL AUTO_INCREMENT,
  `TaskTitle` tinytext NOT NULL,
  `TaskCategoryId` int(11) NOT NULL,
  `StartDate` datetime DEFAULT NULL,
  `DueDate` datetime DEFAULT NULL,
  `BudgetTime` tinyint(4) DEFAULT NULL,
  `SpentTime` tinyint(4) DEFAULT NULL,
  `Status` enum('Open','Closed','Suspended','') NOT NULL DEFAULT 'Open',
  `Notes` text NOT NULL,
  PRIMARY KEY (`TaskId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`TaskId`, `TaskTitle`, `TaskCategoryId`, `StartDate`, `DueDate`, `BudgetTime`, `SpentTime`, `Status`, `Notes`) VALUES
(2, 'Task number two', 2, '0000-00-00 00:00:00', '2013-10-19 10:12:18', 4, 4, 'Open', 'This should be taken seriously'),
(3, 'Task number three', 0, '0000-00-00 00:00:00', '2013-10-16 04:09:09', NULL, 0, 'Open', 'This is not as important.'),
(4, 'Task number four', 0, '0000-00-00 00:00:00', '2013-11-13 17:30:00', NULL, 0, 'Open', 'This is optional.'),
(6, 'Task number two', 0, '0000-00-00 00:00:00', '2013-10-19 10:12:18', NULL, 0, 'Open', 'This should be taken seriously'),
(7, 'Task number one', 1, '0000-00-00 00:00:00', '2013-10-31 09:00:00', 5, 1, 'Open', 'This is an important task'),
(9, 'new Task', 2, '0000-00-00 00:00:00', '2013-11-24 01:09:07', NULL, 0, 'Open', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
