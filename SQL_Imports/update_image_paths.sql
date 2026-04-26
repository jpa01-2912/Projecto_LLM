USE tienda;

UPDATE aplicaciones
SET imagen = CASE imagen
  WHEN './fotos/aplicaciones/nintendoStoreApp.jpg' THEN './fotos/aplicaciones/nintendo-store-app.jpg'
  WHEN './fotos/aplicaciones/nintendoToday.jpg' THEN './fotos/aplicaciones/nintendo-today.jpg'
  WHEN './fotos/aplicaciones/nintendoMusic.jpg' THEN './fotos/aplicaciones/nintendo-music.jpg'
  WHEN './fotos/aplicaciones/fireEmblem.jpg' THEN './fotos/aplicaciones/fire-emblem.jpg'
  ELSE imagen
END;

UPDATE carrousel
SET url = CASE url
  WHEN './fotos/Carrousel/MarioTennis.jpg' THEN './fotos/Carrousel/mario-tennis.jpg'
  WHEN './fotos/Carrousel/TomodachiLive.jpg' THEN './fotos/Carrousel/tomodachi-live.jpg'
  WHEN './fotos/Carrousel/Pokopia.jpg' THEN './fotos/Carrousel/pokopia.jpg'
  WHEN './fotos/Carrousel/animalCrossing.jpg' THEN './fotos/Carrousel/animal-crossing.jpg'
  WHEN './fotos/Carrousel/animalcrossing.jpg' THEN './fotos/Carrousel/animal-crossing.jpg'
  ELSE url
END;

UPDATE juegos
SET imagen = CASE imagen
  WHEN './fotos/juegos/ResidentEvilRequiem.jpg' THEN './fotos/juegos/resident-evil-requiem.jpg'
  WHEN './fotos/juegos/DragonQuest.jpg' THEN './fotos/juegos/dragon-quest.jpg'
  WHEN './fotos/juegos/MonsterHunte.jpg' THEN './fotos/juegos/monster-hunte.jpg'
  WHEN './fotos/juegos/MarioKartWorld.jpg' THEN './fotos/juegos/mario-kart-world.jpg'
  ELSE imagen
END;

UPDATE myNintendoStore
SET imagen = CASE imagen
  WHEN './fotos/MyNintendoStore/Pokopia.jpg' THEN './fotos/MyNintendoStore/pokopia.jpg'
  WHEN './fotos/MyNintendoStore/ACNH_COLLECTION_LOGO.jpg' THEN './fotos/MyNintendoStore/acnh-collection-logo.jpg'
  WHEN './fotos/MyNintendoStore/TomodachiLifeLTD.jpg' THEN './fotos/MyNintendoStore/tomodachi-life-ltd.jpg'
  WHEN './fotos/MyNintendoStore/SuperMarioBros40thTShirt.jpg' THEN './fotos/MyNintendoStore/super-mario-bros-40th-t-shirt.jpg'
  ELSE imagen
END;

UPDATE novedades
SET principal = REPLACE(principal, './fotos/Novedades/tomodachi_desarrolladores.jpg', './fotos/Novedades/tomodachi-desarrolladores.jpg'),
    secundarias = REPLACE(secundarias, './fotos/Novedades/HumanFallFlat.jpg', './fotos/Novedades/human-fall-flat.jpg'),
    secundarias = REPLACE(secundarias, './fotos/Novedades/kirby_air_raider.jpg', './fotos/Novedades/kirby-air-raider.jpg'),
    secundarias = REPLACE(secundarias, './fotos/Novedades/RythmParadiseGroove.jpg', './fotos/Novedades/rythm-paradise-groove.jpg'),
    secundarias = REPLACE(secundarias, './fotos/Novedades/NSO_NES.jpg', './fotos/Novedades/nso-nes.jpg');
