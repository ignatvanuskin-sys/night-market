CREATE TABLE `order_intents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`idempotencyKey` varchar(96) NOT NULL,
	`status` enum('prepared','opened','confirmed','cancelled') NOT NULL DEFAULT 'prepared',
	`currency` varchar(3) NOT NULL,
	`region` varchar(32) NOT NULL,
	`subtotal` int NOT NULL,
	`discountedSubtotal` int NOT NULL,
	`shipping` int NOT NULL,
	`total` int NOT NULL,
	`linesJson` text NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `order_intents_id` PRIMARY KEY(`id`),
	CONSTRAINT `order_intents_idempotencyKey_unique` UNIQUE(`idempotencyKey`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
