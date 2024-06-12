-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: greenAction
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `greenAction`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `greenAction` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `greenAction`;

--
-- Table structure for table `Admin`
--

DROP TABLE IF EXISTS `Admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Admin_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin`
--

LOCK TABLES `Admin` WRITE;
/*!40000 ALTER TABLE `Admin` DISABLE KEYS */;
INSERT INTO `Admin` VALUES (1,4);
/*!40000 ALTER TABLE `Admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Branch`
--

DROP TABLE IF EXISTS `Branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Branch` (
  `branch_id` int NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(50) DEFAULT NULL,
  `phone_number` varchar(16) DEFAULT NULL,
  `street_address` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `postcode` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`branch_id`),
  UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Branch`
--

LOCK TABLES `Branch` WRITE;
/*!40000 ALTER TABLE `Branch` DISABLE KEYS */;
INSERT INTO `Branch` VALUES (1,'South Australia','123-123-1234','1 Rundle Mall St','Adelaide','SA','5000'),(2,'Victoria','456-456-4567','1 Bourke Street','Melbourne','VIC','3000'),(3,'New South Wales','789-789-6789','1 Bondi St','Sydney','NSW','2000');
/*!40000 ALTER TABLE `Branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Event`
--

DROP TABLE IF EXISTS `Event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Event` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `event_type` varchar(100) DEFAULT NULL,
  `time` time DEFAULT NULL,
  `date` date DEFAULT NULL,
  `content` text,
  `is_public` tinyint(1) DEFAULT NULL,
  `street_address` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postcode` varchar(20) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `Event_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `Branch` (`branch_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Event`
--

LOCK TABLES `Event` WRITE;
/*!40000 ALTER TABLE `Event` DISABLE KEYS */;
INSERT INTO `Event` VALUES (13,'Public Tree Planting Day','08:00:00','2024-07-20','Join us for a community tree planting event at Adelaide Park. Help us plant native trees to restore the local ecosystem and enhance green spaces in our city. No experience necessary – just bring your enthusiasm and a shovel! This event is part of our ongoing efforts to combat deforestation and promote environmental sustainability. Participants will have the opportunity to learn about tree planting techniques, the importance of biodiversity, and the role of trees in mitigating climate change. We\'ll provide all the necessary tools and guidance, along with refreshments and snacks to keep you energized throughout the day. Whether you\'re a seasoned gardener or a first-time tree planter, everyone is welcome to join us for a day of environmental stewardship and community bonding.',1,'Adelaide Park','Adelaide','SA','5000',1),(14,'Environmental Film Screening','18:30:00','2024-08-05','Join us for an outdoor screening of thought-provoking documentaries about environmental conservation and the importance of trees. Bring your blanket and snacks and immerse yourself in stories that inspire positive change. This event aims to raise awareness about pressing environmental issues and ignite conversations about how we can collectively protect our planet. After the screening, we\'ll facilitate a discussion where attendees can share their thoughts and ideas for taking action in their communities. Together, let\'s harness the power of film to inspire positive environmental action and create a more sustainable future for all.',1,'Adelaide Park','Adelaide','SA','5000',1),(15,'Nature Walk and Tree Identification Tour','10:00:00','2024-09-15','Explore the beauty of Adelaide\'s natural environment on a guided nature walk. Learn about native tree species, their ecological significance, and how you can help protect them. This leisurely stroll through Adelaide Park offers a unique opportunity to connect with nature, observe local flora and fauna, and gain insights into the importance of biodiversity conservation. Our knowledgeable guides will share fascinating facts about the trees you encounter, their life cycles, and their roles in supporting diverse ecosystems. Bring your curiosity and your questions as we embark on a journey of discovery and appreciation for the natural world.',1,'Adelaide Park','Adelaide','SA','5000',1),(16,'Corporate Green Team Building Day','09:00:00','2024-07-25','A private team-building event for corporate groups focused on environmental stewardship. Engage in tree planting activities and eco-friendly initiatives to foster teamwork and environmental responsibility.',0,'Adelaide Business Park','Adelaide','SA','5000',1),(17,'VIP Sustainability Luncheon','12:00:00','2024-08-10','An exclusive luncheon event for sustainability advocates and corporate partners. Discussions revolve around innovative solutions for sustainable land management, forest conservation, and green business practices.',0,'Adelaide Conference Center','Adelaide','SA','5000',1),(18,'Members-Only Eco-Tour','14:00:00','2024-09-20','A members-only eco-tour of Adelaide\'s conservation areas and protected forests. Explore biodiverse ecosystems, learn about local flora and fauna, and gain insights into conservation challenges and solutions.',0,'Adelaide Nature Reserve','Adelaide','SA','5000',1),(19,'Melbourne Eco-Fair','10:00:00','2024-07-30','Join us at the Melbourne Eco-Fair for a day of eco-friendly exhibits, workshops, and activities. Learn about sustainable living practices, renewable energy solutions, and conservation efforts. Bring your family and friends to explore ways to reduce your environmental footprint and contribute to a greener future. The fair will feature interactive exhibits showcasing innovative eco-friendly technologies, such as solar panels, electric vehicles, and composting systems. Attendees can participate in hands-on workshops on topics such as urban gardening, zero waste living, and eco-friendly home design. Join us for a day of education, inspiration, and fun as we work together towards a more sustainable Melbourne!',1,'Melbourne Exhibition Center','Melbourne','VIC','3000',2),(20,'Urban Tree Planting Workshop','09:30:00','2024-08-15','Take part in our Urban Tree Planting Workshop and learn how to green your city. Discover the benefits of urban trees, from improving air quality to reducing urban heat islands. Join us as we plant trees in urban areas and create green spaces for communities to enjoy. This hands-on workshop will provide participants with the knowledge and skills needed to plant and care for trees in urban environments. Experts will share tips on selecting appropriate tree species, planting techniques, and tree maintenance. Whether you are a seasoned gardener or a beginner, everyone is welcome to join us in making Melbourne a greener and healthier city!',1,'Melbourne CBD','Melbourne','VIC','3000',2),(21,'Melbourne Wildlife Walk','11:00:00','2024-09-05','Embark on a Melbourne Wildlife Walk and explore the city\'s natural habitats and urban wildlife. Learn about native species, their habitats, and the importance of urban biodiversity conservation. Join us as we observe birds, mammals, and other wildlife in their natural urban environments. This guided walk will take participants through Melbourne\'s parks, gardens, and green spaces, providing opportunities to spot a variety of urban wildlife species. Experts will share insights into the ecology and behavior of urban animals, as well as the challenges they face in an urban environment. Whether you are a nature enthusiast or just curious about the wildlife in your city, this walk is a great way to connect with nature and learn about Melbourne\'s diverse urban ecosystems!',1,'Royal Botanic Gardens','Melbourne','VIC','3000',2),(22,'Corporate Green Sustainability Workshop','09:00:00','2024-07-25','A private workshop for corporations interested in adopting green sustainability practices. Explore strategies for reducing environmental impact, implementing eco-friendly policies, and fostering a culture of sustainability within your organization. This workshop will provide corporate teams with the tools and resources needed to develop and implement sustainability initiatives. Experts will lead discussions on topics such as energy efficiency, waste reduction, and sustainable supply chain management. Participants will leave the workshop with actionable steps to improve their company\'s environmental performance and contribute to a more sustainable future.',0,'Melbourne Business District','Melbourne','VIC','3000',2),(23,'VIP Green Gala Dinner','19:00:00','2024-08-10','An exclusive gala dinner celebrating environmental stewardship and green innovation. Join industry leaders, environmental advocates, and VIP guests for an evening of gourmet dining, inspirational speeches, and fundraising for environmental causes. This gala dinner will feature keynote speakers from the environmental sector, sharing insights into current environmental challenges and opportunities for sustainable change. Guests will enjoy a gourmet dinner featuring locally sourced, sustainably produced ingredients, highlighting the importance of sustainable food systems. The evening will conclude with a fundraising auction to support environmental organizations and initiatives.',0,'Melbourne Convention Center','Melbourne','VIC','3000',2),(24,'Members-Only Rainforest Retreat','14:00:00','2024-09-20','A members-only retreat to explore Victoria\'s lush rainforests and learn about rainforest conservation. Join us for an immersive experience in the heart of nature as we venture deep into Victoria\'s verdant rainforests. Led by expert guides, participants will discover the incredible biodiversity of these ancient ecosystems, from towering trees to vibrant flora and fauna. The retreat will include guided hikes through pristine rainforest trails, wildlife spotting opportunities, and educational sessions on rainforest ecology and conservation. Relax and unwind in the tranquility of nature while gaining a deeper appreciation for the importance of rainforests in sustaining life on Earth. This exclusive retreat offers a unique opportunity to connect with nature and support rainforest conservation efforts.',0,'Victoria Rainforest Reserve','Melbourne','VIC','3000',2),(25,'Sydney Coastal Cleanup','09:00:00','2024-07-15','Join us for a coastal cleanup along Sydney\'s stunning coastline. Help preserve our marine environment by removing litter and debris from beaches and waterways. This family-friendly event aims to raise awareness about marine pollution and promote environmental stewardship. Participants will receive cleanup supplies and instructions before embarking on their cleanup efforts. Together, we can make a positive impact on Sydney\'s coastal ecosystems and protect them for future generations to enjoy.',1,'Bondi Beach','Sydney','NSW','2026',3),(26,'Sydney Botanical Garden Tour','10:30:00','2024-08-20','Experience the beauty of Sydney\'s Botanical Gardens on a guided tour showcasing the diversity of plant life from around the world. Join our knowledgeable guides as they lead you through lush gardens, tranquil ponds, and vibrant floral displays. Learn about the ecological importance of botanical gardens in conserving plant species and supporting biodiversity. This leisurely tour offers a chance to connect with nature, learn about plant conservation, and appreciate the natural beauty of Sydney\'s green spaces.',1,'Royal Botanic Garden','Sydney','NSW','2000',3),(27,'Sydney Tree Planting Day','11:00:00','2024-09-10','Join us for a tree planting extravaganza at Sydney Park. Help increase green spaces in the city and combat climate change by planting native trees. This community event aims to engage residents in environmental conservation and urban greening initiatives. Participants will learn proper tree planting techniques and the importance of trees in urban environments. Together, we can make Sydney a greener and more sustainable city for all.',1,'Sydney Park','Sydney','NSW','2000',3),(28,'Corporate Sustainability Workshop','10:00:00','2024-07-25','A private workshop for corporate teams interested in advancing sustainability initiatives within their organizations. Explore strategies for reducing carbon footprints, implementing green practices, and fostering a culture of sustainability. This workshop will feature expert-led discussions, case studies, and interactive sessions tailored to corporate sustainability needs. Participants will leave with actionable insights and tools to drive positive environmental change within their companies.',0,'Sydney CBD','Sydney','NSW','2000',3),(29,'VIP Environmental Summit','18:00:00','2024-08-15','An exclusive summit gathering environmental leaders, policymakers, and industry experts to discuss pressing environmental challenges and solutions. Join us for an evening of networking, knowledge sharing, and collaboration towards a sustainable future. The summit will feature keynote speeches, panel discussions, and breakout sessions on topics such as climate change, biodiversity conservation, and sustainable development. VIP attendees will have the opportunity to engage with thought leaders and influencers in the environmental sector and shape the future of environmental policy and action.',0,'Sydney Conference Center','Sydney','NSW','2000',3),(30,'Members-Only Eco-Tour','13:00:00','2024-09-25','A members-only eco-tour showcasing Sydney\'s environmental initiatives and conservation projects. Join us for a behind-the-scenes look at sustainability efforts in action. Explore green buildings, renewable energy installations, and urban greening projects that are making Sydney a more sustainable city. The tour will include visits to innovative eco-friendly businesses, community gardens, and environmental education centers. Members will gain insights into best practices for sustainability and opportunities to get involved in local conservation efforts.',0,'Sydney Sustainability Hub','Sydney','NSW','2000',3);
/*!40000 ALTER TABLE `Event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EventNotification`
--

DROP TABLE IF EXISTS `EventNotification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EventNotification` (
  `event_notification_id` int NOT NULL AUTO_INCREMENT,
  `notification_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  PRIMARY KEY (`event_notification_id`),
  KEY `notification_id` (`notification_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `EventNotification_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `Notification` (`notification_id`) ON DELETE CASCADE,
  CONSTRAINT `EventNotification_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `Event` (`event_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EventNotification`
--

LOCK TABLES `EventNotification` WRITE;
/*!40000 ALTER TABLE `EventNotification` DISABLE KEYS */;
INSERT INTO `EventNotification` VALUES (7,16,13),(8,17,14),(9,18,15),(10,19,16),(11,20,17),(12,21,18);
/*!40000 ALTER TABLE `EventNotification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EventRSVP`
--

DROP TABLE IF EXISTS `EventRSVP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EventRSVP` (
  `rsvp_id` int NOT NULL AUTO_INCREMENT,
  `volunteer_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  PRIMARY KEY (`rsvp_id`),
  KEY `volunteer_id` (`volunteer_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `EventRSVP_ibfk_1` FOREIGN KEY (`volunteer_id`) REFERENCES `Volunteer` (`volunteer_id`) ON DELETE CASCADE,
  CONSTRAINT `EventRSVP_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `Event` (`event_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EventRSVP`
--

LOCK TABLES `EventRSVP` WRITE;
/*!40000 ALTER TABLE `EventRSVP` DISABLE KEYS */;
INSERT INTO `EventRSVP` VALUES (19,4,13),(20,4,14),(21,4,16),(27,8,14),(28,8,15),(29,8,17),(32,5,19),(33,5,20),(34,5,22),(35,10,23),(36,10,19),(37,11,20),(38,11,24),(39,12,25),(40,12,26),(41,6,28),(42,6,29),(43,7,30),(44,7,27),(45,13,19),(46,13,24),(47,14,27),(48,14,29);
/*!40000 ALTER TABLE `EventRSVP` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EventUpdate`
--

DROP TABLE IF EXISTS `EventUpdate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EventUpdate` (
  `update_id` int NOT NULL AUTO_INCREMENT,
  `update_title` varchar(100) DEFAULT NULL,
  `content` text,
  `is_public` tinyint(1) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  PRIMARY KEY (`update_id`),
  KEY `branch_id` (`branch_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `EventUpdate_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `Branch` (`branch_id`) ON DELETE CASCADE,
  CONSTRAINT `EventUpdate_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `Event` (`event_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EventUpdate`
--

LOCK TABLES `EventUpdate` WRITE;
/*!40000 ALTER TABLE `EventUpdate` DISABLE KEYS */;
INSERT INTO `EventUpdate` VALUES (10,'Additional Information','We have updated the schedule for the tree planting sessions. There will be multiple sessions throughout the day, starting at 8:00 AM and continuing until 4:00 PM. Participants can choose the session that best fits their schedule. Additionally, we\'ll be providing guided tours of the park\'s indigenous plant species and their importance in the local ecosystem. Join us for a day filled with environmental education and hands-on conservation efforts!',1,1,13),(11,'Change in Location','Due to popular demand, we have decided to extend the outdoor screening event to accommodate more attendees. The new venue for the screening is the Adelaide Park Amphitheater, which offers a larger seating capacity and better viewing experience. Don\'t miss this opportunity to enjoy thought-provoking documentaries under the stars!',1,1,14),(12,'Participant Requirements','To enhance your nature walk experience, we recommend bringing a reusable water bottle and wearing comfortable hiking shoes. Our knowledgeable guides will provide binoculars and field guides for bird watching and tree identification. Get ready to immerse yourself in the beauty of Adelaide\'s natural environment and discover the wonders of biodiversity!',1,1,15),(13,'Team Assignment Information','Each participating corporate team will be assigned specific tree planting zones and tasks upon arrival. Team leaders will receive detailed instructions and safety guidelines for the activities. In addition to tree planting, teams will have the opportunity to participate in team-building exercises and environmental challenges. Let\'s work together to strengthen teamwork and promote environmental stewardship!',0,1,16),(14,'Special Guest Speaker','We are thrilled to announce our keynote speaker for the VIP Sustainability Luncheon – Dr. Sarah Johnson, a leading expert in sustainable development and green finance. Dr. Johnson will share insights into the latest trends and innovations in sustainability, as well as practical strategies for businesses to integrate sustainability into their operations. Don\'t miss this exclusive opportunity to learn from a thought leader in the field!',0,1,17),(15,'Transportation Information','Please note that transportation to the eco-tour starting point will be provided from the Adelaide Nature Reserve Visitor Center. Shuttle buses will depart promptly at 1:45 PM, so we encourage participants to arrive early to ensure a smooth departure. Sit back, relax, and enjoy the scenic drive to our eco-adventure destination!',0,1,18),(16,'Workshop Schedule Update','We have added new workshops to the Melbourne Eco-Fair schedule! Join us for hands-on sessions on sustainable gardening, renewable energy, and eco-friendly lifestyle tips. Experts will share practical advice and insights to help you live more sustainably. Don\'t miss this opportunity to learn and connect with like-minded individuals!',1,2,19),(17,'Additional Workshop Details','In addition to tree planting, our Urban Tree Planting Workshop will feature demonstrations on tree maintenance and care. Participants will learn how to prune and mulch newly planted trees to ensure their healthy growth. Join us for a day of hands-on learning and contribute to the greening of Melbourne\'s urban landscape!',1,2,20),(18,'Participant Guidelines','Participants are advised to wear comfortable walking shoes and bring binoculars or cameras for wildlife observation. Our expert guides will provide fascinating insights into Melbourne\'s urban wildlife and their habitats. Get ready for an unforgettable wildlife adventure!',1,2,21),(19,'Speaker Announcement','We are pleased to announce our keynote speaker for the Corporate Green Sustainability Workshop – Dr. Emily Green, an environmental scientist specializing in corporate sustainability. Dr. Green will share her expertise and practical insights into developing effective sustainability strategies for businesses. Join us for an inspiring workshop aimed at driving positive change!',0,2,22),(20,'Special Menu Preview','Indulge in a gourmet dining experience featuring locally sourced, sustainably produced ingredients. Our gala dinner menu highlights seasonal flavors and celebrates the bounty of Victoria\'s local food producers. Join us for an evening of culinary delights and sustainable gastronomy!',0,2,23),(21,'Preparation Tips','Participants are encouraged to bring sturdy hiking shoes, insect repellent, and a refillable water bottle for the rainforest retreat. Our experienced guides will lead informative sessions on rainforest ecology and conservation efforts. Prepare for an unforgettable journey into the heart of Victoria\'s rainforests!',0,2,24),(22,'Cleanup Location Update','We have expanded the cleanup area to include additional sections of Sydney\'s coastline. Participants will have the opportunity to explore different beach areas and contribute to a wider cleanup effort. Join us for a day of coastal conservation and community bonding!',1,3,25),(23,'Tour Highlights','Discover hidden gems and fascinating plant species during our Sydney Botanical Garden Tour. Our expert guides will share insider knowledge and behind-the-scenes stories about the garden\'s history and conservation efforts. Join us for a memorable journey through Sydney\'s green oasis!',1,3,26),(24,'Additional Planting Instructions','Participants are encouraged to wear sunscreen, hats, and closed-toe shoes for the tree planting day. Our team will provide planting tools and guidance on proper planting techniques. Get ready to get your hands dirty and make a positive impact on Sydney\'s urban environment!',1,3,27),(25,'Workshop Agenda Update','We have added breakout sessions on sustainable procurement and waste management to the Corporate Sustainability Workshop agenda. Participants will have the opportunity to dive deeper into key sustainability topics and exchange ideas with industry peers. Join us for an informative and interactive workshop!',0,3,28),(26,'Speaker Announcement','We are excited to announce Dr. Emma Green as a keynote speaker for the VIP Environmental Summit. Dr. Green is a renowned environmental scientist and advocate for climate action. Join us for her inspiring keynote address and engage in meaningful discussions on the future of environmental sustainability!',0,3,29),(27,'Tour Itinerary Update','Our Members-Only Eco-Tour will now include a visit to Sydney\'s newest sustainability hub, where members can learn about cutting-edge green technologies and initiatives. Don\'t miss this exclusive opportunity to explore Sydney\'s sustainability initiatives!',0,3,30);
/*!40000 ALTER TABLE `EventUpdate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Manager`
--

DROP TABLE IF EXISTS `Manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Manager` (
  `manager_id` int NOT NULL AUTO_INCREMENT,
  `branch_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`manager_id`),
  KEY `branch_id` (`branch_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Manager_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `Branch` (`branch_id`) ON DELETE CASCADE,
  CONSTRAINT `Manager_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Manager`
--

LOCK TABLES `Manager` WRITE;
/*!40000 ALTER TABLE `Manager` DISABLE KEYS */;
INSERT INTO `Manager` VALUES (1,1,1),(2,2,3),(3,3,2);
/*!40000 ALTER TABLE `Manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notification`
--

DROP TABLE IF EXISTS `Notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `content` text,
  `status` varchar(30) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `Notification_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `Branch` (`branch_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notification`
--

LOCK TABLES `Notification` WRITE;
/*!40000 ALTER TABLE `Notification` DISABLE KEYS */;
INSERT INTO `Notification` VALUES (16,'Join us for a community tree planting event at Adelaide Park. Help us plant native trees to restore the local ecosystem and enhance green spaces in our city. No experience necessary – just bring your enthusiasm and a shovel! This event is part of our ongoing efforts to combat deforestation and promote environmental sustainability. Participants will have the opportunity to learn about tree planting techniques, the importance of biodiversity, and the role of trees in mitigating climate change. We\'ll provide all the necessary tools and guidance, along with refreshments and snacks to keep you energized throughout the day. Whether you\'re a seasoned gardener or a first-time tree planter, everyone is welcome to join us for a day of environmental stewardship and community bonding.','pending',1),(17,'Join us for an outdoor screening of thought-provoking documentaries about environmental conservation and the importance of trees. Bring your blanket and snacks and immerse yourself in stories that inspire positive change. This event aims to raise awareness about pressing environmental issues and ignite conversations about how we can collectively protect our planet. After the screening, we\'ll facilitate a discussion where attendees can share their thoughts and ideas for taking action in their communities. Together, let\'s harness the power of film to inspire positive environmental action and create a more sustainable future for all.','pending',1),(18,'Explore the beauty of Adelaide\'s natural environment on a guided nature walk. Learn about native tree species, their ecological significance, and how you can help protect them. This leisurely stroll through Adelaide Park offers a unique opportunity to connect with nature, observe local flora and fauna, and gain insights into the importance of biodiversity conservation. Our knowledgeable guides will share fascinating facts about the trees you encounter, their life cycles, and their roles in supporting diverse ecosystems. Bring your curiosity and your questions as we embark on a journey of discovery and appreciation for the natural world.','pending',1),(19,'A private team-building event for corporate groups focused on environmental stewardship. Engage in tree planting activities and eco-friendly initiatives to foster teamwork and environmental responsibility.','pending',1),(20,'An exclusive luncheon event for sustainability advocates and corporate partners. Discussions revolve around innovative solutions for sustainable land management, forest conservation, and green business practices.','pending',1),(21,'A members-only eco-tour of Adelaide\'s conservation areas and protected forests. Explore biodiverse ecosystems, learn about local flora and fauna, and gain insights into conservation challenges and solutions.','pending',1),(22,'We have updated the schedule for the tree planting sessions. There will be multiple sessions throughout the day, starting at 8:00 AM and continuing until 4:00 PM. Participants can choose the session that best fits their schedule. Additionally, we\'ll be providing guided tours of the park\'s indigenous plant species and their importance in the local ecosystem. Join us for a day filled with environmental education and hands-on conservation efforts!','pending',1),(23,'Due to popular demand, we have decided to extend the outdoor screening event to accommodate more attendees. The new venue for the screening is the Adelaide Park Amphitheater, which offers a larger seating capacity and better viewing experience. Don\'t miss this opportunity to enjoy thought-provoking documentaries under the stars!','pending',1),(24,'To enhance your nature walk experience, we recommend bringing a reusable water bottle and wearing comfortable hiking shoes. Our knowledgeable guides will provide binoculars and field guides for bird watching and tree identification. Get ready to immerse yourself in the beauty of Adelaide\'s natural environment and discover the wonders of biodiversity!','pending',1),(25,'Each participating corporate team will be assigned specific tree planting zones and tasks upon arrival. Team leaders will receive detailed instructions and safety guidelines for the activities. In addition to tree planting, teams will have the opportunity to participate in team-building exercises and environmental challenges. Let\'s work together to strengthen teamwork and promote environmental stewardship!','pending',1),(26,'We are thrilled to announce our keynote speaker for the VIP Sustainability Luncheon – Dr. Sarah Johnson, a leading expert in sustainable development and green finance. Dr. Johnson will share insights into the latest trends and innovations in sustainability, as well as practical strategies for businesses to integrate sustainability into their operations. Don\'t miss this exclusive opportunity to learn from a thought leader in the field!','pending',1),(27,'Please note that transportation to the eco-tour starting point will be provided from the Adelaide Nature Reserve Visitor Center. Shuttle buses will depart promptly at 1:45 PM, so we encourage participants to arrive early to ensure a smooth departure. Sit back, relax, and enjoy the scenic drive to our eco-adventure destination!','pending',1);
/*!40000 ALTER TABLE `Notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NotificationSubscription`
--

DROP TABLE IF EXISTS `NotificationSubscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NotificationSubscription` (
  `subscription_id` int NOT NULL AUTO_INCREMENT,
  `subscribed_event` tinyint(1) DEFAULT NULL,
  `subscribed_update` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`subscription_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NotificationSubscription`
--

LOCK TABLES `NotificationSubscription` WRITE;
/*!40000 ALTER TABLE `NotificationSubscription` DISABLE KEYS */;
INSERT INTO `NotificationSubscription` VALUES (1,1,1),(2,1,0),(3,0,0),(4,0,1),(5,1,1),(6,1,1),(7,1,0),(8,0,0),(9,0,1),(10,1,1),(11,1,1),(12,1,1);
/*!40000 ALTER TABLE `NotificationSubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UpdateNotification`
--

DROP TABLE IF EXISTS `UpdateNotification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UpdateNotification` (
  `update_notification_id` int NOT NULL AUTO_INCREMENT,
  `notification_id` int DEFAULT NULL,
  `update_id` int DEFAULT NULL,
  PRIMARY KEY (`update_notification_id`),
  KEY `notification_id` (`notification_id`),
  KEY `update_id` (`update_id`),
  CONSTRAINT `UpdateNotification_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `Notification` (`notification_id`) ON DELETE CASCADE,
  CONSTRAINT `UpdateNotification_ibfk_2` FOREIGN KEY (`update_id`) REFERENCES `EventUpdate` (`update_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UpdateNotification`
--

LOCK TABLES `UpdateNotification` WRITE;
/*!40000 ALTER TABLE `UpdateNotification` DISABLE KEYS */;
INSERT INTO `UpdateNotification` VALUES (10,22,10),(11,23,11),(12,24,12),(13,25,13),(14,26,14),(15,27,15);
/*!40000 ALTER TABLE `UpdateNotification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(16) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `password` varchar(256) DEFAULT NULL,
  `access_token` varchar(256) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'Phong','Tran','phong@gmail.com','0123456789','Male','phong123','token1','2004-12-09'),(2,'Nguyen','Mai','nguyen@gmail.com','0987654321','Male','nguyen123','token2','2005-01-01'),(3,'Khanh','Nguyen','khanh@gmail.com','0135792468','Male','khanh123','token3','2005-01-01'),(4,'Bach','Tran','bach@gmail.com','0246813579','Gay','bach123','token4','2005-01-01'),(5,'Alice','Johnson','alice.johnson@example.com','234-567-8901','Female','password789','token789','1985-03-03'),(6,'Bob','Williams','bob.williams@example.com','345-678-9012','Male','password101','token101','1978-04-04'),(7,'Charlie','Brown','charlie.brown@example.com','456-789-0123','Male','password112','token112','1992-05-05'),(8,'Diana','Miller','diana.miller@example.com','567-890-1234','Female','password1234','token1234','1988-06-06'),(9,'John','Doe','john.doe@example.com','1234567890','Male','hashedpassword','someaccesstoken','1980-01-01'),(12,'Bob','Brown','bob.brown@example.com','2223334444','Male','hashedpassword3','accesstoken3','1975-07-10'),(13,'Charlie','Davis','charlie.davis@example.com','3334445555','Non-binary','hashedpassword4','accesstoken4','2000-12-25'),(14,'Emily','Wilson','emily.wilson@example.com','4445556666','Female','hashedpassword5','accesstoken5','1995-05-05'),(15,'David','Martin','david.martin@example.com','5556667777','Male','hashedpassword6','accesstoken6','1982-11-30'),(16,'Duc','Kieu','duc@gmail.com','0696969696','Male','Duc123','token69','2005-09-06');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Volunteer`
--

DROP TABLE IF EXISTS `Volunteer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Volunteer` (
  `volunteer_id` int NOT NULL AUTO_INCREMENT,
  `is_subscribed_notis` tinyint(1) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `subscription_id` int DEFAULT NULL,
  PRIMARY KEY (`volunteer_id`),
  KEY `branch_id` (`branch_id`),
  KEY `user_id` (`user_id`),
  KEY `subscription_id` (`subscription_id`),
  CONSTRAINT `Volunteer_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `Branch` (`branch_id`) ON DELETE CASCADE,
  CONSTRAINT `Volunteer_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `Volunteer_ibfk_3` FOREIGN KEY (`subscription_id`) REFERENCES `NotificationSubscription` (`subscription_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Volunteer`
--

LOCK TABLES `Volunteer` WRITE;
/*!40000 ALTER TABLE `Volunteer` DISABLE KEYS */;
INSERT INTO `Volunteer` VALUES (4,1,1,5,1),(5,1,2,6,2),(6,0,3,7,3),(7,1,3,8,4),(8,1,1,9,5),(10,1,2,13,7),(11,0,2,14,8),(12,1,3,15,9),(13,1,2,16,10),(14,1,3,16,11);
/*!40000 ALTER TABLE `Volunteer` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-12  9:23:19
