
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Types adaptés pour l'API IGDB
export interface Game {
  id: number;
  name: string;
  background_image: string;
  released: string;
  metacritic: number | null;
  genres: { id: number; name: string }[];
  platforms: { platform: { id: number; name: string } }[];
  description_raw?: string;
  developers?: { id: number; name: string }[];
  publishers?: { id: number; name: string }[];
  tags?: { id: number; name: string }[];
  esrb_rating?: { id: number; name: string } | null;
}

interface FetchGamesParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

// API mock pour remplacer l'API RAWG qui ne fonctionne pas
// Ces données sont fournies en statique pour éviter les problèmes d'API
const mockGames: Game[] = [
  {
    id: 1,
    name: "The Witcher 3: Wild Hunt",
    background_image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
    released: "2015-05-18",
    metacritic: 92,
    genres: [
      { id: 4, name: "Action" },
      { id: 5, name: "RPG" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } },
      { platform: { id: 7, name: "Nintendo Switch" } }
    ],
    description_raw: "The Witcher 3: Wild Hunt est un RPG en monde ouvert dans un univers dark fantasy. Vous incarnez Geralt de Riv, un chasseur de monstres professionnel chargé de retrouver Ciri, la fille de l'empereur, tout en affrontant la Chasse Sauvage qui menace le monde.",
    developers: [{ id: 1, name: "CD Projekt Red" }],
    publishers: [{ id: 1, name: "CD Projekt" }],
    tags: [
      { id: 1, name: "Fantasy" },
      { id: 2, name: "Open World" },
      { id: 3, name: "Story Rich" }
    ],
    esrb_rating: { id: 4, name: "Mature" }
  },
  {
    id: 2,
    name: "Grand Theft Auto V",
    background_image: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
    released: "2013-09-17",
    metacritic: 96,
    genres: [
      { id: 4, name: "Action" },
      { id: 3, name: "Adventure" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } },
      { platform: { id: 4, name: "PlayStation 3" } },
      { platform: { id: 5, name: "Xbox 360" } },
      { platform: { id: 8, name: "PlayStation 5" } },
      { platform: { id: 9, name: "Xbox Series X/S" } }
    ],
    description_raw: "Grand Theft Auto V est un jeu d'action-aventure en monde ouvert où vous incarnez trois protagonistes criminels dans la ville fictive de Los Santos. Vous pouvez alterner entre les personnages pour vivre une histoire entrelacée riche en braquages et en missions.",
    developers: [{ id: 2, name: "Rockstar North" }],
    publishers: [{ id: 2, name: "Rockstar Games" }],
    tags: [
      { id: 4, name: "Open World" },
      { id: 5, name: "Crime" },
      { id: 6, name: "Action" }
    ],
    esrb_rating: { id: 4, name: "Mature" }
  },
  {
    id: 3,
    name: "Portal 2",
    background_image: "https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg",
    released: "2011-04-19",
    metacritic: 95,
    genres: [
      { id: 7, name: "Puzzle" },
      { id: 3, name: "Adventure" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 4, name: "PlayStation 3" } },
      { platform: { id: 5, name: "Xbox 360" } }
    ],
    description_raw: "Portal 2 est un jeu de puzzle à la première personne où vous utilisez un 'Portal Gun' pour créer des portails interdimensionnels et résoudre des énigmes complexes. Le jeu alterne entre gameplay solo avec Chell et mode coopératif avec Atlas et P-Body.",
    developers: [{ id: 3, name: "Valve" }],
    publishers: [{ id: 3, name: "Valve" }],
    tags: [
      { id: 7, name: "Puzzle" },
      { id: 8, name: "First-Person" },
      { id: 9, name: "Sci-fi" }
    ],
    esrb_rating: { id: 3, name: "Everyone 10+" }
  },
  {
    id: 4,
    name: "The Legend of Zelda: Breath of the Wild",
    background_image: "https://media.rawg.io/media/games/cc1/cc196a57730cb7062cf182a1a359f269.jpg",
    released: "2017-03-03",
    metacritic: 97,
    genres: [
      { id: 4, name: "Action" },
      { id: 3, name: "Adventure" },
      { id: 5, name: "RPG" }
    ],
    platforms: [
      { platform: { id: 7, name: "Nintendo Switch" } },
      { platform: { id: 10, name: "Wii U" } }
    ],
    description_raw: "The Legend of Zelda: Breath of the Wild est un jeu d'action-aventure en monde ouvert où vous incarnez Link, qui se réveille d'un sommeil de 100 ans pour découvrir un royaume d'Hyrule dévasté. Vous devez explorer le vaste monde, récupérer vos souvenirs et affronter Ganon pour sauver le royaume.",
    developers: [{ id: 4, name: "Nintendo" }],
    publishers: [{ id: 4, name: "Nintendo" }],
    tags: [
      { id: 10, name: "Open World" },
      { id: 11, name: "Adventure" },
      { id: 12, name: "Fantasy" }
    ],
    esrb_rating: { id: 2, name: "Everyone 10+" }
  },
  {
    id: 5,
    name: "Red Dead Redemption 2",
    background_image: "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
    released: "2018-10-26",
    metacritic: 97,
    genres: [
      { id: 4, name: "Action" },
      { id: 3, name: "Adventure" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } }
    ],
    description_raw: "Red Dead Redemption 2 est un jeu d'action-aventure western en monde ouvert. Vous incarnez Arthur Morgan, un hors-la-loi membre du gang Van der Linde, dans une Amérique de 1899 en pleine mutation. Le jeu explore des thèmes de loyauté, de survie et d'adaptation à un monde qui rejette progressivement le mode de vie des hors-la-loi.",
    developers: [{ id: 5, name: "Rockstar Games" }],
    publishers: [{ id: 2, name: "Rockstar Games" }],
    tags: [
      { id: 13, name: "Open World" },
      { id: 14, name: "Western" },
      { id: 15, name: "Story Rich" }
    ],
    esrb_rating: { id: 4, name: "Mature" }
  },
  {
    id: 6,
    name: "Minecraft",
    background_image: "https://media.rawg.io/media/games/b4e/b4e4c73d5aa4ec66bbf75375c4847a2b.jpg",
    released: "2011-11-18",
    metacritic: 93,
    genres: [
      { id: 4, name: "Action" },
      { id: 3, name: "Adventure" },
      { id: 10, name: "Simulation" },
      { id: 51, name: "Indie" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } },
      { platform: { id: 7, name: "Nintendo Switch" } },
      { platform: { id: 8, name: "PlayStation 5" } },
      { platform: { id: 9, name: "Xbox Series X/S" } }
    ],
    description_raw: "Minecraft est un jeu sandbox de type 'bac à sable' qui permet aux joueurs de construire des structures avec des blocs cubiques dans un monde généré procéduralement. Les joueurs peuvent explorer, récolter des ressources, combattre des monstres et créer pratiquement tout ce qu'ils peuvent imaginer.",
    developers: [{ id: 6, name: "Mojang Studios" }],
    publishers: [{ id: 5, name: "Microsoft Studios" }],
    tags: [
      { id: 16, name: "Sandbox" },
      { id: 17, name: "Survival" },
      { id: 18, name: "Building" }
    ],
    esrb_rating: { id: 1, name: "Everyone" }
  },
  {
    id: 7,
    name: "Counter-Strike 2",
    background_image: "https://media.rawg.io/media/games/5eb/5eb49eb2fa0738fdb5bacea557b1bc57.jpg",
    released: "2023-09-27",
    metacritic: 90,
    genres: [
      { id: 2, name: "Shooter" },
      { id: 4, name: "Action" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } }
    ],
    description_raw: "Counter-Strike 2 est un jeu de tir à la première personne compétitif où deux équipes, les terroristes et les anti-terroristes, s'affrontent dans différents modes de jeu. Le jeu met l'accent sur la stratégie d'équipe, la précision et la connaissance des cartes pour remporter la victoire.",
    developers: [{ id: 3, name: "Valve" }],
    publishers: [{ id: 3, name: "Valve" }],
    tags: [
      { id: 19, name: "FPS" },
      { id: 20, name: "Competitive" },
      { id: 21, name: "Team-Based" }
    ],
    esrb_rating: { id: 4, name: "Mature" }
  },
  {
    id: 8,
    name: "Elden Ring",
    background_image: "https://media.rawg.io/media/games/5ec/5ecac5cb026ec26a56efcc546364e348.jpg",
    released: "2022-02-25",
    metacritic: 96,
    genres: [
      { id: 4, name: "Action" },
      { id: 5, name: "RPG" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } },
      { platform: { id: 8, name: "PlayStation 5" } },
      { platform: { id: 9, name: "Xbox Series X/S" } }
    ],
    description_raw: "Elden Ring est un jeu d'action-RPG développé par FromSoftware et publié par Bandai Namco. Créé en collaboration avec George R. R. Martin, l'auteur de Game of Thrones, le jeu se déroule dans un monde fantastique appelé l'Entre-terre. Vous incarnez un Sans-éclat à la recherche du Cercle d'Elden brisé, tout en affrontant des boss légendaires.",
    developers: [{ id: 7, name: "FromSoftware" }],
    publishers: [{ id: 7, name: "Bandai Namco" }],
    tags: [
      { id: 22, name: "Dark Fantasy" },
      { id: 23, name: "Souls-like" },
      { id: 24, name: "Open World" }
    ],
    esrb_rating: { id: 4, name: "Mature" }
  },
  {
    id: 9,
    name: "Super Mario Odyssey",
    background_image: "https://media.rawg.io/media/games/267/267bd0dbc496f52692487d07d014c061.jpg",
    released: "2017-10-27",
    metacritic: 97,
    genres: [
      { id: 4, name: "Action" },
      { id: 83, name: "Platformer" }
    ],
    platforms: [
      { platform: { id: 7, name: "Nintendo Switch" } }
    ],
    description_raw: "Super Mario Odyssey est un jeu de plateforme 3D où Mario doit sauver la princesse Peach des griffes de Bowser, qui prévoit de l'épouser contre son gré. Mario s'allie avec Cappy, un esprit qui habite sa casquette, lui permettant de capturer et de contrôler différentes créatures et objets pour progresser à travers divers royaumes.",
    developers: [{ id: 4, name: "Nintendo" }],
    publishers: [{ id: 4, name: "Nintendo" }],
    tags: [
      { id: 25, name: "3D Platformer" },
      { id: 26, name: "Colorful" },
      { id: 27, name: "Exploration" }
    ],
    esrb_rating: { id: 1, name: "Everyone" }
  },
  {
    id: 10,
    name: "God of War",
    background_image: "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg",
    released: "2018-04-20",
    metacritic: 94,
    genres: [
      { id: 4, name: "Action" },
      { id: 3, name: "Adventure" },
      { id: 5, name: "RPG" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } }
    ],
    description_raw: "God of War est un jeu d'action-aventure qui réinvente la saga de Kratos. Après avoir pris sa vengeance contre les dieux de l'Olympe, Kratos vit désormais dans le royaume nordique de Midgard avec son fils Atreus. Le jeu suit leur voyage pour répandre les cendres de la défunte épouse de Kratos au sommet de la plus haute montagne des neuf royaumes.",
    developers: [{ id: 8, name: "Santa Monica Studio" }],
    publishers: [{ id: 8, name: "Sony Interactive Entertainment" }],
    tags: [
      { id: 28, name: "Norse Mythology" },
      { id: 29, name: "Story Rich" },
      { id: 30, name: "Action-Adventure" }
    ],
    esrb_rating: { id: 4, name: "Mature" }
  },
  {
    id: 11,
    name: "Hollow Knight",
    background_image: "https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg",
    released: "2017-02-24",
    metacritic: 90,
    genres: [
      { id: 4, name: "Action" },
      { id: 3, name: "Adventure" },
      { id: 83, name: "Platformer" },
      { id: 51, name: "Indie" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } },
      { platform: { id: 7, name: "Nintendo Switch" } }
    ],
    description_raw: "Hollow Knight est un jeu d'action-aventure en 2D de type metroidvania. Vous incarnez le Chevalier, une créature insectoïde explorant le royaume souterrain abandonné de Hallownest. Avec un style artistique dessiné à la main et une bande sonore atmosphérique, le jeu vous invite à découvrir des secrets, combattre des boss et dévoiler l'histoire mystérieuse du royaume.",
    developers: [{ id: 9, name: "Team Cherry" }],
    publishers: [{ id: 9, name: "Team Cherry" }],
    tags: [
      { id: 31, name: "Metroidvania" },
      { id: 32, name: "Dark" },
      { id: 33, name: "Atmospheric" }
    ],
    esrb_rating: { id: 2, name: "Everyone 10+" }
  },
  {
    id: 12,
    name: "Hades",
    background_image: "https://media.rawg.io/media/games/1f4/1f47a270b8f241e4676b14d39ec620f7.jpg",
    released: "2020-09-17",
    metacritic: 93,
    genres: [
      { id: 4, name: "Action" },
      { id: 5, name: "RPG" },
      { id: 51, name: "Indie" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } },
      { platform: { id: 7, name: "Nintendo Switch" } },
      { platform: { id: 8, name: "PlayStation 5" } },
      { platform: { id: 9, name: "Xbox Series X/S" } }
    ],
    description_raw: "Hades est un jeu d'action roguelike où vous incarnez Zagreus, fils du dieu Hadès, tentant de s'échapper des Enfers. Chaque tentative d'évasion est unique, avec des combinaisons d'armes et de pouvoirs différentes. Le jeu mêle combat intense et narration riche, avec des dialogues qui évoluent en fonction de vos échecs et réussites.",
    developers: [{ id: 10, name: "Supergiant Games" }],
    publishers: [{ id: 10, name: "Supergiant Games" }],
    tags: [
      { id: 34, name: "Roguelike" },
      { id: 35, name: "Greek Mythology" },
      { id: 36, name: "Action Roguelike" }
    ],
    esrb_rating: { id: 3, name: "Teen" }
  },
  {
    id: 13,
    name: "Cyberpunk 2077",
    background_image: "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg",
    released: "2020-12-10",
    metacritic: 86,
    genres: [
      { id: 4, name: "Action" },
      { id: 5, name: "RPG" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } },
      { platform: { id: 8, name: "PlayStation 5" } },
      { platform: { id: 9, name: "Xbox Series X/S" } }
    ],
    description_raw: "Cyberpunk 2077 est un RPG d'action en monde ouvert qui se déroule à Night City, une mégalopole obsédée par le pouvoir, la séduction et les modifications corporelles. Vous incarnez V, un mercenaire hors-la-loi à la recherche d'un implant unique qui serait la clé de l'immortalité.",
    developers: [{ id: 1, name: "CD Projekt Red" }],
    publishers: [{ id: 1, name: "CD Projekt" }],
    tags: [
      { id: 37, name: "Cyberpunk" },
      { id: 38, name: "Open World" },
      { id: 39, name: "First-Person" }
    ],
    esrb_rating: { id: 4, name: "Mature" }
  },
  {
    id: 14,
    name: "Mass Effect: Legendary Edition",
    background_image: "https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg",
    released: "2021-05-14",
    metacritic: 90,
    genres: [
      { id: 4, name: "Action" },
      { id: 5, name: "RPG" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } }
    ],
    description_raw: "Mass Effect: Legendary Edition est une collection remastérisée de la trilogie Mass Effect originale. Vous incarnez le Commandant Shepard, un soldat d'élite qui doit unir la galaxie contre une menace ancestrale connue sous le nom de Moissonneurs. La collection inclut tous les DLC solo et des améliorations graphiques.",
    developers: [{ id: 11, name: "BioWare" }],
    publishers: [{ id: 12, name: "Electronic Arts" }],
    tags: [
      { id: 40, name: "Sci-fi" },
      { id: 41, name: "Space" },
      { id: 42, name: "Story Rich" }
    ],
    esrb_rating: { id: 4, name: "Mature" }
  },
  {
    id: 15,
    name: "Persona 5 Royal",
    background_image: "https://media.rawg.io/media/games/a9c/a9c789951de65da545d51f664b4f2ce0.jpg",
    released: "2020-03-31",
    metacritic: 95,
    genres: [
      { id: 5, name: "RPG" },
      { id: 10, name: "Simulation" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } },
      { platform: { id: 7, name: "Nintendo Switch" } },
      { platform: { id: 8, name: "PlayStation 5" } },
      { platform: { id: 9, name: "Xbox Series X/S" } }
    ],
    description_raw: "Persona 5 Royal est un JRPG où vous incarnez un lycéen japonais qui découvre le pouvoir d'entrer dans le monde cognitif des gens. Avec vos camarades, vous formez les Voleurs Fantômes pour changer le cœur des adultes corrompus tout en gérant votre vie quotidienne d'étudiant.",
    developers: [{ id: 13, name: "Atlus" }],
    publishers: [{ id: 13, name: "Atlus" }],
    tags: [
      { id: 43, name: "JRPG" },
      { id: 44, name: "Turn-Based" },
      { id: 45, name: "Stylish" }
    ],
    esrb_rating: { id: 4, name: "Mature" }
  },
  {
    id: 16,
    name: "Death Stranding",
    background_image: "https://media.rawg.io/media/games/2ad/2ad87a4a69b1104f02435c14c5196095.jpg",
    released: "2019-11-08",
    metacritic: 86,
    genres: [
      { id: 4, name: "Action" },
      { id: 3, name: "Adventure" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 8, name: "PlayStation 5" } }
    ],
    description_raw: "Death Stranding est un jeu d'action-aventure qui se déroule dans un monde post-apocalyptique où des explosions mystérieuses ont provoqué des phénomènes surnaturels. Vous incarnez Sam Porter Bridges, un coursier qui traverse l'Amérique en ruine pour reconnecter des villes isolées et apporter l'espoir à l'humanité fragmentée.",
    developers: [{ id: 14, name: "Kojima Productions" }],
    publishers: [{ id: 8, name: "Sony Interactive Entertainment" }],
    tags: [
      { id: 46, name: "Post-Apocalyptic" },
      { id: 47, name: "Walking Simulator" },
      { id: 48, name: "Surreal" }
    ],
    esrb_rating: { id: 4, name: "Mature" }
  },
  {
    id: 17,
    name: "Disco Elysium",
    background_image: "https://media.rawg.io/media/games/840/8408ad3811289a6a5830cae60fb0b62a.jpg",
    released: "2019-10-15",
    metacritic: 91,
    genres: [
      { id: 5, name: "RPG" },
      { id: 3, name: "Adventure" },
      { id: 51, name: "Indie" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } },
      { platform: { id: 7, name: "Nintendo Switch" } },
      { platform: { id: 8, name: "PlayStation 5" } },
      { platform: { id: 9, name: "Xbox Series X/S" } }
    ],
    description_raw: "Disco Elysium est un RPG narratif où vous incarnez un détective amnésique enquêtant sur un meurtre dans la ville de Revachol. Le jeu se distingue par son système de dialogue élaboré, son monde richement détaillé et ses thèmes philosophiques et politiques. Il n'y a pas de combat traditionnel ; toutes les interactions passent par des jets de dés et des dialogues.",
    developers: [{ id: 15, name: "ZA/UM" }],
    publishers: [{ id: 15, name: "ZA/UM" }],
    tags: [
      { id: 49, name: "Detective" },
      { id: 50, name: "Political" },
      { id: 51, name: "Philosophical" }
    ],
    esrb_rating: { id: 4, name: "Mature" }
  },
  {
    id: 18,
    name: "Fortnite",
    background_image: "https://media.rawg.io/media/games/dcb/dcbb67f371a9a28ea38ffd73ee0f53f3.jpg",
    released: "2017-07-25",
    metacritic: 83,
    genres: [
      { id: 4, name: "Action" },
      { id: 2, name: "Shooter" },
      { id: 10, name: "Survival" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } },
      { platform: { id: 7, name: "Nintendo Switch" } },
      { platform: { id: 8, name: "PlayStation 5" } },
      { platform: { id: 9, name: "Xbox Series X/S" } },
      { platform: { id: 11, name: "Android" } },
      { platform: { id: 12, name: "iOS" } }
    ],
    description_raw: "Fortnite est un jeu de tir et de survie en multijoueur où 100 joueurs s'affrontent pour être le dernier survivant. Le jeu combine construction, exploration et combat dans différents modes de jeu, dont le populaire Battle Royale.",
    developers: [{ id: 16, name: "Epic Games" }],
    publishers: [{ id: 16, name: "Epic Games" }],
    tags: [
      { id: 52, name: "Battle Royale" },
      { id: 53, name: "Building" },
      { id: 54, name: "Third-Person Shooter" }
    ],
    esrb_rating: { id: 3, name: "Teen" }
  },
  {
    id: 19,
    name: "Stardew Valley",
    background_image: "https://media.rawg.io/media/games/713/713269608dc8f2f40f5a670a14b2de94.jpg",
    released: "2016-02-26",
    metacritic: 89,
    genres: [
      { id: 5, name: "RPG" },
      { id: 10, name: "Simulation" },
      { id: 51, name: "Indie" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } },
      { platform: { id: 7, name: "Nintendo Switch" } },
      { platform: { id: 11, name: "Android" } },
      { platform: { id: 12, name: "iOS" } }
    ],
    description_raw: "Stardew Valley est un jeu de simulation de ferme où vous héritez de la vieille ferme de votre grand-père dans la vallée de Stardew. Cultivez des récoltes, élevez des animaux, fabriquez des objets, explorez des mines, rencontrez les habitants de la ville et établissez des relations, tout en restaurant votre ferme à sa gloire d'antan.",
    developers: [{ id: 17, name: "ConcernedApe" }],
    publishers: [{ id: 17, name: "ConcernedApe" }],
    tags: [
      { id: 55, name: "Farming" },
      { id: 56, name: "Life Sim" },
      { id: 57, name: "Pixel Graphics" }
    ],
    esrb_rating: { id: 1, name: "Everyone" }
  },
  {
    id: 20,
    name: "Doom Eternal",
    background_image: "https://media.rawg.io/media/games/3ea/3ea3c9bbd940b6cb7f2139e42d3d443f.jpg",
    released: "2020-03-20",
    metacritic: 88,
    genres: [
      { id: 4, name: "Action" },
      { id: 2, name: "Shooter" }
    ],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 2, name: "PlayStation 4" } },
      { platform: { id: 3, name: "Xbox One" } },
      { platform: { id: 7, name: "Nintendo Switch" } },
      { platform: { id: 8, name: "PlayStation 5" } },
      { platform: { id: 9, name: "Xbox Series X/S" } }
    ],
    description_raw: "DOOM Eternal est un jeu de tir à la première personne ultra-rapide et brutal où vous incarnez le Slayer, un guerrier légendaire combattant les forces démoniaques de l'Enfer qui ont envahi la Terre. Équipé d'un arsenal dévastateur et de nouvelles capacités de mouvement, vous devez 'déchirer et déchiqueter' à travers des niveaux intenses.",
    developers: [{ id: 18, name: "id Software" }],
    publishers: [{ id: 19, name: "Bethesda Softworks" }],
    tags: [
      { id: 58, name: "FPS" },
      { id: 59, name: "Fast-Paced" },
      { id: 60, name: "Gore" }
    ],
    esrb_rating: { id: 4, name: "Mature" }
  }
];

// Ajouter plus de jeux fictifs pour avoir un total de 60 jeux (simuler 3 pages)
const generateMoreGames = () => {
  const moreGames: Game[] = [];
  for (let i = 21; i <= 60; i++) {
    // Copier et modifier un jeu existant
    const sourceGame = mockGames[i % 20];
    moreGames.push({
      ...sourceGame,
      id: i,
      name: `${sourceGame.name} - Edition ${Math.floor(i / 20) + 1}`,
    });
  }
  return moreGames;
};

const allMockGames = [...mockGames, ...generateMoreGames()];

export const useGames = (params: FetchGamesParams = {}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { search = '', page = 1, pageSize = 20 } = params;
        
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filtrer les jeux par recherche
        let filteredGames = allMockGames;
        if (search) {
          const searchLower = search.toLowerCase();
          filteredGames = allMockGames.filter(game => 
            game.name.toLowerCase().includes(searchLower)
          );
        }
        
        // Calculer le nombre total
        const totalCount = filteredGames.length;
        
        // Pagination
        const startIndex = (page - 1) * pageSize;
        const paginatedGames = filteredGames.slice(startIndex, startIndex + pageSize);
        
        setGames(paginatedGames);
        setCount(totalCount);
      } catch (err) {
        console.error('Erreur lors de la récupération des jeux:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les jeux. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [params.search, params.page, params.pageSize, toast]);

  return { games, isLoading, error, count };
};

export const useGameDetails = (gameId: number | null) => {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Ne rien faire si gameId est null
    if (gameId === null) return;

    const fetchGameDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Trouver le jeu par ID
        const foundGame = allMockGames.find(game => game.id === gameId);
        
        if (!foundGame) {
          throw new Error("Jeu non trouvé");
        }
        
        setGame(foundGame);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails du jeu:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les détails du jeu. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId, toast]);

  return { game, isLoading, error };
};
