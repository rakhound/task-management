-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2013 at 10:04 PM
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
  `UserId` int(11) NOT NULL,
  `ParentId` int(11) NOT NULL,
  `CategoryTitle` text NOT NULL,
  PRIMARY KEY (`CategoryId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=23 ;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`CategoryId`, `UserId`, `ParentId`, `CategoryTitle`) VALUES
(1, 21, 0, 'Root1_name1'),
(2, 21, 0, 'Root2_name1'),
(3, 21, 1, 'child of root1_name1'),
(4, 21, 2, 'child of root2_name1'),
(5, 21, 3, 'grandchild1 of root1_name1'),
(6, 21, 4, 'grandchild1 of root2_name1'),
(7, 21, 3, 'grandchild2 of root1_name1'),
(8, 21, 4, 'grandchild2 of root2_name1'),
(9, 21, 5, 'grand-grandchild of root1_name1'),
(10, 21, 6, 'grand-grandchild of root2_name1'),
(11, 22, 0, 'Root1_name2'),
(12, 22, 0, 'Root2_name2'),
(13, 21, 2, 'anotherChild_root2_name1'),
(14, 22, 11, 'Root1_child1_name2'),
(15, 22, 12, 'Root2_child1_name2'),
(16, 21, 13, 'grandChild_root2_name1'),
(17, 21, 1, 'child2_Root1_name1'),
(18, 22, 11, 'Root1_child2_name2'),
(19, 21, 1, 'Child3_Root1_name1'),
(20, 21, 1, 'new cat'),
(21, 0, 7, 'grandgrandChild_root1_name1'),
(22, 0, 2, 'thirdChild_R2_N1');

-- --------------------------------------------------------

--
-- Table structure for table `membership`
--

CREATE TABLE IF NOT EXISTS `membership` (
  `UserId` int(11) NOT NULL AUTO_INCREMENT,
  `UserFirstName` text NOT NULL,
  `UserLastName` text NOT NULL,
  `EmailAddress` text NOT NULL,
  `UserName` varchar(25) NOT NULL,
  `Password` text NOT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `UserName` (`UserName`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=25 ;

--
-- Dumping data for table `membership`
--

INSERT INTO `membership` (`UserId`, `UserFirstName`, `UserLastName`, `EmailAddress`, `UserName`, `Password`) VALUES
(17, 'fName3', 'lName3', 'email3@xxx.com', 'username3', 'b44339374b3ef4f558a43850c91bba72'),
(18, 'fName4', 'lName4', 'email4@xxx.com', 'username4', 'e2dccbf9c134def3558ee76eafbe8ce5'),
(19, 'fName5', 'lName5', 'email5@xxx.com', 'username5', '0c2c55424bfb52af7c16321e8d5c633c'),
(20, 'a', 'a', 'a@s.com', 'dd', '0cc175b9c0f1b6a831c399e269772661'),
(21, 'FirstName1', 'LastName1', 'email1@yahoo.com', 'name1', 'a722c63db8ec8625af6cf71cb8c2d939'),
(22, 'FirstName2', 'LastName2', 'email2@yahoo.com', 'name2', 'c1572d05424d0ecb2a65ec6a82aeacbf'),
(23, 'FirstName3', 'LastName3', 'email3@yahoo.com', 'name3', '3afc79b597f88a72528e864cf81856d2'),
(24, 'FirstName4', 'LastName4', 'email4@yahoo.com', 'name4', 'fc2921d9057ac44e549efaf0048b2512');

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE IF NOT EXISTS `task` (
  `TaskId` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL,
  `TaskTitle` tinytext NOT NULL,
  `TaskCategoryId` int(11) NOT NULL,
  `StartDate` datetime DEFAULT NULL,
  `DueDate` datetime DEFAULT NULL,
  `BudgetTime` tinyint(4) DEFAULT NULL,
  `SpentTime` tinyint(4) DEFAULT NULL,
  `Status` enum('Open','Closed','Suspended','') NOT NULL DEFAULT 'Open',
  `Notes` text NOT NULL,
  `TaskCat` varchar(128) NOT NULL,
  PRIMARY KEY (`TaskId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=29 ;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`TaskId`, `UserId`, `TaskTitle`, `TaskCategoryId`, `StartDate`, `DueDate`, `BudgetTime`, `SpentTime`, `Status`, `Notes`, `TaskCat`) VALUES
(2, 21, 'Task number two', 0, '0000-00-00 00:00:00', '2013-10-19 10:12:18', 4, 4, 'Open', 'This should be taken seriously', ''),
(3, 21, 'Task number three', 0, '0000-00-00 00:00:00', '2013-10-16 04:09:09', NULL, 0, 'Open', 'This is not as important.', ''),
(4, 7, 'Task number four', 0, '0000-00-00 00:00:00', '2013-11-13 17:30:00', NULL, 0, 'Open', 'This is optional.', ''),
(6, 0, 'Task number two', 0, '0000-00-00 00:00:00', '2013-10-19 10:12:18', NULL, 0, 'Open', 'This should be taken seriously', ''),
(7, 0, 'Task number one', 1, '0000-00-00 00:00:00', '2013-10-31 09:00:00', 5, 1, 'Open', 'This is an important task', ''),
(9, 0, 'new Task', 2, '0000-00-00 00:00:00', '2013-11-24 01:09:07', NULL, 0, 'Open', '', ''),
(10, 0, 'fdfdf', 0, NULL, '2013-11-24 05:50:10', NULL, NULL, 'Open', '', ''),
(11, 0, 'fdfd', 0, NULL, '2013-11-24 05:50:39', 4, 2, 'Open', 'dsfsdfds', ''),
(12, 0, 'dff', 0, NULL, '2013-11-24 08:04:12', 5, 3, 'Open', '', ''),
(13, 0, 'first task for name2', 0, NULL, '2013-11-27 23:31:49', NULL, NULL, 'Open', 'tough one!', 'Root1_name2'),
(14, 0, 'first task for name2', 0, NULL, '2013-11-27 23:33:18', NULL, NULL, 'Open', 'tough one!', 'Root1_name2'),
(15, 0, 'second t task for name2', 0, NULL, '2013-11-27 23:36:31', NULL, NULL, 'Open', 'tougher one', 'Root2_name2'),
(16, 0, 'second t task for name2', 0, NULL, '2013-11-27 23:40:10', NULL, NULL, 'Open', 'tougher one', 'Root1_name2'),
(17, 0, 'dsfdsfds', 0, NULL, '2013-11-27 23:44:38', NULL, NULL, 'Open', 'dfsd', 'Root1_name2'),
(18, 21, 'task for name1', 0, NULL, '2013-11-27 23:52:28', NULL, NULL, 'Closed', 'tough', 'Root1_name1'),
(19, 22, 'another task for name2', 0, NULL, '2013-11-27 23:58:14', NULL, NULL, 'Open', 'this is another task for name2', 'Root2_child1_name2'),
(20, 21, 'some task for name 1', 0, NULL, '2013-11-28 01:51:50', NULL, NULL, 'Open', 'a task under category grandchild_root2_name1', 'grandChild_root2_name1'),
(21, 21, 'last taks for name1', 0, NULL, '2013-11-28 02:16:09', NULL, NULL, 'Open', 'new task', 'anotherChild_root2_name1'),
(22, 21, 'task for name1 in class', 0, NULL, '2013-11-28 02:19:42', NULL, NULL, 'Open', 'dsfdsf', 'Root1_name1'),
(23, 22, 'sdsad', 0, NULL, '2013-11-28 02:48:09', NULL, NULL, 'Open', 'dfdf', 'Root1_name2'),
(24, 21, 'yet another task for name1', 0, NULL, '2013-11-28 02:54:07', NULL, NULL, 'Open', 'toughest', 'Root1_name1'),
(25, 21, 'dsfdsfds', 0, NULL, '2013-11-28 02:56:02', NULL, NULL, 'Open', 'sdfs', 'Root2_name1'),
(26, 21, 'task for name2 ,  a new one', 0, NULL, '2013-11-28 03:05:26', NULL, NULL, 'Open', 'new task for name1 that needs to be done', 'grand-grandchild of root1_name1'),
(27, 22, 'latest task for name2', 0, NULL, '2013-11-28 03:06:56', 5, 0, 'Open', 'a really tough task for name2', 'Root1_child1_name2'),
(28, 21, 'Saturday Task for name1', 0, NULL, '2013-11-30 20:30:45', 4, 0, 'Open', 'This is a task for saturdays', 'new cat');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
