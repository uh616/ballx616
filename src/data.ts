interface Evolution {
  result: string;
  components: string[];
  resultImage?: string;
}

interface Item {
  name: string;
  image: string;
  evolutions?: Evolution[];
}

// Helper function to get wiki image URL
function wikiImage(name: string): string {
  const encoded = encodeURIComponent(name.replace(/\s+/g, '_'));
  return `https://static.wikia.nocookie.net/ballpit/images/${encoded}.png/revision/latest?cb=20251024023810`;
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
    } else {
      map.set(item.name, { ...item });
    }
  });
  
  return Array.from(map.values());
}

// Balls data - based on Ball X Pit wiki
const ballsRaw: Item[] = [
  // Balls with evolutions
  {
    name: "Fire Ball",
    image: wikiImage("Fire_Ball"),
    evolutions: [
      {
        result: "Inferno Ball",
        components: ["Fire Ball", "Fire Ball"]
      },
      {
        result: "Magma Ball",
        components: ["Fire Ball", "Stone Ball"]
      },
      {
        result: "Steam Ball",
        components: ["Fire Ball", "Water Ball"]
      },
      {
        result: "Plasma Ball",
        components: ["Fire Ball", "Lightning Ball"]
      }
    ]
  },
  {
    name: "Ice Ball",
    image: wikiImage("Ice_Ball"),
    evolutions: [
      {
        result: "Frost Ball",
        components: ["Ice Ball", "Ice Ball"]
      },
      {
        result: "Blizzard Ball",
        components: ["Ice Ball", "Wind Ball"]
      }
    ]
  },
  {
    name: "Poison Ball",
    image: wikiImage("Poison_Ball"),
    evolutions: [
      {
        result: "Venom Ball",
        components: ["Poison Ball", "Poison Ball"]
      },
      {
        result: "Acid Ball",
        components: ["Poison Ball", "Water Ball"]
      }
    ]
  },
  {
    name: "Lightning Ball",
    image: wikiImage("Lightning_Ball"),
    evolutions: [
      {
        result: "Thunder Ball",
        components: ["Lightning Ball", "Lightning Ball"]
      },
      {
        result: "Plasma Ball",
        components: ["Lightning Ball", "Fire Ball"]
      }
    ]
  },
  {
    name: "Stone Ball",
    image: wikiImage("Stone_Ball"),
    evolutions: [
      {
        result: "Boulder Ball",
        components: ["Stone Ball", "Stone Ball"]
      },
      {
        result: "Magma Ball",
        components: ["Stone Ball", "Fire Ball"]
      }
    ]
  },
  {
    name: "Wind Ball",
    image: wikiImage("Wind_Ball"),
    evolutions: [
      {
        result: "Storm Ball",
        components: ["Wind Ball", "Wind Ball"]
      },
      {
        result: "Blizzard Ball",
        components: ["Wind Ball", "Ice Ball"]
      }
    ]
  },
  {
    name: "Water Ball",
    image: wikiImage("Water_Ball"),
    evolutions: [
      {
        result: "Tsunami Ball",
        components: ["Water Ball", "Water Ball"]
      },
      {
        result: "Steam Ball",
        components: ["Water Ball", "Fire Ball"]
      },
      {
        result: "Acid Ball",
        components: ["Water Ball", "Poison Ball"]
      }
    ]
  },
  {
    name: "Metal Ball",
    image: wikiImage("Metal_Ball"),
    evolutions: [
      {
        result: "Steel Ball",
        components: ["Metal Ball", "Metal Ball"]
      }
    ]
  },
  {
    name: "Wood Ball",
    image: wikiImage("Wood_Ball"),
    evolutions: [
      {
        result: "Nature Ball",
        components: ["Wood Ball", "Wood Ball"]
      }
    ]
  },
  {
    name: "Dark Ball",
    image: wikiImage("Dark_Ball"),
    evolutions: [
      {
        result: "Shadow Ball",
        components: ["Dark Ball", "Dark Ball"]
      }
    ]
  },
  {
    name: "Light Ball",
    image: wikiImage("Light_Ball"),
    evolutions: [
      {
        result: "Holy Ball",
        components: ["Light Ball", "Light Ball"]
      }
    ]
  },
  // Balls without evolutions
  {
    name: "Basic Ball",
    image: wikiImage("Basic_Ball")
  },
  {
    name: "Spike Ball",
    image: wikiImage("Spike_Ball")
  },
  {
    name: "Bomb Ball",
    image: wikiImage("Bomb_Ball")
  },
  {
    name: "Chain Ball",
    image: wikiImage("Chain_Ball")
  },
  {
    name: "Split Ball",
    image: wikiImage("Split_Ball")
  },
  {
    name: "Pierce Ball",
    image: wikiImage("Pierce_Ball")
  },
  {
    name: "Bounce Ball",
    image: wikiImage("Bounce_Ball")
  },
  {
    name: "Homing Ball",
    image: wikiImage("Homing_Ball")
  },
  {
    name: "Explosive Ball",
    image: wikiImage("Explosive_Ball")
  },
  {
    name: "Multi Ball",
    image: wikiImage("Multi_Ball")
  }
];

export const ballsData = mergeItems(ballsRaw);

// Passives data - based on Ball X Pit wiki
const passivesRaw: Item[] = [
  // Passives with evolutions
  {
    name: "Vampiric Sword",
    image: wikiImage("Vampiric_Sword"),
    evolutions: [
      {
        result: "Soul Reaver",
        components: ["Vampiric Sword", "Everflowing Goblet"]
      }
    ]
  },
  {
    name: "Everflowing Goblet",
    image: wikiImage("Everflowing_Goblet"),
    evolutions: [
      {
        result: "Soul Reaver",
        components: ["Vampiric Sword", "Everflowing Goblet"]
      }
    ]
  },
  {
    name: "Spiked Collar",
    image: wikiImage("Spiked_Collar"),
    evolutions: [
      {
        result: "Tormenters Mask",
        components: ["Spiked Collar", "Crown Of Thorns"]
      }
    ]
  },
  {
    name: "Crown Of Thorns",
    image: wikiImage("Crown_Of_Thorns"),
    evolutions: [
      {
        result: "Tormenters Mask",
        components: ["Spiked Collar", "Crown Of Thorns"]
      }
    ]
  },
  {
    name: "Radiant Feather",
    image: wikiImage("Radiant_Feather"),
    evolutions: [
      {
        result: "Wings of the Anointed",
        components: ["Radiant Feather", "Fleet Feet"]
      }
    ]
  },
  {
    name: "Fleet Feet",
    image: wikiImage("Fleet_Feet"),
    evolutions: [
      {
        result: "Wings of the Anointed",
        components: ["Radiant Feather", "Fleet Feet"]
      }
    ]
  },
  {
    name: "Ghostly Corset",
    image: wikiImage("Ghostly_Corset"),
    evolutions: [
      {
        result: "Piercing Regalia",
        components: ["Ghostly Corset", "Ethereal Cloak"]
      }
    ]
  },
  {
    name: "Ethereal Cloak",
    image: wikiImage("Ethereal_Cloak"),
    evolutions: [
      {
        result: "Piercing Regalia",
        components: ["Ghostly Corset", "Ethereal Cloak"]
      }
    ]
  },
  {
    name: "Diamond Hilted Dagger",
    image: wikiImage("Diamond_Hilted_Dagger"),
    evolutions: [
      {
        result: "Deadeye's Cross",
        components: ["Diamond Hilted Dagger", "Sapphire Hilted Dagger", "Ruby Hilted Dagger", "Emerald Hilted Dagger"]
      }
    ]
  },
  {
    name: "Sapphire Hilted Dagger",
    image: wikiImage("Sapphire_Hilted_Dagger"),
    evolutions: [
      {
        result: "Deadeye's Cross",
        components: ["Diamond Hilted Dagger", "Sapphire Hilted Dagger", "Ruby Hilted Dagger", "Emerald Hilted Dagger"]
      }
    ]
  },
  {
    name: "Ruby Hilted Dagger",
    image: wikiImage("Ruby_Hilted_Dagger"),
    evolutions: [
      {
        result: "Deadeye's Cross",
        components: ["Diamond Hilted Dagger", "Sapphire Hilted Dagger", "Ruby Hilted Dagger", "Emerald Hilted Dagger"]
      }
    ]
  },
  {
    name: "Emerald Hilted Dagger",
    image: wikiImage("Emerald_Hilted_Dagger"),
    evolutions: [
      {
        result: "Deadeye's Cross",
        components: ["Diamond Hilted Dagger", "Sapphire Hilted Dagger", "Ruby Hilted Dagger", "Emerald Hilted Dagger"]
      }
    ]
  },
  // Passives without evolutions
  {
    name: "Archer's Effigy",
    image: wikiImage("Archers_Effigy")
  },
  {
    name: "Artificial Heart",
    image: wikiImage("Artificial_Heart")
  },
  {
    name: "Bloodthirsty Blade",
    image: wikiImage("Bloodthirsty_Blade")
  },
  {
    name: "Bone Armor",
    image: wikiImage("Bone_Armor")
  },
  {
    name: "Cursed Amulet",
    image: wikiImage("Cursed_Amulet")
  },
  {
    name: "Death's Scythe",
    image: wikiImage("Deaths_Scythe")
  },
  {
    name: "Demon's Horn",
    image: wikiImage("Demons_Horn")
  },
  {
    name: "Dragon Scale",
    image: wikiImage("Dragon_Scale")
  },
  {
    name: "Eternal Flame",
    image: wikiImage("Eternal_Flame")
  },
  {
    name: "Frozen Heart",
    image: wikiImage("Frozen_Heart")
  },
  {
    name: "Golden Crown",
    image: wikiImage("Golden_Crown")
  },
  {
    name: "Iron Will",
    image: wikiImage("Iron_Will")
  },
  {
    name: "Magic Ring",
    image: wikiImage("Magic_Ring")
  },
  {
    name: "Phoenix Feather",
    image: wikiImage("Phoenix_Feather")
  },
  {
    name: "Shadow Cloak",
    image: wikiImage("Shadow_Cloak")
  },
  {
    name: "Thunder Hammer",
    image: wikiImage("Thunder_Hammer")
  },
  {
    name: "Void Stone",
    image: wikiImage("Void_Stone")
  },
  {
    name: "Warrior's Shield",
    image: wikiImage("Warriors_Shield")
  },
  {
    name: "Wizard's Staff",
    image: wikiImage("Wizards_Staff")
  }
];

export const passivesData = mergeItems(passivesRaw);

