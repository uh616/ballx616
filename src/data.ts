interface Evolution {
  result: string;
  components: string[];
  resultImage?: string;
}

interface Item {
  name: string;
  image: string;
  description?: string;
  evolutions?: Evolution[];
  tier?: 'S' | 'A' | 'B' | 'C';
}

// Helper function to get local image path
function getLocalImage(name: string, type: 'balls' | 'passives'): string {
  const BASE = (import.meta as any).env.BASE_URL || '/';

  // Маппинг названий для новых .png файлов (формат: Name.png вместо Name_Ball.webp)
  const nameToPngFile: Record<string, string> = {
    // Базовые шары
    'Assassin': 'Assassin',
    'Banished Flame': 'Banished_Flame',
    'Berserk': 'Berserk',
    'Black Hole': 'Black_Hole',
    'Bleed': 'Bleed',
    'Blizzard': 'Blizzard',
    'Bomb': 'Bomb',
    'Brimstone': 'Brimstone',
    'Brood Mother': 'Brood_Mother',
    'Burn': 'Burn',
    'Catapult': 'Catapult',
    'Cell': 'Cell',
    'Charm': 'Charm',
    'Dark': 'Dark',
    'Earthquake': 'Earthquake',
    'Egg Sac': 'Egg_Sac',
    'Fireworks': 'Fireworks',
    'Flash': 'Flash',
    'Flicker': 'Flicker',
    'Freeze': 'Freeze',
    'Freeze Ray': 'Freeze_Ray',
    'Frozen Flame': 'Frozen_Flame',
    'Ghost': 'Ghost',
    'Glacier': 'Glacier',
    'Hemorrhage': 'Hemorrhage',
    'Holy Laser': 'Holy_Laser',
    'Incubus': 'Incubus',
    'Inferno': 'Inferno',
    'Iron': 'Iron',
    'Landslide': 'Landslide',
    'Laser (Horizontal)': 'Laser_Horizontal',
    'Laser (Vertical)': 'Laser_Vertical',
    'Laser Beam': 'Laser_Beam',
    'Laser Cutter': 'Laser_Cutter',
    'Leech': 'Leech',
    'Light': 'Light',
    'Lightning': 'Lightning',
    'Lightning Rod': 'Lightning_Rod',
    'Lovestruck': 'Lovestruck',
    'Maggot': 'Maggot',
    'Magma': 'Magma',
    'Mosquito King': 'Mosquito_King',
    'Mosquito Swarm': 'Mosquito_Swarm',
    'Nosferatu': 'Nosferatu',
    'Noxious': 'Noxious',
    'Nuclear Bomb': 'Nuclear_Bomb',
    'Overgrowth': 'Overgrowth',
    'Phantom': 'Phantom',
    'Poison': 'Poison',
    'Radiation Beam': 'Radiation_Beam',
    'Sacrifice': 'Sacrifice',
    'Sandstorm': 'Sandstorm',
    'Satan': 'Satan',
    'Shotgun': 'Shotgun',
    'Soul Sucker': 'Soul_Sucker',
    'Spider Queen': 'Spider_Queen',
    'Steel': 'Steel',
    'Stone': 'Stone',
    'Storm': 'Storm',
    'Succubus': 'Succubus',
    'Sun': 'Sun',
    'Swamp': 'Swamp',
    'Vampire': 'Vampire',
    'Vampire Lord': 'Vampire_Lord',
    'Virus': 'Virus',
    'Voluptuous Egg Sac': 'Voluptuous_Egg_Sac',
    'Wind': 'Wind',
    'Wraith': 'Wraith',
  };

  // Специальные случаи для пассивок (базовые эффекты используют шары)
  const passivesToBallsPng: Record<string, string> = {
    'Burn': 'Burn',
    'Freeze': 'Freeze',
    'Poison': 'Poison',
    'Vampire': 'Vampire',
    'Wind': 'Wind',
    'Bleed': 'Bleed',
    'Ghost': 'Ghost',
    'Iron': 'Iron',
    'Lightning': 'Lightning',
    'Light': 'Light',
    'Dark': 'Dark',
    'Charm': 'Charm',
    'Cell': 'Cell',
    'Brood Mother': 'Brood_Mother',
    'Egg Sac': 'Egg_Sac',
    'Earthquake': 'Earthquake',
    'Laser (Horizontal)': 'Laser_Horizontal',
    'Laser (Vertical)': 'Laser_Vertical',
  };

  // Маппинг для пассивок с особыми случаями (апострофы, "of the" и т.д.)
  const passivesNameMapping: Record<string, string> = {
    // Апострофы: в файлах они есть, но нужно нормализовать
    "Deadeye's Amulet": "Deadeye's_Amulet",
    "Deadeye's Cross": "Deadeye's_Cross",
    "Deadeye's Impaler": "Deadeye's_Impaler",
    "Reacher's Spear": "Reacher's_Spear",
    "Archer's Effigy": "Archer's_Effigy",
    "Healer's Effigy": "Healer's_Effigy",
    "Lover's Quiver": "Lover's_Quiver",
    "Traitor's Cowl": "Traitor's_Cowl",
    "Tormenter's Mask": "Tormenters_Mask", // В файле без апострофа
    // "of the" -> "of_the"
    "Wings of the Anointed": "Wings_of_the_Anointed",
    "Eye of the Beholder": "Eye_of_the_Beholder",
    "Kiss of Death": "Kiss_of_Death",
    // Дефисы -> подчеркивания
    "Brood Mother": "Brood_Mother",
    "Egg Sac": "Egg_Sac",
    "Vampiric Sword": "Vampiric_Sword",
    "Everflowing Goblet": "Everflowing_Goblet",
    "Spiked Collar": "Spiked_Collar",
    "Crown of Thorns": "Crown_of_Thorns",
    "Radiant Feather": "Radiant_Feather",
    "Fleet Feet": "Fleet_Feet",
    "Ghostly Corset": "Ghostly_Corset",
    "Ethereal Cloak": "Ethereal_Cloak",
    "Diamond Hilted Dagger": "Diamond_Hilted_Dagger",
    "Sapphire Hilted Dagger": "Sapphire_Hilted_Dagger",
    "Ruby Hilted Dagger": "Ruby_Hilted_Dagger",
    "Emerald Hilted Dagger": "Emerald_Hilted_Dagger",
    "Grotesque Artillery": "Grotesque_Artillery",
    // Остальные пассивки с подчеркиваниями
    "Baby Rattle": "Baby_Rattle",
    "War Horn": "War_Horn",
    "Wretched Onion": "Wretched_Onion",
    "Bandage Roll": "Bandage_Roll",
    "Bottled Tornado": "Bottled_Tornado",
    "Cursed Elixir": "Cursed_Elixir",
    "Frozen Spike": "Frozen_Spike",
    "Ghostly Shield": "Ghostly_Shield",
    "Golden Bull": "Golden_Bull",
    "Hand Mirror": "Hand_Mirror",
    "Magic Staff": "Magic_Staff",
    "Pressure Valve": "Pressure_Valve",
    "Rubber Headband": "Rubber_Headband",
    "Upturned Hatchet": "Upturned_Hatchet",
    "Wagon Wheel": "Wagon_Wheel",
    "Midnight Oil": "Midnight_Oil",
    "Silver Blindfold": "Silver_Blindfold",
    "Silver Bullet": "Silver_Bullet",
    "Stone Effigy": "Stone_Effigy",
    "Voodoo Doll": "Voodoo_Doll",
    "Iron Onesie": "Iron_Onesie",
    "Odiferous Shell": "Odiferous_Shell",
    "Soul Reaver": "Soul_Reaver",
  };

  // Нормализуем базовое имя для fallback (убираем скобки, заменяем пробелы на подчеркивания)
  // Апострофы сохраняем, так как они есть в файлах
  let baseName = name
    .replace(/\s+/g, '_')  // Пробелы -> подчеркивания
    .replace(/\(/g, '')    // Убираем открывающие скобки
    .replace(/\)/g, '')    // Убираем закрывающие скобки
    .trim();

  // Для шаров: сначала пробуем новый формат .png через маппинг
  if (type === 'balls') {
    const pngFileName = nameToPngFile[name];
    if (pngFileName) {
      return `${BASE}images/balls/${pngFileName}.png`;
    }
    // Fallback: пробуем .png с нормализованным именем, потом .webp
    return `${BASE}images/balls/${baseName}.png`;
  }

  // Для пассивок: если это базовый эффект, используем иконку шара
  if (passivesToBallsPng[name]) {
    const pngFileName = passivesToBallsPng[name];
    return `${BASE}images/balls/${pngFileName}.png`;
  }

  // Для пассивок: сначала пробуем маппинг для особых случаев
  const mappedName = passivesNameMapping[name];
  if (mappedName) {
    return `${BASE}images/passives/${mappedName}.png`;
  }

  // Для остальных пассивок: основной путь — .png по нормализованному имени
  // Пример: "Crown of Thorns" -> Crown_of_Thorns.png
  // Пример: "Laser (Horizontal)" -> Laser_Horizontal.png (через маппинг выше)
  return `${BASE}images/passives/${baseName}.png`;
}

// Helper to merge items with same name
function mergeItems(items: Item[]): Item[] {
  const map = new Map<string, Item>();
  
  items.forEach(item => {
    if (map.has(item.name)) {
      const existing = map.get(item.name)!;
      if (item.evolutions) {
        existing.evolutions = [...(existing.evolutions || []), ...item.evolutions];
      }
      if (item.description && !existing.description) {
        existing.description = item.description;
      }
    } else {
      map.set(item.name, { ...item });
    }
  });
  
  return Array.from(map.values());
}

// Balls data - на основе скриншотов из вики
const ballsRaw: Item[] = [
  // Base balls (passives) - это не шары, а пассивы, но они используются для эволюций
  {
    name: "Burn",
    image: getLocalImage("Burn", "passives"),
    description: "Add 1 stack of burn on hit for 3 seconds (max 3 stacks). Burnt units are dealt 4-8 damage per stack per second."
  },
  {
    name: "Freeze",
    image: getLocalImage("Freeze", "passives"),
    description: "Has a 4% chance to freeze enemies for 5.0 seconds. Frozen enemies receive 25% more damage."
  },
  {
    name: "Poison",
    image: getLocalImage("Poison", "passives"),
    description: "Applies poison stacks dealing 1-4 damage per second."
  },
  {
    name: "Vampire",
    image: getLocalImage("Vampire", "passives"),
    description: "Has a 4.5% chance to heal 1 health per hit."
  },
  {
    name: "Wind",
    image: getLocalImage("Wind", "passives"),
    description: "Slows enemies by 30% for 5 seconds but deals 25% less damage."
  },
  {
    name: "Bleed",
    image: getLocalImage("Bleed", "passives"),
    description: "Inflicts 2 stacks of bleed. Bleeding enemies receive 1 damage per stack when hit by a ball (max 8 stacks)."
  },
  {
    name: "Ghost",
    image: getLocalImage("Ghost", "passives"),
    description: "Passes through enemies."
  },
  {
    name: "Iron",
    image: getLocalImage("Iron", "passives"),
    description: "Deals double damage but moves 40% slower."
  },
  {
    name: "Lightning",
    image: getLocalImage("Lightning", "passives"),
    description: "Deals 1-20 damage to up to 3 nearby enemies."
  },
  {
    name: "Light",
    image: getLocalImage("Light", "passives"),
    description: "Blinds enemies on hit for 3 seconds. Blinded units have a hard time detecting you and have a 50% chance of missing when they attack."
  },
  {
    name: "Dark",
    image: getLocalImage("Dark", "passives"),
    description: "Deals 3.0x damage but destroys itself after hitting an enemy. Has a 3 second cooldown before it can be shot again."
  },
  {
    name: "Charm",
    image: getLocalImage("Charm", "passives"),
    description: "Each hit has a 4% chance of charming the enemy for 5 seconds. Charmed units walk up the board and attack enemies."
  },
  {
    name: "Cell",
    image: getLocalImage("Cell", "passives"),
    description: "Splits into a clone on hit 2 times."
  },
  {
    name: "Brood Mother",
    image: getLocalImage("Brood Mother", "passives"),
    description: "Has a 25% chance of birthing a baby ball each time it hits an enemy."
  },
  {
    name: "Egg Sac",
    image: getLocalImage("Egg Sac", "passives"),
    description: "Explodes into 2-4 baby balls on hitting an enemy. Has a 3 second cooldown before it can be shot again."
  },
  {
    name: "Earthquake",
    image: getLocalImage("Earthquake", "passives"),
    description: "Deals 5-13 damage to nearby units in a 3x3 tile square."
  },
  {
    name: "Laser (Horizontal)",
    image: getLocalImage("Laser (Horizontal)", "passives"),
    description: "Deals 9-18 damage to all enemies in the same row."
  },
  {
    name: "Laser (Vertical)",
    image: getLocalImage("Laser (Vertical)", "passives"),
    description: "Deals 9-18 damage to all enemies in the same column."
  },
  {
    name: "Stone",
    image: getLocalImage("Stone", "balls")
  },

  // Evolved Balls
  {
    name: "Assassin",
    image: getLocalImage("Assassin", "balls"),
    description: "Passes through the front of enemies, dealing 30% bonus damage on backstabs.",
    evolutions: [
      {
        result: "Assassin",
        components: ["Iron", "Ghost"]
      },
      {
        result: "Assassin",
        components: ["Ghost", "Iron"]
      },
      {
        result: "Assassin",
        components: ["Iron", "Dark"]
      },
      {
        result: "Assassin",
        components: ["Dark", "Iron"]
      }
    ]
  },
  {
    name: "Berserk",
    image: getLocalImage("Berserk", "balls"),
    description: "Has a 30% chance to make enemies berserk for 6 seconds, dealing 15-24 damage to adjacent enemies per second.",
    evolutions: [
      {
        result: "Berserk",
        components: ["Charm", "Bleed"]
      },
      {
        result: "Berserk",
        components: ["Bleed", "Charm"]
      },
      {
        result: "Berserk",
        components: ["Charm", "Burn"]
      },
      {
        result: "Berserk",
        components: ["Burn", "Charm"]
      }
    ]
  },
  {
    name: "Black Hole",
    image: getLocalImage("Black Hole", "balls"),
    description: "Instantly kills the first non-boss enemy it hits but destroys itself, with a 7-second cooldown.",
    evolutions: [
      {
        result: "Black Hole",
        components: ["Dark", "Sun"]
      }
    ]
  },
  {
    name: "Blizzard",
    image: getLocalImage("Blizzard", "balls"),
    description: "Freezes enemies in a 2-tile radius for 0.8 seconds, dealing 1-50 damage.",
    evolutions: [
      {
        result: "Blizzard",
        components: ["Freeze", "Wind"]
      },
      {
        result: "Blizzard",
        components: ["Freeze", "Lightning"]
      }
    ]
  },
  {
    name: "Bomb",
    image: getLocalImage("Bomb", "balls"),
    description: "Explodes on hit, dealing 150-300 damage to nearby enemies, with a 3-second cooldown.",
    evolutions: [
      {
        result: "Bomb",
        components: ["Burn", "Iron"]
      }
    ]
  },
  {
    name: "Flash",
    image: getLocalImage("Flash", "balls"),
    description: "Damages all enemies on screen for 1-3 damage after hitting an enemy and blinds them for 2 seconds.",
    evolutions: [
      {
        result: "Flash",
        components: ["Lightning", "Light"]
      }
    ]
  },
  {
    name: "Flicker",
    image: getLocalImage("Flicker", "balls"),
    description: "Deals 1-7 damage to every enemy on screen every 1.4 seconds.",
    evolutions: [
      {
        result: "Flicker",
        components: ["Light", "Dark"]
      }
    ]
  },
  {
    name: "Freeze Ray",
    image: getLocalImage("Freeze Ray", "balls"),
    description: "Emits a freeze ray on hit, dealing 20-50 damage to enemies in its path, with a 10% chance to freeze for 10 seconds.",
    evolutions: [
      {
        result: "Freeze Ray",
        components: ["Freeze", "Laser (Horizontal)"]
      },
      {
        result: "Freeze Ray",
        components: ["Freeze", "Laser (Vertical)"]
      }
    ]
  },
  {
    name: "Frozen Flame",
    image: getLocalImage("Frozen Flame", "balls"),
    description: "Adds 1 stack of frostburn on hit (max 4 stacks) for 20 seconds. Frostburnt units take 8-12 damage per stack per second and receive 25% more damage from other sources.",
    evolutions: [
      {
        result: "Frozen Flame",
        components: ["Burn", "Freeze"]
      }
    ]
  },
  {
    name: "Brimstone",
    image: getLocalImage("Brimstone", "balls"),
    description: "Applies 1 stack of burn and poison every second to all enemies within a 2 tile radius (max 4 stacks). Burn deals 5-21 damage per stack per second and poison deals 11-16 damage per stack per second.",
    evolutions: [
      {
        result: "Brimstone",
        components: ["Stone", "Burn"]
      },
      {
        result: "Brimstone",
        components: ["Burn", "Poison"]
      },
      {
        result: "Brimstone",
        components: ["Poison", "Burn"]
      }
    ]
  },
  {
    name: "Glacier",
    image: getLocalImage("Glacier", "balls"),
    description: "Releases glacial spikes over time that deal 15-30 to enemies that touch them and freeze them for 2.0 seconds. This ball and its glacial spikes also deal 6-12 damage to nearby units.",
    evolutions: [
      {
        result: "Glacier",
        components: ["Freeze", "Earthquake"]
      }
    ]
  },
  {
    name: "Hemorrhage",
    image: getLocalImage("Hemorrhage", "balls"),
    description: "Inflicts 3 stacks of bleed. When hitting an enemy with 12 stacks of bleed or more, consumes all stacks of bleed to deal 20% of their current health.",
    evolutions: [
      {
        result: "Hemorrhage",
        components: ["Bleed", "Iron"]
      }
    ]
  },
  {
    name: "Holy Laser",
    image: getLocalImage("Holy Laser", "balls"),
    description: "Deals 24-36 damage to all enemies in the same row and column.",
    evolutions: [
      {
        result: "Holy Laser",
        components: ["Laser (Horizontal)", "Laser (Vertical)"]
      }
    ]
  },
  {
    name: "Incubus",
    image: getLocalImage("Incubus", "balls"),
    description: "Each hit has a 4% chance of charming the enemy for 9 seconds. Charmed enemies curse nearby enemies. Cursed enemies are dealt 100-200 after being hit 5 times.",
    evolutions: [
      {
        result: "Incubus",
        components: ["Charm", "Dark"]
      }
    ]
  },
  {
    name: "Inferno",
    image: getLocalImage("Inferno", "balls"),
    description: "Applies 1 stack of burn every second to all enemies within a 2 tile radius. Burn lasts for 6 seconds, dealing 3-7 damage per stack per seconds.",
    evolutions: [
      {
        result: "Inferno",
        components: ["Burn", "Wind"]
      }
    ]
  },
  {
    name: "Banished Flame",
    image: getLocalImage("Banished Flame", "balls"),
    description: "Adds 1 stack of darkflame on hit for 2 seconds (max 5 stacks). Darkflame deals 4-11 damage per stack per second. When the darkflame goes out, it deals 1-100 damage to the enemy.",
    evolutions: [
      {
        result: "Banished Flame",
        components: ["Burn", "Dark"]
      },
      {
        result: "Banished Flame",
        components: ["Dark", "Burn"]
      }
    ]
  },
  {
    name: "Laser Beam",
    image: getLocalImage("Laser Beam", "balls"),
    description: "Emit a laser beam on hit that deals 30-42 damage and blinds enemies for 8 seconds.",
    evolutions: [
      {
        result: "Laser Beam",
        components: ["Light", "Laser (Horizontal)"]
      },
      {
        result: "Laser Beam",
        components: ["Light", "Laser (Vertical)"]
      }
    ]
  },
  {
    name: "Leech",
    image: getLocalImage("Leech", "balls"),
    description: "Attaches up to 1 leech onto enemies it hits, which add 2 stacks of bleed per seconds (max 24 stacks).",
    evolutions: [
      {
        result: "Leech",
        components: ["Brood Mother", "Bleed"]
      }
    ]
  },
  {
    name: "Lightning Rod",
    image: getLocalImage("Lightning Rod", "balls"),
    description: "Plants a lightning rod into enemies it hits. These enemies are struck by lightning every 3.0 seconds, dealing 1-30 damage to up to 8 nearby enemies.",
    evolutions: [
      {
        result: "Lightning Rod",
        components: ["Lightning", "Iron"]
      }
    ]
  },
  {
    name: "Lovestruck",
    image: getLocalImage("Lovestruck", "balls"),
    description: "Inflicts lovestruck on hit enemies for 20 seconds. Lovestruck units have a 50% chance of healing you for 5 health when they attack.",
    evolutions: [
      {
        result: "Lovestruck",
        components: ["Charm", "Light"]
      },
      {
        result: "Lovestruck",
        components: ["Charm", "Lightning"]
      }
    ]
  },
  {
    name: "Maggot",
    image: getLocalImage("Maggot", "balls"),
    description: "Infest enemies on hit with maggots. When they dies, they explode into 1-2 baby balls.",
    evolutions: [
      {
        result: "Maggot",
        components: ["Brood Mother", "Cell"]
      }
    ]
  },
  {
    name: "Voluptuous Egg Sac",
    image: getLocalImage("Voluptuous Egg Sac", "balls"),
    description: "Explodes into 2-3 egg sacs on hitting an enemy. Has a 3-second cooldown before it can be shot again.",
    evolutions: [
      {
        result: "Voluptuous Egg Sac",
        components: ["Egg Sac", "Cell"]
      },
      {
        result: "Voluptuous Egg Sac",
        components: ["Cell", "Egg Sac"]
      }
    ]
  },
  {
    name: "Magma",
    image: getLocalImage("Magma", "balls"),
    description: "Emits lava blobs over time. Enemies who walk into lava blobs are dealt 15-30 damage and gain 1 stack of burn (max 3 stacks). Burn lasts for 3 seconds, dealing 3-8 damage per stack per second. This ball and its lava blobs also deal 6-12 damage to nearby units.",
    evolutions: [
      {
        result: "Magma",
        components: ["Burn", "Earthquake"]
      }
    ]
  },
  {
    name: "Mosquito King",
    image: getLocalImage("Mosquito King", "balls"),
    description: "Spawns a mosquito each time it hits an enemy. Mosquitos attack a random enemy, dealing 80-120 damage each. If a mosquito kills an enemy, they steal 1 health.",
    evolutions: [
      {
        result: "Mosquito King",
        components: ["Vampire", "Brood Mother"]
      }
    ]
  },
  {
    name: "Mosquito Swarm",
    image: getLocalImage("Mosquito Swarm", "balls"),
    description: "Explodes into 3-6 mosquitos. Mosquitos attack random enemies, dealing 80-120 damage each. If a mosquito kills an enemy, they steal 1 health.",
    evolutions: [
      {
        result: "Mosquito Swarm",
        components: ["Vampire", "Egg Sac"]
      }
    ]
  },
  {
    name: "Fireworks",
    image: getLocalImage("Fireworks", "balls"),
    description: "Explodes into 3-6 fireworks. Fireworks target random enemies, dealing 20-30 damage and applying 1 stack of burn. Burnt units are dealt 7-11 damage per stack per second.",
    evolutions: [
      {
        result: "Fireworks",
        components: ["Egg Sac", "Burn"]
      },
      {
        result: "Fireworks",
        components: ["Burn", "Egg Sac"]
      }
    ]
  },
  {
    name: "Noxious",
    image: getLocalImage("Noxious", "balls"),
    description: "Passes through enemies and applies 3 stacks of poison to nearby enemies within a 2 tile radius. Poison lasts for 4 seconds and each stack deals 1-3 damage per second.",
    evolutions: [
      {
        result: "Noxious",
        components: ["Poison", "Wind"]
      },
      {
        result: "Noxious",
        components: ["Wind", "Poison"]
      },
      {
        result: "Noxious",
        components: ["Dark", "Wind"]
      },
      {
        result: "Noxious",
        components: ["Wind", "Dark"]
      }
    ]
  },
  {
    name: "Nuclear Bomb",
    image: getLocalImage("Nuclear Bomb", "balls"),
    description: "Explodes when hitting an enemy, dealing 300-500 damage to nearby enemies and applying 1 stack of radiation to everyone present indefinitely (max 5 stacks). Each stack of radiation increases damage received by 10%. Has a 3 second cooldown.",
    evolutions: [
      {
        result: "Nuclear Bomb",
        components: ["Bomb", "Poison"]
      }
    ]
  },
  {
    name: "Overgrowth",
    image: getLocalImage("Overgrowth", "balls"),
    description: "Applies 1 stack of overgrowth. Upon reaching 3, consume all stacks and deal 150-200 damage to all enemies in a 3x3 tile square.",
    evolutions: [
      {
        result: "Overgrowth",
        components: ["Earthquake", "Cell"]
      }
    ]
  },
  {
    name: "Catapult",
    image: getLocalImage("Catapult", "balls"),
    description: "Launches 2-5 stone baby balls every 1.5 seconds, which are destroyed after hitting anything.",
    evolutions: [
      {
        result: "Catapult",
        components: ["Egg Sac", "Stone"]
      },
      {
        result: "Catapult",
        components: ["Stone", "Egg Sac"]
      }
    ]
  },
  {
    name: "Steel",
    image: getLocalImage("Steel", "balls"),
    description: "Initially deals double damage but moves 50% slower. Damage increases by 10% each time it hits an enemy (max 300%).",
    evolutions: [
      {
        result: "Steel",
        components: ["Stone", "Iron"]
      }
    ]
  },
  {
    name: "Landslide",
    image: getLocalImage("Landslide", "balls"),
    description: "Creates a landslide and destroys itself upon hitting an enemy. The landslide lasts for 5 seconds and deals 108-163 damage per second to enemies within a 2 tile radius.",
    evolutions: [
      {
        result: "Landslide",
        components: ["Stone", "Earthquake"]
      },
      {
        result: "Landslide",
        components: ["Earthquake", "Stone"]
      }
    ]
  },
  {
    name: "Phantom",
    image: getLocalImage("Phantom", "balls"),
    description: "Curse enemies on hit. Cursed enemies are dealt 100-200 damage after being hit 5 times",
    evolutions: [
      {
        result: "Phantom",
        components: ["Dark", "Ghost"]
      }
    ]
  },
  {
    name: "Radiation Beam",
    image: getLocalImage("Radiation Beam", "balls"),
    description: "Emit a radiation beam on hit that deals 24-48 damage and applies 1 stack of radiation (max 5 stacks). Radiation lasts for 15 seconds and cause enemies to receive 10% more damage from all sources per stack.",
    evolutions: [
      {
        result: "Radiation Beam",
        components: ["Laser (Horizontal)", "Poison"]
      },
      {
        result: "Radiation Beam",
        components: ["Laser (Horizontal)", "Cell"]
      },
      {
        result: "Radiation Beam",
        components: ["Laser (Vertical)", "Poison"]
      },
      {
        result: "Radiation Beam",
        components: ["Laser (Vertical)", "Cell"]
      }
    ]
  },
  {
    name: "Sacrifice",
    image: getLocalImage("Sacrifice", "balls"),
    description: "Inflicts 4 stacks of bleed (max 15 stacks) and applies curse to hit enemies. Cursed enemies are dealt 50-100 after being hit 5 times",
    evolutions: [
      {
        result: "Sacrifice",
        components: ["Bleed", "Dark"]
      }
    ]
  },
  {
    name: "Laser Cutter",
    image: getLocalImage("Laser Cutter", "balls"),
    description: "Constantly emits a laser in front of it, which deals 386-579 damage per second.",
    evolutions: [
      {
        result: "Laser Cutter",
        components: ["Steel", "Laser (Horizontal)"]
      },
      {
        result: "Laser Cutter",
        components: ["Steel", "Laser (Vertical)"]
      }
    ]
  },
  {
    name: "Sandstorm",
    image: getLocalImage("Sandstorm", "balls"),
    description: "Goes through enemies and is surrounded by a raging storm dealing 10-20 damage per second and blinding nearby enemies for 3 seconds",
    evolutions: [
      {
        result: "Sandstorm",
        components: ["Earthquake", "Wind"]
      }
    ]
  },
  {
    name: "Satan",
    image: getLocalImage("Satan", "balls"),
    description: "While active, add 1 stack of burn to all active enemies per second (max 5 stacks), dealing 10-20 damage per stack per second and make them go berserk, dealing 15-24 damage to adjacent enemies every second",
    evolutions: [
      {
        result: "Satan",
        components: ["Incubus", "Succubus"]
      }
    ]
  },
  {
    name: "Shotgun",
    image: getLocalImage("Shotgun", "balls"),
    description: "Shoots 3-7 iron baby balls after hitting a wall. Iron baby balls move at 200% speed but are destroyed upon hitting anything",
    evolutions: [
      {
        result: "Shotgun",
        components: ["Iron", "Egg Sac"]
      }
    ]
  },
  {
    name: "Soul Sucker",
    image: getLocalImage("Soul Sucker", "balls"),
    description: "Passes through enemies and saps them, with a 30% chance of stealing 1 health and reducing their attack damage by 20%. Lifesteal chance only applies once per enemy",
    evolutions: [
      {
        result: "Soul Sucker",
        components: ["Vampire", "Ghost"]
      }
    ]
  },
  {
    name: "Spider Queen",
    image: getLocalImage("Spider Queen", "balls"),
    description: "Has a 25% chance of birthing an Egg Sac each time it hits an enemy",
    evolutions: [
      {
        result: "Spider Queen",
        components: ["Brood Mother", "Egg Sac"]
      }
    ]
  },
  {
    name: "Storm",
    image: getLocalImage("Storm", "balls"),
    description: "Emits lightning to strike nearby enemies every second, dealing 1-40 damage",
    evolutions: [
      {
        result: "Storm",
        components: ["Lightning", "Wind"]
      }
    ]
  },
  {
    name: "Succubus",
    image: getLocalImage("Succubus", "balls"),
    description: "Each hit has a 4% chance of charming the enemy for 9 seconds. Heals 1 when hitting a charmed enemy",
    evolutions: [
      {
        result: "Succubus",
        components: ["Charm", "Vampire"]
      }
    ]
  },
  {
    name: "Sun",
    image: getLocalImage("Sun", "balls"),
    description: "Blind all enemies in view and add 1 stack of burn every second (max 5 stacks). Burn lasts for 6 seconds and deals 6-12 damage per stack per second",
    evolutions: [
      {
        result: "Sun",
        components: ["Burn", "Light"]
      }
    ]
  },
  {
    name: "Swamp",
    image: getLocalImage("Swamp", "balls"),
    description: "Leaves behind tar blobs over time. Enemies who walk into tar blobs are dealt 15-30, are slowed by 50% for 7 seconds and gain 1 stack of poison (max 8 stacks). Each stack of poison deals 1-3 damage per second. This ball and its tar blobs also deal 6-12 damage to nearby units",
    evolutions: [
      {
        result: "Swamp",
        components: ["Poison", "Earthquake"]
      }
    ]
  },
  {
    name: "Vampire Lord",
    image: getLocalImage("Vampire Lord", "balls"),
    description: "Each hit inflicts 3 stacks of bleed. Heals 1 health and consumes all stacks when hitting an enemy with at least 10 stacks of bleed",
    evolutions: [
      {
        result: "Vampire Lord",
        components: ["Vampire", "Bleed"]
      },
      {
        result: "Vampire Lord",
        components: ["Vampire", "Dark"]
      }
    ]
  },
  {
    name: "Virus",
    image: getLocalImage("Virus", "balls"),
    description: "Applies 1 stack of disease to units it hits (max 8 stacks). Disease lasts for 6 seconds. Each stack of disease deals 3-6 damage per second and diseased units have a 15% chance of passing a stack to undiseased nearby enemies each second",
    evolutions: [
      {
        result: "Virus",
        components: ["Poison", "Ghost"]
      },
      {
        result: "Virus",
        components: ["Poison", "Cell"]
      },
      {
        result: "Virus",
        components: ["Bleed", "Poison"]
      },
      {
        result: "Virus",
        components: ["Poison", "Bleed"]
      }
    ]
  },
  {
    name: "Wraith",
    image: getLocalImage("Wraith", "balls"),
    description: "Freezes any enemy it passes through for 0.8 seconds",
    evolutions: [
      {
        result: "Wraith",
        components: ["Freeze", "Ghost"]
      }
    ]
  },
  {
    name: "Nosferatu",
    image: getLocalImage("Nosferatu", "balls"),
    description: "Spawns a vampire bat each bounce. Vampire bats fly towards a random enemy, dealing 132-176 damage on hit, turning into a Vampire Lord",
    evolutions: [
      {
        result: "Nosferatu",
        components: ["Vampire Lord", "Spider Queen", "Mosquito King"]
      }
    ]
  }
];

export const ballsData = mergeItems(ballsRaw);

// Passives data - на основе скриншотов
const passivesRaw: Item[] = [
  // Passives with evolutions
  {
    name: "Vampiric Sword",
    image: getLocalImage("Vampiric Sword", "passives"),
    description: "Each kill heals you by 5, but each shot you take deals 2 damage to you",
    tier: 'A',
    evolutions: [
      {
        result: "Soul Reaver",
        components: ["Vampiric Sword", "Everflowing Goblet"]
      }
    ]
  },
  {
    name: "Everflowing Goblet",
    image: getLocalImage("Everflowing Goblet", "passives"),
    description: "You can heal past max health at 20% efficiency.",
    tier: 'B',
    evolutions: [
      {
        result: "Soul Reaver",
        components: ["Vampiric Sword", "Everflowing Goblet"]
      }
    ]
  },
  {
    name: "Soul Reaver",
    image: getLocalImage("Soul Reaver", "passives"),
    description: "Each kill grants 1 HP and you can overheal by 30%.",
    tier: 'S'
  },
  {
    name: "Spiked Collar",
    image: getLocalImage("Spiked Collar", "passives"),
    description: "Deal 30-50 to enemies the first time you get into their melee attack range",
    tier: 'B',
    evolutions: [
      {
        result: "Tormentor's Mask",
        components: ["Spiked Collar", "Crown of Thorns"]
      }
    ]
  },
  {
    name: "Crown of Thorns",
    image: getLocalImage("Crown of Thorns", "passives"),
    description: "Destroy the 2 nearest enemies when you are hit from close range.",
    tier: 'A',
    evolutions: [
      {
        result: "Tormentor's Mask",
        components: ["Spiked Collar", "Crown of Thorns"]
      }
    ]
  },
  {
    name: "Tormentor's Mask",
    image: getLocalImage("Tormenter's Mask", "passives"),
    description: "Reflects damage back onto enemies.",
    tier: 'S'
  },
  {
    name: "Radiant Feather",
    image: getLocalImage("Radiant Feather", "passives"),
    description: "Increase ball launch speed by 20% but get knocked back a little each time you shoot a ball",
    tier: 'B',
    evolutions: [
      {
        result: "Wings of the Anointed",
        components: ["Radiant Feather", "Fleet Feet"]
      }
    ]
  },
  {
    name: "Fleet Feet",
    image: getLocalImage("Fleet Feet", "passives"),
    description: "Increase movement speed by 10% and move at full speed while shooting.",
    tier: 'B',
    evolutions: [
      {
        result: "Wings of the Anointed",
        components: ["Radiant Feather", "Fleet Feet"]
      }
    ]
  },
  {
    name: "Wings of the Anointed",
    image: getLocalImage("Wings of the Anointed", "passives"),
    description: "Movement and ball speed buffed by 20% and 40% respectively. Also grants immunity to environmental hazards.",
    tier: 'S'
  },
  {
    name: "Ghostly Corset",
    image: getLocalImage("Ghostly Corset", "passives"),
    description: "Balls go through enemies and deal 20% bonus damage when hitting them from the side.",
    tier: 'A',
    evolutions: [
      {
        result: "Phantom Regalia",
        components: ["Ghostly Corset", "Ethereal Cloak"]
      }
    ]
  },
  {
    name: "Ethereal Cloak",
    image: getLocalImage("Ethereal Cloak", "passives"),
    description: "Balls go through enemies and 25% bonus damage until they hit the back of the field.",
    tier: 'A',
    evolutions: [
      {
        result: "Phantom Regalia",
        components: ["Ghostly Corset", "Ethereal Cloak"]
      }
    ]
  },
  {
    name: "Phantom Regalia",
    image: getLocalImage("Phantom Regalia", "passives"),
    description: "Balls phase through enemies, dealing 50% more damage.",
    tier: 'S'
  },
  {
    name: "Diamond Hilted Dagger",
    image: getLocalImage("Diamond Hilted Dagger", "passives"),
    description: "Increase crit chance to 20% when hitting enemies in the front.",
    tier: 'B',
    evolutions: [
      {
        result: "Deadeye's Cross",
        components: ["Diamond Hilted Dagger", "Sapphire Hilted Dagger", "Ruby Hilted Dagger", "Emerald Hilted Dagger"]
      }
    ]
  },
  {
    name: "Sapphire Hilted Dagger",
    image: getLocalImage("Sapphire Hilted Dagger", "passives"),
    description: "Increase crit chance to 30% when hitting enemies on their left side.",
    tier: 'B',
    evolutions: [
      {
        result: "Deadeye's Cross",
        components: ["Diamond Hilted Dagger", "Sapphire Hilted Dagger", "Ruby Hilted Dagger", "Emerald Hilted Dagger"]
      }
    ]
  },
  {
    name: "Ruby Hilted Dagger",
    image: getLocalImage("Ruby Hilted Dagger", "passives"),
    description: "Increase crit chance to 15% when hitting enemies in the back",
    tier: 'C',
    evolutions: [
      {
        result: "Deadeye's Cross",
        components: ["Diamond Hilted Dagger", "Sapphire Hilted Dagger", "Ruby Hilted Dagger", "Emerald Hilted Dagger"]
      }
    ]
  },
  {
    name: "Emerald Hilted Dagger",
    image: getLocalImage("Emerald Hilted Dagger", "passives"),
    description: "Increase crit chance to 20% when hitting enemies on their right side.",
    tier: 'B',
    evolutions: [
      {
        result: "Deadeye's Cross",
        components: ["Diamond Hilted Dagger", "Sapphire Hilted Dagger", "Ruby Hilted Dagger", "Emerald Hilted Dagger"]
      }
    ]
  },
  {
    name: "Baby Rattle",
    image: getLocalImage("Baby Rattle", "passives"),
    description: "Gain 1.5x baby balls, but your aim becomes scattered.",
    tier: 'A',
    evolutions: [
      {
        result: "Cornucopia",
        components: ["Baby Rattle", "War Horn"]
      }
    ]
  },
  {
    name: "Cornucopia",
    image: getLocalImage("Cornucopia", "passives"),
    description: "Has the chance to create an additional baby ball each time one spawns.",
    tier: 'S'
  },
  {
    name: "War Horn",
    image: getLocalImage("War Horn", "passives"),
    description: "All baby balls deal 20% more damage",
    tier: 'B',
    evolutions: [
      {
        result: "Cornucopia",
        components: ["Baby Rattle", "War Horn"]
      }
    ]
  },
  {
    name: "Breastplate",
    image: getLocalImage("Breastplate", "passives"),
    description: "Decrease damage taken by 10%.",
    tier: 'B',
    evolutions: [
      {
        result: "Odiferous Shell",
        components: ["Breastplate", "Wretched Onion"]
      }
    ]
  },
  {
    name: "Wretched Onion",
    image: getLocalImage("Wretched Onion", "passives"),
    description: "Deal 6-12 per second to enemies within 2 tiles",
    tier: 'C',
    evolutions: [
      {
        result: "Odiferous Shell",
        components: ["Breastplate", "Wretched Onion"]
      }
    ]
  },
  {
    name: "Odiferous Shell",
    image: getLocalImage("Odiferous Shell", "passives"),
    description: "Improved armor, debuff resistance, and defense.",
    tier: 'A'
  },
  {
    name: "Deadeye's Amulet",
    image: getLocalImage("Deadeye's Amulet", "passives"),
    description: "Critical hits deal 10-15 bonus damage.",
    tier: 'A',
    evolutions: [
      {
        result: "Gracious Impaler",
        components: ["Deadeye's Amulet", "Reacher's Spear"]
      }
    ]
  },
  {
    name: "Reacher's Spear",
    image: getLocalImage("Reacher's Spear", "passives"),
    description: "Increase crit chance to 20% when hitting enemies in the same column as you",
    tier: 'B',
    evolutions: [
      {
        result: "Gracious Impaler",
        components: ["Deadeye's Amulet", "Reacher's Spear"]
      }
    ]
  },
  {
    name: "Hand Fan",
    image: getLocalImage("Hand_Fan", "passives"),
    description: "Slow down enemies in the same column as you by 50%.",
    tier: 'B',
    evolutions: [
      {
        result: "Grotesque Artillery",
        components: ["Hand Fan", "Turret"]
      }
    ]
  },
  {
    name: "Turret",
    image: getLocalImage("Turret", "passives"),
    description: "Floats around your character and shoots a baby ball at enemies",
    tier: 'A',
    evolutions: [
      {
        result: "Grotesque Artillery",
        components: ["Hand Fan", "Turret"]
      }
    ]
  },
  {
    name: "Grotesque Artillery",
    image: getLocalImage("Grotesque Artillery", "passives"),
    description: "Floats around your character and shoots a random level 1 unevolved special ball at enemies every 8.0 seconds.",
    tier: 'S'
  },
  {
    name: "Deadeye's Cross",
    image: getLocalImage("Deadeye's Cross", "passives"),
    description: "Creates a new weapon with greater accuracy and improved critical damage.",
    tier: 'A',
    evolutions: [
      {
        result: "Deadeye's Impaler",
        components: ["Deadeye's Cross", "Gracious Impaler"]
      }
    ]
  },
  {
    name: "Gracious Impaler",
    image: getLocalImage("Gracious_Impaler", "passives"),
    description: "5% chance to insta-kill an enemy with each critical hit.",
    tier: 'S',
    evolutions: [
      {
        result: "Deadeye's Impaler",
        components: ["Deadeye's Cross", "Gracious Impaler"]
      }
    ]
  },
  {
    name: "Deadeye's Impaler",
    image: getLocalImage("Deadeye's Impaler", "passives"),
    description: "Floats around your character and shoots a random level 1 unevolved special ball at enemies every 8.0 seconds.",
    tier: 'S'
  },
  
  // Passives without evolutions
  {
    name: "Archer's Effigy",
    image: getLocalImage("Archer's Effigy", "passives"),
    description: "Every 7-12 rows, spawn a stone archer with 219 health on your side. Stone archers are immune to ball damage and shoot arrows at enemies.",
    tier: 'B'
  },
  {
    name: "Artificial Heart",
    image: getLocalImage("Artificial_Heart", "passives"),
    description: "Friendly pieces gain 100% more health.",
    tier: 'A'
  },
  {
    name: "Bandage Roll",
    image: getLocalImage("Bandage Roll", "passives"),
    description: "Shoot 1-2 baby balls each time you're healed.",
    tier: 'B'
  },
  {
    name: "Bottled Tornado",
    image: getLocalImage("Bottled Tornado", "passives"),
    description: "When you catch a special ball, automatically shoot 1-3 new baby balls in random directions.",
    tier: 'B'
  },
  {
    name: "Cursed Elixir",
    image: getLocalImage("Cursed Elixir", "passives"),
    description: "When a poisoned enemy dies, 10% chance for them to come back as a zombie with 329 health.",
    tier: 'C'
  },
  {
    name: "Dynamite",
    image: getLocalImage("Dynamite", "passives"),
    description: "Every 5-10 rows, spawn an enemy with dynamite attached to them. Destroying them will deal 200-500 damage to nearby enemies.",
    tier: 'B'
  },
  {
    name: "Eye of the Beholder",
    image: getLocalImage("Eye of the Beholder", "passives"),
    description: "10% chance to dodge incoming attacks.",
    tier: 'A'
  },
  {
    name: "Frozen Spike",
    image: getLocalImage("Frozen Spike", "passives"),
    description: "When an enemy is frozen, they emit a chill to nearby enemies that deals 10-20 damage.",
    tier: 'B'
  },
  {
    name: "Gemspring",
    image: getLocalImage("Gemspring", "passives"),
    description: "Every 7-11 rows, spawn a Gemspring. Dealing damage to them causes them to drop an increasing amount of XP gems.",
    tier: 'B'
  },
  {
    name: "Ghostly Shield",
    image: getLocalImage("Ghostly Shield", "passives"),
    description: "Balls go through allies and heal them for 2 health.",
    tier: 'C'
  },
  {
    name: "Golden Bull",
    image: getLocalImage("Golden Bull", "passives"),
    description: "Every 7-11 rows, spawn a golden bull with 548 health on your side. Golden Bulls accrue 10 Gold per minute.",
    tier: 'A'
  },
  {
    name: "Hand Mirror",
    image: getLocalImage("Hand Mirror", "passives"),
    description: "Projectiles have a 50% chance to reflect upon hitting you, dealing 20-40 damage if they hit an enemy.",
    tier: 'B'
  },
  {
    name: "Healer's Effigy",
    image: getLocalImage("Healer's Effigy", "passives"),
    description: "Every 7-12 rows, spawn a stone healer with 137 health on your side, which heals you 10 health per minute when it's on the field.",
    tier: 'B'
  },
  {
    name: "Hourglass",
    image: getLocalImage("Hourglass", "passives"),
    description: "Balls deal 150% damage but damage decays by 30% with each bounce.",
    tier: 'C'
  },
  {
    name: "Kiss of Death",
    image: getLocalImage("Kiss_of_Death", "passives"),
    description: "Charmed enemies have a 10% chance of dying after recovering.",
    tier: 'A'
  },
  {
    name: "Lover's Quiver",
    image: getLocalImage("Lover's Quiver", "passives"),
    description: "Projectiles have a 40% chance to heal you for 1 health instead of hurting you",
    tier: 'B'
  },
  {
    name: "Magic Staff",
    image: getLocalImage("Magic Staff", "passives"),
    description: "Increase area-of-effect damage by 20%",
    tier: 'B'
  },
  {
    name: "Magnet",
    image: getLocalImage("Magnet", "passives"),
    description: "Increase range at which you pick up items and catch balls",
    tier: 'B'
  },
  {
    name: "Midnight Oil",
    image: getLocalImage("Midnight Oil", "passives"),
    description: "Balls that hit flaming enemies light on fire and deal 10-20 bonus fire damage on the next hit",
    tier: 'B'
  },
  {
    name: "Pressure Valve",
    image: getLocalImage("Pressure Valve", "passives"),
    description: "Enemies explode on death, dealing 20-30 damage to adjacent enemies",
    tier: 'A'
  },
  {
    name: "Protective Charm",
    image: getLocalImage("Protective_Charm", "passives"),
    description: "Gain a shield that blocks the next damage you would receive. Recharges after 60 seconds",
    tier: 'S'
  },
  {
    name: "Rubber Headband",
    image: getLocalImage("Rubber Headband", "passives"),
    description: "Balls start off at 70% speed but increase by 20% each bounce (max 200%)",
    tier: 'C'
  },
  {
    name: "Shortbow",
    image: getLocalImage("Shortbow", "passives"),
    description: "Increase fire rate by 15%",
    tier: 'B'
  },
  {
    name: "Silver Blindfold",
    image: getLocalImage("Silver Blindfold", "passives"),
    description: "Increase crit chance to 20% when hitting blinded enemies.",
    tier: 'B'
  },
  {
    name: "Silver Bullet",
    image: getLocalImage("Silver Bullet", "passives"),
    description: "Balls deal 20% bonus damage until they hit a wall",
    tier: 'B'
  },
  {
    name: "Slingshot",
    image: getLocalImage("Slingshot", "passives"),
    description: "25% chance to launch a baby ball when you pick up a gem",
    tier: 'C'
  },
  {
    name: "Stone Effigy",
    image: getLocalImage("Stone Effigy", "passives"),
    description: "Every 7-12 rows, spawn a stone soldier with 247 health on your side",
    tier: 'B'
  },
  {
    name: "Traitor's Cowl",
    image: getLocalImage("Traitor's Cowl", "passives"),
    description: "Stone allies can now be damaged by your balls, but you heal by 2 when a ball hits one.",
    tier: 'C'
  },
  {
    name: "Upturned Hatchet",
    image: getLocalImage("Upturned Hatchet", "passives"),
    description: "Balls deal 80% more damage after hitting the back of the field, otherwise damage is reduced by 20%",
    tier: 'B'
  },
  {
    name: "Voodoo Doll",
    image: getLocalImage("Voodoo Doll", "passives"),
    description: "Curse has a 10% chance of killing enemies.",
    tier: 'B'
  },
  {
    name: "Wagon Wheel",
    image: getLocalImage("Wagon Wheel", "passives"),
    description: "Each time a ball hits a wall, it deals 30% extra damage on the next hit",
    tier: 'C'
  },
  {
    name: "Iron Onesie",
    image: getLocalImage("Iron Onesie", "passives"),
    description: "Balls deal 0.8% more damage for each baby ball on the field.",
    tier: 'S'
  }
];

export const passivesData = mergeItems(passivesRaw);

// Character Combinations Data
export interface CharacterCombo {
  name: string;
  character1: string;
  character2: string;
  character1Image: string;
  character2Image: string;
  bestBalls: string[];
  bestPassives: string[];
  explanation: string;
}

function getCharacterImage(name: string): string {
  const BASE = (import.meta as any).env.BASE_URL || '/';
  // Имена файлов используют подчеркивания и сохраняют "The "
  const fileName = name.replace(/\s+/g, '_');
  return `${BASE}images/characters/${fileName}.png`;
}

export const characterCombos: CharacterCombo[] = [
  {
    name: "The Carouser x The Repentant",
    character1: "The Carouser",
    character2: "The Repentant",
    character1Image: getCharacterImage("The Carouser"),
    character2Image: getCharacterImage("The Repentant"),
    bestBalls: ["Berserk", "Lovestruck", "Incubus", "Succubus"],
    bestPassives: ["Crown of Thorns", "Wretched Onion", "Everflowing Goblet", "Fleet Feet"],
    explanation: "They work so well because constant orbit hits keep charm and on-hit effects rolling nonstop, spreading damage and healing passively while mirrored balls multiply the value without needing precision."
  },
  {
    name: "The Cohabitants x The Flagellant",
    character1: "The Cohabitants",
    character2: "The Flagellant",
    character1Image: getCharacterImage("The Cohabitants"),
    character2Image: getCharacterImage("The Flagellant"),
    bestBalls: ["Brood Mother", "Egg Sac", "Cell", "Laser", "Vampire"],
    bestPassives: ["Baby Rattle", "Bandage Roll", "Bottled Tornado", "War Horn", "Cornucopia"],
    explanation: "The Cohabitants x Flagellant build is all about flooding the screen with balls, which is where Brood Mother, Cell, and Egg Sac come in. Combining with Laser then creates havoc by hitting dozens of targets at once. Synergizes well with the balls by creating more baby balls with every single hit. Bandage Roll also combines with Vampire to spawn another ball when healed."
  },
  {
    name: "The Shade x The Physicist",
    character1: "The Shade",
    character2: "The Physicist",
    character1Image: getCharacterImage("The Shade"),
    character2Image: getCharacterImage("The Physicist"),
    bestBalls: ["Assassin", "Dark", "Laser (Vertical)", "Vampire", "Ghost"],
    bestPassives: ["Rubber Headband", "Spiked Collar", "Upturned Hatchet", "Wagon Wheel", "Ruby Hilted Dagger"],
    explanation: "Assassin is key to a The Shade x The Physicist build, as it doubles down on the ability to fire balls from the top of the screen and achieve backstabs. But you'll need to Ghost so you're still dealing damage to the front rows. Balls fired from the back bounce much more than those fired from the front, so the likes of Rubber Headband and Ruby Hilted Dagger capitalize on this and offer extra damage."
  },
  {
    name: "The Itchy Finger x The Shieldbearer",
    character1: "The Itchy Finger",
    character2: "The Shieldbearer",
    character1Image: getCharacterImage("The Itchy Finger"),
    character2Image: getCharacterImage("The Shieldbearer"),
    bestBalls: ["Laser (either)", "Hemorrhage", "Brood Mother", "Cell", "Burn"],
    bestPassives: ["Deadeye's Cross", "Magnet", "Diamond Hilted Dagger", "Hand Mirror", "Pressure Valve"],
    explanation: "The fast fire rate of Itchy Finger combines perfectly with the bounce of Shieldbearer. With this said, mixing together Brood Mother and Cell with Laser and Hemorrhage offers a lot of damage and floods the screen. This build is great for damage but struggles with mobility, so Magnet helps you collect gems and health. Then, Deadeye's Cross, Diamond Hilted Dagger, and Hand Mirror buff reflectivity and deal insane damage."
  },
  {
    name: "The Makeshift Sisyphus x The Embedded",
    character1: "The Makeshift Sisyphus",
    character2: "The Embedded",
    character1Image: getCharacterImage("The Makeshift Sisyphus"),
    character2Image: getCharacterImage("The Embedded"),
    bestBalls: ["Swamp", "Freeze", "Laser", "Wind", "Lightning"],
    bestPassives: ["Magic Staff", "Hand Mirror", "Dynamite", "Cursed Elixir", "Shortbow"],
    explanation: "This Makeshift Sisyphus x The Embedded build is all about area of effect damage, so you'll want to look for Freeze, Wind, and Lightning. These can then be evolved into picks like Blizzard, freeing up space to take Laser. Magic Staff buffs AoE damage, while Dynamite can quickly destroy enemies and create gaps. Shortbow is also vital for increasing your fire rate, allowing you to deal more damage in quick succession."
  },
  {
    name: "The Repentant x The Physicist",
    character1: "The Repentant",
    character2: "The Physicist",
    character1Image: getCharacterImage("The Repentant"),
    character2Image: getCharacterImage("The Physicist"),
    bestBalls: ["Assassin", "Frozen Flame", "Radiation Beam", "Noxious", "Ghost"],
    bestPassives: ["Phantom Regalia", "Wings of the Anointed", "Magnet", "Magic Staff", "Radiant Feather"],
    explanation: "The best Repentant x Physicist build is all about rebounds, so Assassin is a must-use. Then, a combination of AoE balls and Ghost makes full use of The Physicist's acceleration buff. As a primarily AoE build, Magic Staff is an ideal way to boost your damage, while Phantom Regalia and Wings of the Anointed synergize perfectly with The Physicist's buff to returning balls."
  }
];

export interface CharacterTier {
  name: string;
  tier: 'S' | 'A' | 'B' | 'C';
  ability: string;
  reason: string;
  image: string;
}

export const characterTiers: CharacterTier[] = [
  // S-tier
  {
    name: "The Itchy Finger",
    tier: 'S',
    ability: "Shoots twice as fast and moves at full speed while firing.",
    reason: "Constantly launches all available balls, turning him into the most consistent and aggressive character in the game. His Burn Ball pairs perfectly with Magma or Wind evolutions for ridiculous clears.",
    image: getCharacterImage("The Itchy Finger")
  },
  {
    name: "The Repentant",
    tier: 'S',
    ability: "Deals +5% damage per bounce and returns balls through enemies when hitting the back wall.",
    reason: "Scales absurdly well with pass-through or pairing builds, and his synergy potential makes him one of the strongest characters in the game",
    image: getCharacterImage("The Repentant")
  },
  {
    name: "The Embedded",
    tier: 'S',
    ability: "Balls pierce all enemies until they hit a wall, applying poison as they pass through.",
    reason: "One of the best for status stacking and sustained DPS, easily standing beside the top-tier meta picks.",
    image: getCharacterImage("The Embedded")
  },
  {
    name: "The Makeshift Sisyphus",
    tier: 'S',
    ability: "There's a reason this character is unlocked in the late game.",
    reason: "Once he's in your roster, it's hard not to want to include him due to his massive AoE impact.",
    image: getCharacterImage("The Makeshift Sisyphus")
  },
  {
    name: "The Carouser",
    tier: 'S',
    ability: "The Carouser's orbiting balls keep damage and status effects active at all times.",
    reason: "Close range becomes control instead of risk. Charm scales cleanly into late game, rewards smart movement, and holds value against elites and bosses.",
    image: getCharacterImage("The Carouser")
  },
  // A-tier
  {
    name: "The Cohabitants",
    tier: 'A',
    ability: "Launch mirrored copies of each ball, each dealing half damage but applying twice the on-hit effects.",
    reason: "Excellent for Ghost or Broodmother synergy builds.",
    image: getCharacterImage("The Cohabitants")
  },
  {
    name: "The Shieldbearer",
    tier: 'A',
    ability: "Reflects balls back with a shield, doubling their damage with each bounce.",
    reason: "Great for defensive play and high-scaling late-game setups.",
    image: getCharacterImage("The Shieldbearer")
  },
  {
    name: "The Juggler",
    tier: 'A',
    ability: "Lobs balls into a target area before they begin bouncing, letting you drop them right into enemy clusters.",
    reason: "Outstanding for clearing large waves fast.",
    image: getCharacterImage("The Juggler")
  },
  {
    name: "The Warrior",
    tier: 'A',
    ability: "Default character and solid starter. Starts with the Bleed Ball, offering steady single-target damage and strong scaling as you unlock more builds.",
    reason: "Solid starter with good scaling potential.",
    image: getCharacterImage("The Warrior")
  },
  {
    name: "The Physicist",
    tier: 'A',
    ability: "Manipulates gravity, pulling balls back faster and bending shots across the field.",
    reason: "Efficient, fast-paced, and surprisingly powerful for consistent clears.",
    image: getCharacterImage("The Physicist")
  },
  {
    name: "The Spendthrift",
    tier: 'A',
    ability: "Fires all balls in a wide arc and starts with the Vampire Ball.",
    reason: "Great for lifesteal builds and baby-ball synergy, but falls off slightly against bosses.",
    image: getCharacterImage("The Spendthrift")
  },
  // B-tier
  {
    name: "The Shade",
    tier: 'B',
    ability: "Shoots from the back of the screen with a base 10% critical hit chance.",
    reason: "Solid on paper but limited by pairing restrictions, keeping him from climbing higher.",
    image: getCharacterImage("The Shade")
  },
  {
    name: "The Flagellant",
    tier: 'B',
    ability: "Balls bounce normally off the back of the screen and can chain multiple ricochets.",
    reason: "Fun and stylish to play, but not much stronger than average.",
    image: getCharacterImage("The Flagellant")
  },
  {
    name: "The Empty Nester",
    tier: 'B',
    ability: "No baby balls, trades raw offense for control. Starts with the Ghost Ball, offering good crowd control and sustain, but lacks burst potential.",
    reason: "Good crowd control and sustain, but lacks burst potential.",
    image: getCharacterImage("The Empty Nester")
  },
  {
    name: "The Falconer",
    tier: 'B',
    ability: "The Falconer feels powerful early as side shots clear lanes fast, but that edge fades when enemies grow tougher.",
    reason: "Boss fights suffer from split pressure, and success depends too much on the right upgrades. He works well, just not reliably enough to sit at the top.",
    image: getCharacterImage("The Falconer")
  },
  // C-tier
  {
    name: "The Cogitator",
    tier: 'C',
    ability: "Automatically selects upgrades and evolutions for you.",
    reason: "Good for learning fusions early on, but removing player choice makes runs feel autopilot.",
    image: getCharacterImage("The Cogitator")
  },
  {
    name: "The Tactician",
    tier: 'C',
    ability: "Turns combat into turn-based mode with the Iron Ball.",
    reason: "Unique, but slow and clunky, which ends up being more novelty than viable playstyle.",
    image: getCharacterImage("The Tactician")
  },
  {
    name: "The Radical",
    tier: 'C',
    ability: "Auto-plays with minimal player input, making evolutions on its own.",
    reason: "Interesting concept but poor execution, better suited for testing evolutions.",
    image: getCharacterImage("The Radical")
  }
];

export interface BuildGuideItem {
  name: string;
  reason: string;
}

export interface CharacterBuildGuide {
  name: string;
  startingBall: string;
  passive: string;
  strengths: string;
  weaknesses: string;
  bestBalls: BuildGuideItem[];
  bestPassives: BuildGuideItem[];
  bestCharacterPair: {
    name: string;
    reason: string;
  };
  howToUnlock: string;
  howToPlay: string;
  image: string;
}

export const buildGuides: CharacterBuildGuide[] = [
  {
    name: "The Embedded",
    startingBall: "Poison",
    passive: "Pierce – Balls always pierce enemies until they hit a wall, applying poison as they pass through",
    strengths: "Consistent DPS, excellent scaling with status effects, great wave clear",
    weaknesses: "Low HP, relies on positioning, minimal crowd control",
    bestBalls: [
      { name: "Noxious (Poison + Wind or Dark + Wind)", reason: "Noxious spreads poison to nearby enemies, perfect for pierce chains" },
      { name: "Radiation Beam (Laser + Poison/Cell)", reason: "Radiation Beam increases damage received, boosting poison and crit output" },
      { name: "Swamp (Poison + Earthquake)", reason: "Swamp slows targets while applying poison, adding control to his build" },
      { name: "Maggot (Cell + Brood Mother)", reason: "Maggot spawns baby balls that keep spreading poison and triggering Soul Reaver heals" }
    ],
    bestPassives: [
      { name: "Ghostly Corset", reason: "Ghostly Corset increases pierce damage and rewards side hits." },
      { name: "Wagon Wheel", reason: "Wagon Wheel boosts power after wall hits for stronger ricochets." },
      { name: "Silver Bullet", reason: "Silver Bullet keeps damage 25% higher until the ball reaches a wall." },
      { name: "Magnet", reason: "Magnet pulls in XP and drops automatically, keeping the pace fast." }
    ],
    bestCharacterPair: {
      name: "The Shade",
      reason: "The Shade's high base crit chance makes every poison pierce a lethal burst, creating one of the fastest damage duos in Ball x Pit."
    },
    howToUnlock: "To unlock The Embedded, build the Veteran's Hut Blueprint, which is unlocked by clearing the Snowy x Shores biome. Once built, he'll join your roster as a playable character.",
    howToPlay: "The Embedded is a fast, forward-focused DPS character. Fire down long lanes and let your shots pierce through everything. Start with Radiation Beam to boost poison damage, then add Ghostly Corset and Silver Bullet to strengthen each hit. Wagon Wheel increases burst after bounces, and Magnet keeps you upgrading nonstop.",
    image: getCharacterImage("The Embedded")
  },
  {
    name: "The Repentant",
    startingBall: "Freeze",
    passive: "Rebound – Balls deal 5% more damage per bounce and return to the player, damaging all enemies they pass through",
    strengths: "Excellent control, fast projectiles, powerful scaling through rebounds",
    weaknesses: "Low HP, limited sustain, relies heavily on positioning.",
    bestBalls: [
      { name: "Blizzard (Freeze + Wind)", reason: "Blizzard freezes enemies for clean rebounds" },
      { name: "Frozen Flame (Freeze + Burn)", reason: "Frozen Flame adds Frostburn and amplifies all damage" },
      { name: "Assassin (Iron + Ghost or Iron + Dark)", reason: "Assassin rewards back hits with bonus burst" },
      { name: "Radiation Beam (Laser + Poison/Cell)", reason: "Radiation Beam increases incoming damage per stack to scale rebound hits" }
    ],
    bestPassives: [
      { name: "Phantom Regalia", reason: "Phantom Regalia lets balls pierce before rebounding" },
      { name: "Wings of the Anointed", reason: "Wings of the Anointed boosts speed for faster returns" },
      { name: "Magnet", reason: "Magnet auto-collects drops from afar" },
      { name: "Soul Reaver", reason: "Soul Reaver restores HP per kill and stabilizes his low survivability" }
    ],
    bestCharacterPair: {
      name: "The Physicist",
      reason: "The Physicist's gravity pull accelerates returning shots and massively boosts rebound DPS"
    },
    howToUnlock: "To unlock The Repentant, you'll need to build the Haunted House Blueprint, which becomes available after clearing the Snowy x Shores biome. Once built, he'll appear in your roster as a playable character.",
    howToPlay: "The Repentant thrives on precision and setup. Position yourself so that your shots bounce multiple times before returning, maximizing damage on both passes. Use Blizzard and Frozen Flame to control enemy movement, then stack Radiation Beam or Assassin for burst damage as balls sweep back. Prioritize Speed and AOE Power tomes early to strengthen rebound distance and impact. Once you secure Phantom Regalia and Wings of the Anointed, rebounds become lightning-fast and nearly impossible for enemies to dodge. Pairing him with The Physicist pushes this even further, accelerating returns for near-constant multi-hits.",
    image: getCharacterImage("The Repentant")
  },
  {
    name: "The Itchy Finger",
    startingBall: "Burn",
    passive: "Rapid Fire: Shoots twice as fast and moves at full speed while shooting",
    strengths: "Extremely high fire rate, fast movement, great synergy with damage-over-time effects",
    weaknesses: "Low HP, low precision, weak early-game damage without evolutions",
    bestBalls: [
      { name: "Frozen Flame (Burn + Freeze)", reason: "Frozen Flame adds Frostburn that boosts all damage, perfect for Itchy Finger's nonstop fire rate." },
      { name: "Radiation Beam (Laser + Poison/Cell)", reason: "Radiation Beam stacks damage on every hit, making his fast shots hit even harder." },
      { name: "Phantom (Dark + Ghost)", reason: "Phantom curses enemies and detonates fast, syncing perfectly with his rapid multi-hits." },
      { name: "Maggot (Cell + Brood Mother)", reason: "Maggot spawns baby balls on kills, giving Itchy Finger extra sustain and crowd control." }
    ],
    bestPassives: [
      { name: "Deadeye's Cross", reason: "Deadeye's Cross boosts crit chance to 60%, turning his bullets into constant critical hits" },
      { name: "Breastplate", reason: "Breastplate decreases damage taken by 10%." },
      { name: "Soul Reaver", reason: "Soul Reaver heals him per kill, fixing his low HP without slowing him down." },
      { name: "Magnet", reason: "Magnet pulls XP and items automatically, ideal for fast characters who can't stop moving." }
    ],
    bestCharacterPair: {
      name: "The Shieldbearer",
      reason: "Shieldbearer doubles Itchy Finger's DPS by reflecting his rapid shots, making it the highest damage meta combo in Ball x Pit."
    },
    howToUnlock: "To unlock The Itchy Finger, you'll need to build the Sheriff's Office Blueprint, which becomes available after clearing the Bone x Yard biome. Once constructed, he'll join your roster as a playable character.",
    howToPlay: "The Itchy Finger lives or dies by momentum. Keep moving and never stop shooting. His build works best once you evolve into Frozen Flame and Radiation Beam, stacking Frostburn and Radiation together so every bullet increases total damage dealt. Use Maggot to flood the field with baby balls that trigger more kills and keep Soul Reaver topped up. With some extra shield due to his passives, he'll survive for the entire run while shredding enemies.",
    image: getCharacterImage("The Itchy Finger")
  },
  {
    name: "The Cohabitants",
    startingBall: "Brood Mother",
    passive: "Every ball fire is mirrored in the opposite direction, but deals half damage.",
    strengths: "Fire lots of projectiles at once, hitting multiple targets with ease.",
    weaknesses: "Low attack power, requiring more upgrades and Evolutions to increase damage output.",
    bestBalls: [
      { name: "Soul Sucker (Ghost + Vampire)", reason: "Allows you to damage the entire battlefield at once and heal" },
      { name: "Bomb (Burn + Iron)", reason: "Inflicts huge damage and mirrored shots make up for low fire rate" },
      { name: "Maggot (Cell + Brood Mother)", reason: "Spawns more baby balls, easy to use since Brood Mother is default ball" },
      { name: "Hemorrhage (Bleed + Iron)", reason: "Stacks nicely and lets you quickly the front rows on both sides" }
    ],
    bestPassives: [
      { name: "Gracious Impaler (Deadeye's Amulet + Reacher's Spear)", reason: "Buffs the chances of an insta-kill with a critical hit, helping you clear enemies quicker" },
      { name: "Soul Reaver (Everflowing Goblet + Vampiric Sword)", reason: "Offers 1HP of healing per kill" },
      { name: "Phantom Regalia (Ethereal Cloak + Ghostly Corset)", reason: "Balls phase through enemies and do more damage, which pairs perfectly with Soul Sucker" },
      { name: "Hourglass", reason: "Buffs damage by 150%, but decreases with every bounce" }
    ],
    bestCharacterPair: {
      name: "The Shieldbearer",
      reason: "Doubles The Cohabitants damage by bouncing balls off the back wall"
    },
    howToUnlock: "The Cohibants are unlocked as soon as you build the Cozy Home in your home base. To do this, you need to track down the Blueprint, which only drops inside Bone x Yard level.",
    howToPlay: "Once you've got the build in place, the best approach is to be continuously moving from left to right and vice versa. Although you can fire balls from two directions at once, you can't adjust them individually, so it's easy to clear the sides while leaving the middle. But if you stay on the move, you can defeat enemies equally so you never find yourself getting overwhelmed in one specific area. This is also handy for taking on bosses, especially with Ghost, as your shots will phase through enemies and damage them at the back.",
    image: getCharacterImage("The Cohabitants")
  },
  {
    name: "The Juggler",
    startingBall: "Lightning",
    passive: "Lobs balls in an arc that land on a chosen point before bouncing",
    strengths: "High precision, wide AoE potential, strong crowd control",
    weaknesses: "Demands manual aim and timing, low forgiveness if you miss",
    bestBalls: [
      { name: "Bomb (Burn + Iron)", reason: "Bomb turns every lob into a reliable on-impact explosion that erases clustered waves." },
      { name: "Radiation Beam (Laser + Poison/Cell)", reason: "Radiation Beam fires a beam on hit and adds radiation stacks, which snowball when your volleys land together." },
      { name: "Blizzard (Freeze + Wind)", reason: "Blizzard freezes packs in place so the next volley lands into a helpless clump." },
      { name: "Flash (Light + Lightning)", reason: "Flash is your single Lightning pick, popping the whole screen after a hit for clean follow-ups." }
    ],
    bestPassives: [
      { name: "Magic Staff", reason: "Magic Staff boosts all AoE damage" },
      { name: "Radiant Feather", reason: "Radiant Feather increases launch speed and mobility" },
      { name: "Gemspring", reason: "Gemspring fuels progression with XP orbs" },
      { name: "Eye of the Beholder", reason: "Eye of the Beholder gives extra dodge to survive tight waves." }
    ],
    bestCharacterPair: {
      name: "The Physicist",
      reason: "The Physicist's gravity wells pull enemies together for the Juggler's lightning to rain down perfectly, making the duo one of the best AoE combos in Ball x Pit."
    },
    howToUnlock: "To unlock The Juggler, build the Theater Blueprint, unlocked after clearing the Gory x Grasslands biome. Once constructed, she'll join your roster as a playable character.",
    howToPlay: "Play center and aim slightly ahead so each lob lands as enemies step in. Open with Bomb for instant AoE, add Radiation Beam so every hit sprays damage through the pack, use Blizzard to hold them while you line up the next throw, and let Flash finish the screen after each successful hit. Stack Magic Staff and Pressure Valve to chain explosions, keep Magnet on so XP comes to you, and pair with The Physicist if you want gravity to bunch targets for dead-center landings.",
    image: getCharacterImage("The Juggler")
  },
  {
    name: "The Shieldbearer",
    startingBall: "Iron",
    passive: "Reflective Guard – Holds a large shield that bounces back balls that hit it. Balls deal 100% more damage each time they bounce off the shield.",
    strengths: "Massive HP, powerful reflection scaling, strong synergy with sustain and bleed effects.",
    weaknesses: "Very slow, low fire rate, vulnerable to long-range enemies.",
    bestBalls: [
      { name: "Hemorrhage (Bleed + Iron)", reason: "Hemorrhage detonates bleed stacks for huge burst damage after shield bounces." },
      { name: "Leech (Bleed + Brood Mother)", reason: "Leech adds lifesteal per hit, letting you heal mid-wave." },
      { name: "Virus (Bleed + Poison)", reason: "Virus spreads DoT through enemy clusters while you block hits." },
      { name: "Sacrifice (Bleed + Dark)", reason: "Sacrifice turns stored bleed into massive explosions, perfect for close-range retaliation." }
    ],
    bestPassives: [
      { name: "Breastplate", reason: "Breastplate cuts incoming damage by 10% for longer uptime." },
      { name: "Crown of Thorns", reason: "Crown of Thorns punishes melee hits with splash damage." },
      { name: "Bandage Roll", reason: "Bandage Roll launches baby balls every time you heal, adding free DPS." },
      { name: "Everflowing Goblet", reason: "Everflowing Goblet allows overhealing, keeping your Bandage Roll loop active during long runs." }
    ],
    bestCharacterPair: {
      name: "The Itchy Finger",
      reason: "Itchy Finger's nonstop fire keeps enemies under pressure, feeding Shieldbearer's bleed and reflection chains. Their synergy turns reflected projectiles and damage-over-time effects into a nonstop feedback loop."
    },
    howToUnlock: "To unlock The Shieldbearer, you'll need to build the Iron Fortress Blueprint, which becomes available after clearing the Fungal x Forest biome. Once built, he'll be added to your roster as a playable character.",
    howToPlay: "The Shieldbearer plays best when surrounded. Stay in close range to maximize reflection and bleed triggers, and let enemies destroy themselves against your shield. Focus on evolutions like Hemorrhage and Leech to convert incoming hits into sustain and burst damage. With Crown of Thorns and Bandage Roll, every heal becomes another attack, keeping your damage output steady while your defense holds. When paired with Itchy Finger, your reflected shots and bleed explosions chain endlessly, creating one of the strongest defensive-offensive builds in Ball x Pit.",
    image: getCharacterImage("The Shieldbearer")
  },
  {
    name: "The Physicist",
    startingBall: "Light",
    passive: "Balls are affected by gravity, pulling toward the back of the screen",
    strengths: "Huge crowd control, high AoE/status scaling, excellent clump damage",
    weaknesses: "Low HP, needs positioning, weak if you whiff clusters",
    bestBalls: [
      { name: "Sun (Light + Burn)", reason: "Sun scorches everything his gravity drags in." },
      { name: "Radiation Beam (Laser + Poison/Cell)", reason: "Radiation Beam stacks its damage multiplier per hit." },
      { name: "Blizzard (Freeze + Wind)", reason: "Blizzar freezes the entire group mid-pull, locking targets in place so all chained hits land." },
      { name: "Noxious (Poison + Wind or Dark + Wind)", reason: "Noxious spreads poison between nearby enemies." }
    ],
    bestPassives: [
      { name: "Magic Staff", reason: "Magic Staff boosts all AoE damage" },
      { name: "Radiant Feather", reason: "Radiant Feather increases launch speed and mobility" },
      { name: "Gemspring", reason: "Gemspring fuels progression with XP orbs" },
      { name: "Eye of the Beholder", reason: "Eye of the Beholder gives extra dodge to survive tight waves." }
    ],
    bestCharacterPair: {
      name: "The Juggler",
      reason: "The Physicist's gravity wells pull enemies together for the Juggler's lightning to rain down perfectly, making the duo one of the best AoE combos in Ball x Pit."
    },
    howToUnlock: "To unlock the Physicist, build the Laboratory Blueprint, which is unlocked by clearing the Fungal x Forest biome. Then, head back to the base and build it with the Harvest button.",
    howToPlay: "The Physicist thrives on control. Every shot bends toward the back of the field, pulling enemies together until they're packed tight enough to crush themselves. Stay centered and let gravity do the work while your Radiation and Burn effects eat through entire formations. Focus on Sun and Radiation Beam to melt grouped enemies the moment they cluster. Add Blizzard to freeze them mid-pull for easy follow-ups, then let Noxious spread poison through the entire pack. The synergy compounds fast, chaining damage-over-time effects until nothing walks out alive. Stack Magic Staff and Pressure Valve to supercharge your AoE and make every clustered kill explode into the next. Keep Magnet equipped to absorb XP automatically without moving out of position. When paired with The Juggler, her lobs drop straight into your gravity well, creating an endless cycle of burn, freeze, and decay.",
    image: getCharacterImage("The Physicist")
  },
  {
    name: "The Spendthrift",
    startingBall: "Vampire",
    passive: "Shoots all balls simultaneously in a wide arc",
    strengths: "Huge burst potential, strong sustain, reliable crit scaling",
    weaknesses: "Poor range, fragile without sustain, ineffective at long distances",
    bestBalls: [
      { name: "Mosquito King (Brood Mother + Vampire)", reason: "Spawns mosquitoes that drain enemies and heal you per hit, matching his sustain-heavy playstyle." },
      { name: "Sandstorm (Earthquake + Wind)", reason: "Pass-through AoE and blind to lock down entire waves, buying time for healing to tick." },
      { name: "Frozen Flame (Burn + Freeze)", reason: "Deals burn and frostburn together, compounding damage and amplifying AoE hits from his volleys." },
      { name: "Phantom (Dark + Ghost)", reason: "Adds curse-based burst damage after repeat hits, syncing perfectly with his fast, multi-shot tempo." }
    ],
    bestPassives: [
      { name: "Everflowing Goblet", reason: "Everflowing Goblet amplifies sustain from Vampire effects and pairs perfectly with Mosquito King's healing." },
      { name: "Soul Reaver", reason: "Soul Reaver turns overkill damage into lifesteal for constant recovery in dense waves." },
      { name: "Pressure Valve", reason: "Pressure Valve boosts AoE and on-death effects from Frozen Flame, and Fleet Feet raises both movement and firing rhythm, keeping your wide volleys on target." },
      { name: "Fleet Feet", reason: "Fleet Feet raises both movement and firing rhythm, keeping your wide volleys on target." }
    ],
    bestCharacterPair: {
      name: "The Cohabitants",
      reason: "Their mirrored balls double on-hit effects, perfectly matching Spendthrift's Vampire sustain and wide volleys for full-field coverage."
    },
    howToUnlock: "To unlock the Spendthrift, build the Mansion Blueprint, which unlocks after clearing the Fungal x Forest biome. Once built, he'll become available as a playable character.",
    howToPlay: "Vampire Ball is the core of his identity, since it heals you as long as you keep hitting enemies. Start each run by grabbing control evolutions like Sandstorm or Frozen Flame. These handle early waves and buy time for your sustain loop to kick in. Once you unlock Mosquito King, you'll barely need to dodge, since your constant volleys will spawn lifestealing insects that keep you topped up. Passives like Everflowing Goblet and Soul Reaver push this further, letting you drain enemies faster than they can hurt you. Combine that with Pressure Valve for explosive AoE chain reactions and Fleet Feet to manage your arc spread more easily. He's strongest when you stay aggressive. Keep firing, stay centered, and let the healing do the heavy lifting while you turn every wave into profit.",
    image: getCharacterImage("The Spendthrift")
  },
  {
    name: "The Warrior",
    startingBall: "Bleed",
    passive: "No Passive",
    strengths: "The Warrior's biggest strength is his malleability, given that he has no major quirks or effects.",
    weaknesses: "He may not pack quite the same punch as some of the more impactful characters.",
    bestBalls: [
      { name: "Hemorrhage (Bleed + Iron)", reason: "Hemorrhage drastically boosts damage with this Bleed-focused build." },
      { name: "Leech (Bleed + Brood Mother)", reason: "Leech is an excellent pick to further apply stacks of Bleed, especially to bosses." },
      { name: "Sacrifice (Bleed + Dark)", reason: "Cursed enemies take even more damage when Baby Balls rapidly hit them in this build." },
      { name: "Spider Queen (Brood Mother + Egg Sac)", reason: "Just to multiple your Baby Balls, you can't look past the Spider Queen." }
    ],
    bestPassives: [
      { name: "Cornucopia (Baby Rattle + War Horn)", reason: "The ultimate Baby Ball Passive, the Cornucopia effectively doubles the amount you generate. A must-have for this build." },
      { name: "Slingshot", reason: "For extra Baby Balls, the Slingshot throws even more out upon picking up gems." },
      { name: "Turret", reason: "All in on Baby Balls, the Turret helps add even more to the screen." }
    ],
    bestCharacterPair: {
      name: "The Cohabitants",
      reason: "The Cohabitants are perfect to pair with The Warrior as they complement the Bleed x Baby Ball synergy. Not only do they start with Brood Mother, enabling an Evolution right away, but by duplicating every Ball launched, the Baby Ball multiplier quickly skyrockets."
    },
    howToUnlock: "Thankfully, The Warrior is unlocked by default in Ball x Pit. As soon as you boot up the game for the very first time, you'll have access to this character.",
    howToPlay: "Your goal with The Warrior is to focus entirely on applying Bleed while spamming Baby Balls. This combination effectively deals with dozens of smaller enemies on screen while also proving deadly against spongier bosses. Evolutions like Cornucopia and Spider Queen are essential for the build, while the likes of Hemorrhage will only further boost damage. If done right and in time, you'll be blitzing through any stage without much hassle.",
    image: getCharacterImage("The Warrior")
  },
  {
    name: "The Shade",
    startingBall: "Dark",
    passive: "Balls shoot from the back and have a base critical hit chance of 10%.",
    strengths: "Increased critical hit chance is always handy.",
    weaknesses: "Shooting from the back of the screen gives you far less time to react as enemies pile up.",
    bestBalls: [
      { name: "Holy Laser (Horizontal + Vertical Laser)", reason: "The Holy Laser should be your top priority as The Shade. This way you can deal with enemies all throughout the stage." },
      { name: "Laser Beam (Horizontal or Vertical Laser + Light)", reason: "The Laser Beam is another great option to deal damage in lines, afflicting multiple enemies with blindness in the process." },
      { name: "Radiation Beam (Horizontal or Vertical Laser + Poison or Cell)", reason: "Dealing damage over time is also effective, and that's what the Radiation Beam does best." }
    ],
    bestPassives: [
      { name: "Dynamite", reason: "Dynamite helps with AoE damage as random enemies explode and subsequently hurt those around them." },
      { name: "Ethereal Cloak", reason: "The Ethereal Cloak is a game-changer for this build as your Balls go through enemies. Not only that, but they deal more damage until they hit the back of the field, which, given you fire from the back, takes a good chunk of time." },
      { name: "Magic Staff", reason: "Magic Staff is the most important Passive as it significantly boosts all types of AoE damage." }
    ],
    bestCharacterPair: {
      name: "The Empty Nester",
      reason: "The Empty Nester lets you multiply your primary Balls, radically increasing damage as a result. With the right Evolutions, you can be wiping out waves of enemies in rapid succession."
    },
    howToUnlock: "Simply build the Mausoleum Blueprint to unlock The Shade character in Ball x Pit. This Blueprint is unlocked by clearing the Liminal x Desert biome.",
    howToPlay: "AoE damage is the name of the game when playing as The Shade. Too often enemies can get out of reach as you fire from the back. As new targets spawn in, they're effectively blocking those further down the stage. As such, AoE damage is your key to hitting them. The likes of the Holy Laser are the absolute best pick as a result. When paired with Passives like the Ethereal Cloak, your AoE damage only multiplies, unleashing a constant barrage of attacks on enemies all across the screen.",
    image: getCharacterImage("The Shade")
  },
  {
    name: "The Flagellant",
    startingBall: "Egg Sac",
    passive: "Balls bounce normally off the bottom of your screen.",
    strengths: "Excellent synergy with Baby Balls as they continuously bounce off all sides of the stage.",
    weaknesses: "You won't be getting your Balls back as quickly as with other characters.",
    bestBalls: [
      { name: "Maggot (Cell + Brood Mother)", reason: "Maggot ensures that as enemies die, their bodies explode into a number of additional Baby Balls." },
      { name: "Spider Queen (Brood Mother + Egg Sac)", reason: "A simple one, the Spider Queen has the potential to spawn even more Baby Balls upon hitting an enemy." },
      { name: "Shotgun", reason: "The Shotgun can spawn Iron Baby Balls, dealing a ton more damage than regular ones." },
      { name: "Voluptuous Egg Sac", reason: "To really up the ante, the Voluptuous Egg Sac spawns 2-3 egg sacs upon exploding, further delivering Baby Balls." }
    ],
    bestPassives: [
      { name: "Cornucopia (Baby Rattle + War Horn)", reason: "With Cornucopia, you'll be firing out more Baby Balls than you'll know what to do with." },
      { name: "Slingshot", reason: "The Slingshot can add even more Baby Balls to the mix each time you pick up a gem." },
      { name: "Turret", reason: "Once more for Baby Balls, the Turret fires some out to further add to the chaos." }
    ],
    bestCharacterPair: {
      name: "The Cohabitants",
      reason: "The Cohabitants are the strongest pairing for The Flagellant as they help ramp up Baby Ball generation. By duplicating every Ball launched, you could be seeing hundreds on your screen at once by the time the run draws to an end."
    },
    howToUnlock: "All you need is to build the Monastery Blueprint in order to unlock The Flagellant. This Blueprint can be unlocked by clearing the Gory x Grasslands stage.",
    howToPlay: "The main goal when playing as The Flagellant is to spawn as many Baby Balls as possible. Since they can bounce off the bottom of the screen, they can be in play, and thus, dealing damage, far longer than usual. Thus, Passives like Cornucopia are vital in drastically increasing the sheer amount of Baby Balls on screen. With Evolutions like the Shotgun and Maggot to boot, you'll certainly be dealing enough damage to clear not only waves of regular enemies, but any pesky bosses as well.",
    image: getCharacterImage("The Flagellant")
  },
  {
    name: "The Empty Nester",
    startingBall: "Ghost",
    passive: "No Baby Balls. Each shot shoots multiple instances of one equipped special Ball.",
    strengths: "Firing multiple of your equipped special Ball is extremely powerful with the right build.",
    weaknesses: "Not having any Baby Balls can make things a little less exciting.",
    bestBalls: [
      { name: "Assassin (Iron + Ghost)", reason: "As we start with the Ghost ball, aiming for the Assassin is excellent for high-damage output." },
      { name: "Phantom (Ghost +Dark)", reason: "Phasing through enemies and cursing them is a great way to wipe out tons of smaller foes." },
      { name: "Sandstorm (Earthquake + Wind)", reason: "Another great AoE pick that passes through enemies and damages everyone it touches." },
      { name: "Wraith (Ghost + Freeze)", reason: "Nothing quite beats stopping enemies in their tracks, and when you're phasing through waves of targets all at once, this Evolution can be a game-changer." }
    ],
    bestPassives: [
      { name: "Fleet Feet", reason: "As your focus is on reflecting Balls, moving faster is essential." },
      { name: "Ethereal Cloak", reason: "Just in case you don't get the Balls you want, the Ethereal Cloak is excellent to ensure all attacks go through enemies." },
      { name: "Wagon Wheel", reason: "This Passive adds 30% extra damage every time a Ball bounces off a wall, which happens constantly with this build." }
    ],
    bestCharacterPair: {
      name: "The Shieldbearer",
      reason: "As you start with Ghost, and our focus is to have Balls go through enemies, The Shieldbearer is a tremendous pairing. You can focus on bouncing Balls off the shield for increased damage."
    },
    howToUnlock: "By completing the Snowy x Shores level, you'll acquire the Single Family Home Blueprint. Upon building this Blueprint, you'll immediately unlock The Empty Nester character.",
    howToPlay: "Playing as The Empty Nester might not be quite as thrilling as some other characters, given that there won't be 400 Baby Balls flying on the screen at any given moment. But with the right Evolutions, like the Phantom or the Assassin, you can deal just as much, if not more damage. Not to mention, having your Balls pass through enemies with the Ethereal Cloak sets them up perfectly for additional damage with the Wagon Wheel.",
    image: getCharacterImage("The Empty Nester")
  },
  {
    name: "The Tactician",
    startingBall: "Iron",
    passive: "Battles become turn-based",
    strengths: "Helps you slow down and take your time avoiding incoming damage.",
    weaknesses: "The average run takes 5+ minutes longer than with any other character.",
    bestBalls: [
      { name: "Assassin (Iron + Dark)", reason: "Passes through enemies to deal a ton of damage all at once in a turn." },
      { name: "Bomb (Iron + Burn)", reason: "The Bomb deals tons of AoE damage so that no matter where your shot ends up, it'll be lethal." },
      { name: "Holy Laser (Horizontal + Vertical Laser)", reason: "You can't go wrong with extra AoE damage to ensure you're not missing any targets." },
      { name: "Nuclear Bomb (Bomb + Poison)", reason: "If you've already built the Bomb Evolution, why not go for the Nuclear option and deal even more damage over time?" }
    ],
    bestPassives: [
      { name: "Dynamite", reason: "A great pick for additional AoE damage with every turn." },
      { name: "Magic Staff", reason: "The most important pick for any AoE focused build, the Magic Staff is a must-have for increased damage here." },
      { name: "Pressure Valve", reason: "With the Pressure Valve, every single enemy explodes and damages those around them. What's not to like?" }
    ],
    bestCharacterPair: {
      name: "The Radical",
      reason: "Let's face it, turn-based gameplay isn't the reason you're playing Ball x Pit. Picking The Radical and just letting the duo get to work helps you unlock their unique stat boosts without much manual input required."
    },
    howToUnlock: "The Tactician is unlocked by building the Captain's Headquarters Blueprint, which is unlocked by beating the Smoldering x Depths level.",
    howToPlay: "There are two ways to play as The Tactician. The first is to effectively not play as The Tactician. This is done by pairing him with The Radical to automate gameplay. If you're just keen for their stat boosts on a number of level-specific buildings on your base, this is the most efficient method. However, if you are keen to manually control this turn-based character, picking Evolutions like the Nuclear Bomb along with the Holy Laser can be a huge help in clearing waves of enemies all at once. That's also where the Magic Staff and Dynamite Passives come in to further increase your damage potential.",
    image: getCharacterImage("The Tactician")
  },
  {
    name: "The Makeshift Sisyphus",
    startingBall: "Earthquake",
    passive: "No baby balls. Balls no longer deal damage on direct hit but AoE and status effect damage increased by 4x.",
    strengths: "Huge AoE damage, potential to inflict mass status effects.",
    weaknesses: "No baby balls and must bounce all balls to deal damage.",
    bestBalls: [
      { name: "Magma (Burn + Earthquake)", reason: "Magma pairs perfectly with Sisyphus's Earthquake base." },
      { name: "Sandstorm (Earthquake + Wind)", reason: "Sandstorm's wide coverage and Blind provide reliable crowd control." },
      { name: "Nuclear Bomb (Bomb + Poison)", reason: "Nuclear Bomb combines Poison ticks with massive AoE bursts." },
      { name: "Glacier (Earthquake + Freeze)", reason: "Glacier provides a safer control setup with strong freeze uptime and reliable crowd lockdown." }
    ],
    bestPassives: [
      { name: "Magic Staff", reason: "Boosts AoE damage by 20%, stacking multiplicatively with Sisyphus's innate 4x multiplier." },
      { name: "Breastplate", reason: "Reduces incoming damage by 10%, letting you survive long enough for AoE to scale." },
      { name: "Ethereal Cloak", reason: "Lets balls pass through enemies, multiplying AoE triggers for higher total field coverage." },
      { name: "Everflowing Goblet", reason: "Enables overhealing past max HP, crucial for endurance-heavy Earthquake builds." }
    ],
    bestCharacterPair: {
      name: "The Embedded",
      reason: "Poison stacks multiply perfectly with Sisyphus's AoE scaling, creating constant map-wide damage."
    },
    howToUnlock: "To unlock The Makeshift Sisyphus, you'll need to obtain the Rocky Hill Blueprint. Once you've obtained the Blueprint, build the Rocky Hill location back at the base to unlock The Makeshift Sisyphus.",
    howToPlay: "With the Makeshift Sisyphus, you can forget about aiming. You deal no direct damage, so positioning, timing, and upgrades are everything. Instead, focus on overlapping AoE zones and stacking multiple damage types (Burn, Poison, Bleed) for maximum output. Early on, use Fleet Feet and Breastplate to stay mobile and tanky. Midgame, stack Magic Staff and Ethereal Cloak to amplify AoE chains. Late game, Vampiric Sword keeps you alive while your Earthquake zones delete the map.",
    image: getCharacterImage("The Makeshift Sisyphus")
  },
  {
    name: "The Falconer",
    startingBall: "Lightning",
    passive: "Balls are shot from two falcons flying on the sides of the screen",
    strengths: "Excellent crowd control, strong lane denial, consistent damage uptime",
    weaknesses: "Lower single-target burst, weaker against fast lone enemies",
    bestBalls: [
      { name: "Storm (Lightning + Wind)", reason: "Side-fired lightning constantly strikes inward, shredding clustered enemies before they reach mid-screen." },
      { name: "Blizzard (Lightning + Freeze)", reason: "Freezing zones overlap perfectly from both sides, slowing waves and keeping enemies stuck in kill lanes." },
      { name: "Lightning Rod (Lightning + Iron)", reason: "Falcon shots plant rods deep into lanes, basically chaining lightning across entire enemy groups." },
      { name: "Lovestruck (Lightning + Charm)", reason: "Wide charm coverage turns enemy pressure inward and adds steady healing during longer waves." }
    ],
    bestPassives: [
      { name: "Ethereal Cloak", reason: "Side shots pass through enemies, which massively increases hit count across lanes." },
      { name: "Fleet Feet", reason: "Lets you reposition without interrupting falcon fire, so lanes are aligned." },
      { name: "Magic Staff", reason: "Boosts AoE effects from Storm, Blizzard, and Lightning chains." },
      { name: "Pressure Valve", reason: "Turns Falconer's constant chip damage into explosive wave clears." }
    ],
    bestCharacterPair: {
      name: "The Embedded",
      reason: "Piercing shots remove the Falconer's only real weakness. With nothing stopping balls early, side-fired attacks tear through full enemy columns, which helps you keep pressure constant from start to finish."
    },
    howToUnlock: "To unlock the Falconer, clear the Heavenly x Gates biome to obtain the Falconry Hut blueprint. Build the Falconry Hut at your base to add him to your roster.",
    howToPlay: "Lightning Ball defines the Falconer's identity. Since shots come from the sides, your goal isn't perfect aim, it's coverage. Early runs feel best when you lean into control evolutions like Storm or Blizzard. These slow waves down and let your falcons stack damage safely before enemies ever reach you. Once Lightning Rod is online, lanes start clearing themselves. Passives that improve AoE and movement matter more than raw damage. Fleet Feet keeps your firing angles clean, while Ethereal Cloak ensures nothing blocks your pressure early. From there, Pressure Valve turns steady damage into clean clears.",
    image: getCharacterImage("The Falconer")
  },
  {
    name: "The Carouser",
    startingBall: "Charm",
    passive: "Balls briefly orbit around the player when on a return trajectory",
    strengths: "High status uptime, strong crowd control, reliable sustain, safe mid-range pressure",
    weaknesses: "Low burst damage, positioning dependent, weaker at long range",
    bestBalls: [
      { name: "Berserk (Charm + Burn or Bleed)", reason: "Orbiting balls dramatically increase hit frequency, causing enemies to berserk constantly and damage each other in tight groups." },
      { name: "Lovestruck (Charm + Light or Lightning)", reason: "Repeated orbit hits keep lovestruck active, providing steady healing while you stay aggressive near enemies." },
      { name: "Incubus (Charm + Dark)", reason: "Orbit time spreads curse naturally through charmed enemies, stacking delayed burst damage without precision aiming." },
      { name: "Succubus (Charm + Vampire)", reason: "Lower proc chance is offset by orbit uptime, resulting in consistent charm triggers and extra sustain in longer fights." }
    ],
    bestPassives: [
      { name: "Crown of Thorns", reason: "Turns close-range pressure into safety by destroying nearby enemies when you take a hit." },
      { name: "Wretched Onion", reason: "Constant damage to enemies within range, perfectly matching Carouser's orbit-heavy, proximity-based playstyle." },
      { name: "Everflowing Goblet", reason: "Charm healing benefits from overheal, giving Carouser room to stay aggressive in dense waves." },
      { name: "Fleet Feet", reason: "Movement speed keeps enemies inside orbit range and allows safer repositioning without losing pressure." }
    ],
    bestCharacterPair: {
      name: "The Repentant",
      reason: "Their mirrored balls double on-hit effects, perfectly matching Spendthrift's Vampire sustain and wide volleys for full-field coverage."
    },
    howToUnlock: "To unlock The Carouser, clear the Vast x Void biome to obtain the Party House blueprint. Build the Party House in your base to make him available as a playable character.",
    howToPlay: "Charm Ball is really the heart of how the Carouser works. He gets stronger the longer balls hang around him, so instead of pushing enemies away, you want to keep them close and let the hits stack up naturally. Early runs feel best when you lean into control evolutions like Berserk or Incubus. They calm things down, give you breathing room, and help you settle into that circling rhythm where enemies are always just close enough. Once the orbiting kicks in, Charm effects start triggering almost on their own, and fights become far less frantic. Passives that reward proximity do most of the heavy lifting from there. Wretched Onion quietly chips away at anything nearby, Everflowing Goblet turns small heals into something you can rely on, and Crown of Thorns is there for the moments when things get a bit too crowded. Fleet Feet ties it together, letting you reposition smoothly without breaking that orbit pressure.",
    image: getCharacterImage("The Carouser")
  }
];

