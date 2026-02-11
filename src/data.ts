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
}

// Helper function to get local image path
function getLocalImage(name: string, type: 'balls' | 'passives'): string {
  const BASE = (import.meta as any).env.BASE_URL || '/';

  // Специальные случаи, где имена файлов не совпадают с шаблоном
  const overrides: Record<string, string> = {
    // Balls
    'Egg-Sac|balls': `${BASE}images/balls/Egg-Sac.webp`,
    'Laser-Horizontal|balls': `${BASE}images/balls/Laser_horizontal.webp`,
    'Laser-Vertical|balls': `${BASE}images/balls/Laser_vertical.webp`,
    // Passives / evolved passives
    'Deadeyes_Impaler|passives': `${BASE}images/passives/Deadeye-Impaler.webp`,
    'Grotesque_Artillery|passives': `${BASE}images/passives/Grotesque-Artillery.webp`,
    'Cornucopia|passives': `${BASE}images/passives/Cornucopia.webp`,
    'Odiferous_Shell|passives': `${BASE}images/passives/Odiferous_Shell.webp`,
    'Phantom_Regalia|passives': `${BASE}images/passives/Phantom_Regalia.webp`,
    'Soul_Reaver|passives': `${BASE}images/passives/Soul_Reaver.webp`,
    'Tormenters_Mask|passives': `${BASE}images/passives/Tormenters_Mask.webp`,
    'Wings_Of_The_Anointed|passives': `${BASE}images/passives/Wings_Of_The_Anointed.webp`
  };

  // Нормализуем базовое имя - приводим к формату имени файла
  let baseName = name
    .replace(/\s+/g, '_')
    .replace(/'/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .trim();

  // Сначала пробуем override по оригинальному имени, потом по нормализованному
  const overrideKeyRaw = `${name}|${type}`;
  const overrideKeyNormalized = `${baseName}|${type}`;
  if (overrides[overrideKeyRaw]) return overrides[overrideKeyRaw];
  if (overrides[overrideKeyNormalized]) return overrides[overrideKeyNormalized];
  
  // Для шаров формат: Name_Ball.webp
  if (type === 'balls') {
    return `${BASE}images/${type}/${baseName}_Ball.webp`;
  }
  
  // Для пассивов формат: Name.webp (например, Archers_Effigy.webp)
  return `${BASE}images/${type}/${baseName}.webp`;
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
    image: getLocalImage("Brood-Mother", "passives"),
    description: "Has a 25% chance of birthing a baby ball each time it hits an enemy."
  },
  {
    name: "Egg Sac",
    image: getLocalImage("Egg-Sac", "passives"),
    description: "Explodes into 2-4 baby balls on hitting an enemy. Has a 3 second cooldown before it can be shot again."
  },
  {
    name: "Earthquake",
    image: getLocalImage("Earthquake", "passives"),
    description: "Deals 5-13 damage to nearby units in a 3x3 tile square."
  },
  {
    name: "Laser (Horizontal)",
    image: getLocalImage("Laser-Horizontal", "passives"),
    description: "Deals 9-18 damage to all enemies in the same row."
  },
  {
    name: "Laser (Vertical)",
    image: getLocalImage("Laser-Vertical", "passives"),
    description: "Deals 9-18 damage to all enemies in the same column."
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
        components: ["Iron", "Dark"]
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
        components: ["Charm", "Burn"]
      }
    ]
  },
  {
    name: "Black Hole",
    image: getLocalImage("Black-Hole", "balls"),
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
    image: getLocalImage("Freeze-Ray", "balls"),
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
    image: getLocalImage("Frozen-Flame", "balls"),
    description: "Adds 1 stack of frostburn on hit (max 4 stacks) for 20 seconds. Frostburnt units take 8-12 damage per stack per second and receive 25% more damage from other sources.",
    evolutions: [
      {
        result: "Frozen Flame",
        components: ["Burn", "Freeze"]
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
    image: getLocalImage("Holy-Laser", "balls"),
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
    name: "Laser Beam",
    image: getLocalImage("Laser-Beam", "balls"),
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
    image: getLocalImage("Lightning-Rod", "balls"),
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
    image: getLocalImage("Mosquito-King", "balls"),
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
    image: getLocalImage("Mosquito-Swarm", "balls"),
    description: "Explodes into 3-6 mosquitos. Mosquitos attack random enemies, dealing 80-120 damage each. If a mosquito kills an enemy, they steal 1 health.",
    evolutions: [
      {
        result: "Mosquito Swarm",
        components: ["Vampire", "Egg Sac"]
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
        components: ["Dark", "Wind"]
      }
    ]
  },
  {
    name: "Nuclear Bomb",
    image: getLocalImage("Nuclear-Bomb", "balls"),
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
    image: getLocalImage("Radiation-Beam", "balls"),
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
    image: getLocalImage("Soul-Sucker", "balls"),
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
    image: getLocalImage("Spider-Queen", "balls"),
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
    image: getLocalImage("Vampire-Lord", "balls"),
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
    image: getLocalImage("Vampiric-Sword", "passives"),
    description: "Each kill heals you by 5, but each shot you take deals 2 damage to you",
    evolutions: [
      {
        result: "Soul Reaver",
        components: ["Vampiric Sword", "Everflowing Goblet"]
      }
    ]
  },
  {
    name: "Everflowing Goblet",
    image: getLocalImage("Everflowing-Goblet", "passives"),
    description: "You can heal past max health at 20% efficiency.",
    evolutions: [
      {
        result: "Soul Reaver",
        components: ["Vampiric Sword", "Everflowing Goblet"]
      }
    ]
  },
  {
    name: "Soul Reaver",
    image: getLocalImage("Soul_Reaver", "passives"),
    description: "Each kill grants 1 HP and you can overheal by 30%."
  },
  {
    name: "Spiked Collar",
    image: getLocalImage("Spiked-Collar", "passives"),
    description: "Deal 30-50 to enemies the first time you get into their melee attack range",
    evolutions: [
      {
        result: "Tormentor's Mask",
        components: ["Spiked Collar", "Crown of Thorns"]
      }
    ]
  },
  {
    name: "Crown of Thorns",
    image: getLocalImage("Crown-of-Thorns", "passives"),
    description: "Destroy the 2 nearest enemies when you are hit from close range.",
    evolutions: [
      {
        result: "Tormentor's Mask",
        components: ["Spiked Collar", "Crown of Thorns"]
      }
    ]
  },
  {
    name: "Tormentor's Mask",
    image: getLocalImage("Tormenters_Mask", "passives"),
    description: "Reflects damage back onto enemies."
  },
  {
    name: "Radiant Feather",
    image: getLocalImage("Radiant-Feather", "passives"),
    description: "Increase ball launch speed by 20% but get knocked back a little each time you shoot a ball",
    evolutions: [
      {
        result: "Wings of the Anointed",
        components: ["Radiant Feather", "Fleet Feet"]
      }
    ]
  },
  {
    name: "Fleet Feet",
    image: getLocalImage("Fleet-Feet", "passives"),
    description: "Increase movement speed by 10% and move at full speed while shooting.",
    evolutions: [
      {
        result: "Wings of the Anointed",
        components: ["Radiant Feather", "Fleet Feet"]
      }
    ]
  },
  {
    name: "Wings of the Anointed",
    image: getLocalImage("Wings_Of_The_Anointed", "passives"),
    description: "Movement and ball speed buffed by 20% and 40% respectively. Also grants immunity to environmental hazards."
  },
  {
    name: "Ghostly Corset",
    image: getLocalImage("Ghostly-Corset", "passives"),
    description: "Balls go through enemies and deal 20% bonus damage when hitting them from the side.",
    evolutions: [
      {
        result: "Phantom Regalia",
        components: ["Ghostly Corset", "Ethereal Cloak"]
      }
    ]
  },
  {
    name: "Ethereal Cloak",
    image: getLocalImage("Ethereal-Cloak", "passives"),
    description: "Balls go through enemies and 25% bonus damage until they hit the back of the field.",
    evolutions: [
      {
        result: "Phantom Regalia",
        components: ["Ghostly Corset", "Ethereal Cloak"]
      }
    ]
  },
  {
    name: "Phantom Regalia",
    image: getLocalImage("Phantom_Regalia", "passives"),
    description: "Balls phase through enemies, dealing 50% more damage."
  },
  {
    name: "Diamond Hilted Dagger",
    image: getLocalImage("Diamond-Hilted-Dagger", "passives"),
    description: "Increase crit chance to 20% when hitting enemies in the front.",
    evolutions: [
      {
        result: "Deadeye's Cross",
        components: ["Diamond Hilted Dagger", "Sapphire Hilted Dagger", "Ruby Hilted Dagger", "Emerald Hilted Dagger"]
      }
    ]
  },
  {
    name: "Sapphire Hilted Dagger",
    image: getLocalImage("Sapphire_Hilted_Dagger", "passives"),
    description: "Increase crit chance to 30% when hitting enemies on their left side.",
    evolutions: [
      {
        result: "Deadeye's Cross",
        components: ["Diamond Hilted Dagger", "Sapphire Hilted Dagger", "Ruby Hilted Dagger", "Emerald Hilted Dagger"]
      }
    ]
  },
  {
    name: "Ruby Hilted Dagger",
    image: getLocalImage("Ruby_Hilted_Dagger", "passives"),
    description: "Increase crit chance to 15% when hitting enemies in the back",
    evolutions: [
      {
        result: "Deadeye's Cross",
        components: ["Diamond Hilted Dagger", "Sapphire Hilted Dagger", "Ruby Hilted Dagger", "Emerald Hilted Dagger"]
      }
    ]
  },
  {
    name: "Emerald Hilted Dagger",
    image: getLocalImage("Emerald_Hilted_Dagger", "passives"),
    description: "Increase crit chance to 20% when hitting enemies on their right side.",
    evolutions: [
      {
        result: "Deadeye's Cross",
        components: ["Diamond Hilted Dagger", "Sapphire Hilted Dagger", "Ruby Hilted Dagger", "Emerald Hilted Dagger"]
      }
    ]
  },
  {
    name: "Baby Rattle",
    image: getLocalImage("Baby_Rattle", "passives"),
    description: "Gain 1.5x baby balls, but your aim becomes scattered.",
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
    description: "Has the chance to create an additional baby ball each time one spawns."
  },
  {
    name: "War Horn",
    image: getLocalImage("War_Horn", "passives"),
    description: "All baby balls deal 20% more damage",
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
    evolutions: [
      {
        result: "Odiferous Shell",
        components: ["Breastplate", "Wretched Onion"]
      }
    ]
  },
  {
    name: "Wretched Onion",
    image: getLocalImage("Wretched_Onion", "passives"),
    description: "Deal 6-12 per second to enemies within 2 tiles",
    evolutions: [
      {
        result: "Odiferous Shell",
        components: ["Breastplate", "Wretched Onion"]
      }
    ]
  },
  {
    name: "Odiferous Shell",
    image: getLocalImage("Odiferous_Shell", "passives"),
    description: "Improved armor, debuff resistance, and defense."
  },
  {
    name: "Deadeye's Amulet",
    image: getLocalImage("Deadeyes_Amulet", "passives"),
    description: "Critical hits deal 10-15 bonus damage.",
    evolutions: [
      {
        result: "Gracious Impaler",
        components: ["Deadeye's Amulet", "Reacher's Spear"]
      }
    ]
  },
  {
    name: "Reacher's Spear",
    image: getLocalImage("Reachers_Spear", "passives"),
    description: "Increase crit chance to 20% when hitting enemies in the same column as you",
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
    description: "Floats around your character and shoots a random level 1 unevolved special ball at enemies every 8.0 seconds."
  },
  {
    name: "Deadeye's Cross",
    image: getLocalImage("Deadeyes_Cross", "passives"),
    description: "Creates a new weapon with greater accuracy and improved critical damage.",
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
    description: "Floats around your character and shoots a random level 1 unevolved special ball at enemies every 8.0 seconds."
  },
  
  // Passives without evolutions
  {
    name: "Archer's Effigy",
    image: getLocalImage("Archers_Effigy", "passives"),
    description: "Every 7-12 rows, spawn a stone archer with 219 health on your side. Stone archers are immune to ball damage and shoot arrows at enemies."
  },
  {
    name: "Artificial Heart",
    image: getLocalImage("Artificial_Heart", "passives"),
    description: "Friendly pieces gain 100% more health."
  },
  {
    name: "Bandage Roll",
    image: getLocalImage("Bandage_Roll", "passives"),
    description: "Shoot 1-2 baby balls each time you're healed."
  },
  {
    name: "Bottled Tornado",
    image: getLocalImage("Bottled_Tornado", "passives"),
    description: "When you catch a special ball, automatically shoot 1-3 new baby balls in random directions."
  },
  {
    name: "Cursed Elixir",
    image: getLocalImage("Cursed_Elixir", "passives"),
    description: "When a poisoned enemy dies, 10% chance for them to come back as a zombie with 329 health."
  },
  {
    name: "Dynamite",
    image: getLocalImage("Dynamite", "passives"),
    description: "Every 5-10 rows, spawn an enemy with dynamite attached to them. Destroying them will deal 200-500 damage to nearby enemies."
  },
  {
    name: "Eye of the Beholder",
    image: getLocalImage("Eye_of_the_Beholder", "passives"),
    description: "10% chance to dodge incoming attacks."
  },
  {
    name: "Frozen Spike",
    image: getLocalImage("Frozen_Spike", "passives"),
    description: "When an enemy is frozen, they emit a chill to nearby enemies that deals 10-20 damage."
  },
  {
    name: "Gemspring",
    image: getLocalImage("Gemspring", "passives"),
    description: "Every 7-11 rows, spawn a Gemspring. Dealing damage to them causes them to drop an increasing amount of XP gems."
  },
  {
    name: "Ghostly Shield",
    image: getLocalImage("Ghostly_Shield", "passives"),
    description: "Balls go through allies and heal them for 2 health."
  },
  {
    name: "Golden Bull",
    image: getLocalImage("Golden_Bull", "passives"),
    description: "Every 7-11 rows, spawn a golden bull with 548 health on your side. Golden Bulls accrue 10 Gold per minute."
  },
  {
    name: "Hand Mirror",
    image: getLocalImage("Hand_Mirror", "passives"),
    description: "Projectiles have a 50% chance to reflect upon hitting you, dealing 20-40 damage if they hit an enemy."
  },
  {
    name: "Healer's Effigy",
    image: getLocalImage("Healers_Effigy", "passives"),
    description: "Every 7-12 rows, spawn a stone healer with 137 health on your side, which heals you 10 health per minute when it's on the field."
  },
  {
    name: "Hourglass",
    image: getLocalImage("Hourglass", "passives"),
    description: "Balls deal 150% damage but damage decays by 30% with each bounce."
  },
  {
    name: "Kiss of Death",
    image: getLocalImage("Kiss_of_Death", "passives"),
    description: "Charmed enemies have a 10% chance of dying after recovering."
  },
  {
    name: "Lover's Quiver",
    image: getLocalImage("Lovers_Quiver", "passives"),
    description: "Projectiles have a 40% chance to heal you for 1 health instead of hurting you"
  },
  {
    name: "Magic Staff",
    image: getLocalImage("Magic_Staff", "passives"),
    description: "Increase area-of-effect damage by 20%"
  },
  {
    name: "Magnet",
    image: getLocalImage("Magnet", "passives"),
    description: "Increase range at which you pick up items and catch balls"
  },
  {
    name: "Midnight Oil",
    image: getLocalImage("Midnight_Oil", "passives"),
    description: "Balls that hit flaming enemies light on fire and deal 10-20 bonus fire damage on the next hit"
  },
  {
    name: "Pressure Valve",
    image: getLocalImage("Pressure_Valve", "passives"),
    description: "Enemies explode on death, dealing 20-30 damage to adjacent enemies"
  },
  {
    name: "Protective Charm",
    image: getLocalImage("Protective_Charm", "passives"),
    description: "Gain a shield that blocks the next damage you would receive. Recharges after 60 seconds"
  },
  {
    name: "Rubber Headband",
    image: getLocalImage("Rubber_Headband", "passives"),
    description: "Balls start off at 70% speed but increase by 20% each bounce (max 200%)"
  },
  {
    name: "Shortbow",
    image: getLocalImage("Shortbow", "passives"),
    description: "Increase fire rate by 15%"
  },
  {
    name: "Silver Blindfold",
    image: getLocalImage("Silver_Blindfold", "passives"),
    description: "Increase crit chance to 20% when hitting blinded enemies."
  },
  {
    name: "Silver Bullet",
    image: getLocalImage("Silver_Bullet", "passives"),
    description: "Balls deal 20% bonus damage until they hit a wall"
  },
  {
    name: "Slingshot",
    image: getLocalImage("Slingshot", "passives"),
    description: "25% chance to launch a baby ball when you pick up a gem"
  },
  {
    name: "Stone Effigy",
    image: getLocalImage("Stone_Effigy", "passives"),
    description: "Every 7-12 rows, spawn a stone soldier with 247 health on your side"
  },
  {
    name: "Traitor's Cowl",
    image: getLocalImage("Traitors_Cowl", "passives"),
    description: "Stone allies can now be damaged by your balls, but you heal by 2 when a ball hits one."
  },
  {
    name: "Upturned Hatchet",
    image: getLocalImage("Upturned_Hatchet", "passives"),
    description: "Balls deal 80% more damage after hitting the back of the field, otherwise damage is reduced by 20%"
  },
  {
    name: "Voodoo Doll",
    image: getLocalImage("Voodoo_Doll", "passives"),
    description: "Curse has a 10% chance of killing enemies."
  },
  {
    name: "Wagon Wheel",
    image: getLocalImage("Wagon_Wheel", "passives"),
    description: "Each time a ball hits a wall, it deals 30% extra damage on the next hit"
  },
  {
    name: "Iron Onesie",
    image: getLocalImage("Iron_Onesie", "passives"),
    description: "Balls deal 0.8% more damage for each baby ball on the field."
  }
];

export const passivesData = mergeItems(passivesRaw);

