CREATE TABLE IF NOT EXISTS `network` (
  `passwd_id` int(11) NOT NULL AUTO_INCREMENT,
  `passwd_name` varchar(200) DEFAULT NULL,
  `passwd_user` varchar(200) DEFAULT NULL,
  `passwd_value` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`passwd_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

INSERT INTO `network` (`passwd_id`, `passwd_name`, `passwd_user`, `passwd_value`) VALUES
(1, 'Facebook', 'toto', 'tktfrere111'),
(2, 'Twitter', 'Pierre', 'Adju8:'),
(3, 'Kali', 'root', 'toor');
