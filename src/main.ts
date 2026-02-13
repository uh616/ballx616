import { ballsData, passivesData, characterCombos, characterTiers, buildGuides } from './data';
import '../style.css';

const BASE = (import.meta as any).env.BASE_URL || '/';
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');
  console.log('Balls data:', ballsData.length);
  console.log('Passives data:', passivesData.length);
  console.log('Character combos:', characterCombos.length);
  preloadImages();
  setupTabs();
  setupSearch();
  renderBalls();
  setupModal();
  setupTonAddress();
});

// Простое предзагружение всех иконок, чтобы меньше было подлагиваний и миганий
function preloadImages() {
  const urls = new Set<string>();

  [...ballsData, ...passivesData].forEach((item) => {
    if (item.image) {
      urls.add(item.image);
    }
  });

  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}


function setupTonAddress() {
  const tonLink = document.getElementById('ton-address');
  if (!tonLink) return;

  tonLink.addEventListener('click', (e) => {
    e.preventDefault();
    const address = tonLink.getAttribute('data-address');
    if (!address) return;

    // Копируем адрес в буфер обмена
    navigator.clipboard.writeText(address).then(() => {
      // Временно меняем текст для обратной связи
      const originalText = tonLink.textContent;
      tonLink.textContent = 'Copied!';
      tonLink.style.color = 'var(--pink-main)';
      
      setTimeout(() => {
        tonLink.textContent = originalText;
        tonLink.style.color = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = address;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        const originalText = tonLink.textContent;
        tonLink.textContent = 'Copied!';
        setTimeout(() => {
          tonLink.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    });
  });
}

function setupTabs() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab') as 'balls' | 'passives' | 'characters' | 'characters-tier' | 'build-guides' | 'best-base';
      
      navButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(t => t.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`${tab}-tab`)?.classList.add('active');
      
      if (tab === 'balls') {
        renderBalls();
      } else if (tab === 'passives') {
        renderPassives();
      } else if (tab === 'characters') {
        renderCharacterCombos();
      } else if (tab === 'characters-tier') {
        renderCharacterTiers();
      } else if (tab === 'build-guides') {
        renderBuildGuides();
      } else if (tab === 'best-base') {
        renderBestBaseLayout();
      }
    });
  });
}

function setupSearch() {
  const ballsSearch = document.getElementById('balls-search') as HTMLInputElement;
  const passivesSearch = document.getElementById('passives-search') as HTMLInputElement;

  ballsSearch?.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    filterAndRender(ballsData, 'balls', query);
  });

  passivesSearch?.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    filterAndRender(passivesData, 'passives', query);
  });
}

function filterAndRender(data: Item[], type: 'balls' | 'passives', query: string) {
  if (type === 'balls') {
    // Для шаров: если строка поиска пустая, возвращаемся к "дефолтному" виду,
    // где показаны только компоненты (renderBalls уже делает нужный фильтр)
    if (!query) {
      renderBalls();
      return;
    }

    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(query)
    );
    renderItems(filtered, 'balls');
    return;
  }

  // Пассивки: просто фильтруем по имени
  const filtered = query
    ? data.filter(item => item.name.toLowerCase().includes(query))
    : data;
  renderItems(filtered, 'passives');
}

function renderBalls() {
  // Фильтруем шары - показываем только те, которые используются как КОМПОНЕНТЫ в эволюциях
  // Т.е. шары, из которых можно что-то скрафтить
  const allComponents = new Set<string>();
  
  // Собираем все компоненты из всех эволюций
  [...ballsData, ...passivesData].forEach(item => {
    if (item.evolutions) {
      item.evolutions.forEach(evo => {
        evo.components.forEach(comp => allComponents.add(comp));
      });
    }
  });
  
  // Показываем только шары, которые используются как компоненты
  const filteredBalls = ballsData.filter(ball => allComponents.has(ball.name));
  
  console.log('All components:', Array.from(allComponents));
  console.log('Filtered balls (used as components):', filteredBalls.length, 'out of', ballsData.length);
  renderItems(filteredBalls, 'balls');
}

function renderPassives() {
  renderPassivesSplit(passivesData);
}

function renderPassivesSplit(items: Item[]) {
  const withEvo = items.filter(item => item.evolutions && item.evolutions.length > 0);
  const noEvo = items.filter(item => !item.evolutions || item.evolutions.length === 0);

  console.log('Passives with evo:', withEvo.length, 'no evo:', noEvo.length);

  renderColumn(withEvo, 'passives-with-evo', 'passives');
  renderColumn(noEvo, 'passives-no-evo', 'passives');
}

function renderItems(items: Item[], type: 'balls' | 'passives') {
  console.log(`Rendering ${type}:`, items.length, 'items');
  if (type === 'balls') {
    renderColumn(items, 'balls-items', 'balls');
  } else {
    renderPassivesSplit(items);
  }
}

function renderColumn(items: Item[], containerId: string, type: 'balls' | 'passives') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    const translatedName = item.name;
    
    const description = item.description || 'No description available';
    
    // Escape HTML in description for tooltip
    const escapedDescription = description
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    
    // Экранируем имя для использования в placeholder
    const escapedName = item.name.replace(/"/g, '&quot;').replace(/'/g, '&#039;');

    // Генерируем варианты путей к картинке
    // Самый надежный вариант — item.image из data.ts (там можно задавать overrides)
    const baseName = item.name
      .replace(/\s+/g, '_')
      .replace(/'/g, '')
      .replace(/\(/g, '')
      .replace(/\)/g, '')
      .trim();
    const baseNameDash = baseName.replace(/_/g, '-');

    const variants: string[] = [
      item.image, // путь уже с BASE из data.ts
      `${BASE}images/${type}/${baseName}.png`,  // Новый формат .png
      `${BASE}images/${type}/${baseNameDash}.png`,  // Новый формат .png с дефисами
      `${BASE}images/${type}/${baseName}_Ball.webp`,
      `${BASE}images/${type}/${baseNameDash}_Ball.webp`,
      `${BASE}images/${type}/${baseName}_Ball.jpg`,
      `${BASE}images/${type}/${baseNameDash}_Ball.jpg`,
      `${BASE}images/${type}/${baseName}.webp`,
      `${BASE}images/${type}/${baseNameDash}.webp`,
      `${BASE}images/${type}/${baseName}.jpg`,
      `${BASE}images/${type}/${baseNameDash}.jpg`
    ].filter(Boolean);

    // Создаем img элемент с логикой перебора вариантов
    const img = document.createElement('img');
    img.className = 'item-image';
    img.alt = item.name;

    let currentVariant = 0;
    const tryNextVariant = () => {
      if (currentVariant < variants.length) {
        img.src = variants[currentVariant];
        currentVariant++;
      } else {
        // Если все варианты не сработали, показываем placeholder
        img.src = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23d81b60%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2212%22%3E${escapedName}%3C/text%3E%3C/svg%3E`;
        img.onerror = null;
      }
    };

    img.onerror = tryNextVariant;
    tryNextVariant(); // Начинаем с первого варианта
    
    card.appendChild(img);

    // Tier badge только для пассивок
    if (type === 'passives' && item.tier) {
      const tierBadge = document.createElement('div');
      tierBadge.className = 'tier-badge';
      tierBadge.textContent = item.tier;
      card.appendChild(tierBadge);
    }
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'item-name';
    nameDiv.textContent = translatedName;
    card.appendChild(nameDiv);
    
    const tooltipDiv = document.createElement('div');
    tooltipDiv.className = 'item-tooltip';
    tooltipDiv.innerHTML = escapedDescription;
    card.appendChild(tooltipDiv);

    // Карточка кликабельна только если предмет где-то используется как компонент
    const usedAsComponent = [...ballsData, ...passivesData].some(i =>
      i.evolutions?.some(evo => evo.components.includes(item.name))
    );

    if (usedAsComponent) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => showComponentEvolutions(item));
    } else {
      card.style.cursor = 'default';
    }

    container.appendChild(card);
  });
}

function setupModal() {
  const modal = document.getElementById('evolution-modal');
  const closeBtn = document.querySelector('.close');

  closeBtn?.addEventListener('click', () => {
    if (modal) modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (modal) modal.style.display = 'none';
    }
  });
}

function renderBestBaseLayout() {
  const container = document.getElementById('best-base-content');
  if (!container) return;

  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'best-base-wrapper';

  const title = document.createElement('h2');
  title.className = 'best-base-title';
  title.textContent = 'Best Base Layout';

  const description = document.createElement('div');
  description.className = 'best-base-description';
  description.innerHTML = `
    <p>This base design is with end game resource farming in mind.</p>
    <p>Every resident building is being utilized.</p>
    <p>There are 0 unused tiles inside the base layout.</p>
    <p>All resource tiles can be collected during harvest.</p>
    <p>All Infinite Stat Buildings can be upgraded in a single harvest.</p>
    <p>You never have to mess around with rearranging the base</p>
    <p>You never have to mess around with reassigning characters</p>
    <p>The resources are prioritized in the following order Stone, Wood, Wheat.</p>
  `;

  const imageContainer = document.createElement('div');
  imageContainer.className = 'best-base-image-container';

  const img = document.createElement('img');
  img.className = 'best-base-image';
  // Используем BASE для правильного пути в продакшене
  img.src = `${BASE}images/base/OPTIMAL_BASE.jpg`;
  img.alt = 'Best Base Layout';

  imageContainer.appendChild(img);

  wrapper.appendChild(title);
  wrapper.appendChild(description);
  wrapper.appendChild(imageContainer);

  container.appendChild(wrapper);

  // Modal for full-screen image
  const modal = document.getElementById('base-image-modal');
  const modalImg = document.getElementById('base-modal-image') as HTMLImageElement | null;
  const closeBtn = document.querySelector('.base-modal-close') as HTMLElement | null;

  if (img && modal && modalImg && closeBtn) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      modal.style.display = 'flex';
      modalImg.src = img.src;
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
}

// Показываем все эволюции, где используется этот компонент (что из него крафтится)
function showComponentEvolutions(component: Item) {
  const modal = document.getElementById('evolution-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalEvolutions = document.getElementById('modal-evolutions');

  if (!modal || !modalTitle || !modalEvolutions) return;

  modalTitle.textContent = component.name;
  modalEvolutions.innerHTML = '';

  // Находим все эволюции, где используется этот компонент
  const evolutionsUsingComponent: Array<{result: string, components: string[], resultItem?: Item}> = [];
  const seenKeys = new Set<string>();

  [...ballsData, ...passivesData].forEach(item => {
    if (item.evolutions) {
      item.evolutions.forEach(evo => {
        if (evo.components.includes(component.name)) {
          const key = `${evo.result}|${[...evo.components].sort().join('+')}`;
          if (seenKeys.has(key)) {
            return;
          }
          seenKeys.add(key);

          evolutionsUsingComponent.push({
            result: evo.result,
            components: evo.components,
            resultItem: [...ballsData, ...passivesData].find(i => i.name === evo.result)
          });
        }
      });
    }
  });

  if (evolutionsUsingComponent.length === 0) {
    modalEvolutions.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 20px;">No evolutions found for this component.</p>';
  } else {
    evolutionsUsingComponent.forEach(evo => {
      const evoDiv = document.createElement('div');
      evoDiv.className = 'evolution-item';

      const title = document.createElement('div');
      title.className = 'evolution-title';
      title.textContent = `→ ${evo.result}`;
      evoDiv.appendChild(title);

      const componentsDiv = document.createElement('div');
      componentsDiv.className = 'evolution-components';

      evo.components.forEach((compName, idx) => {
        const compItem = [...ballsData, ...passivesData].find(i => i.name === compName);
        
        const compDiv = document.createElement('div');
        compDiv.className = 'evolution-component';
        if (compName === component.name) {
          compDiv.style.border = '2px solid var(--pink-main)';
          compDiv.style.background = 'var(--pink-subtle)';
        }
        
        // Путь к картинке: сначала compItem.image, затем фоллбеки по шаблону
        const compType = ballsData.find(b => b.name === compName) ? 'balls' : 'passives';
        const compBase = compName
          .replace(/\s+/g, '_')
          .replace(/'/g, '')
          .replace(/\(/g, '')
          .replace(/\)/g, '')
          .trim();
        const compBaseDash = compBase.replace(/_/g, '-');
        const compVariants: string[] = [
          compItem?.image || '',
          // Новые .png иконки
          `${BASE}images/${compType}/${compBase}.png`,
          `${BASE}images/${compType}/${compBaseDash}.png`,
          `${BASE}images/${compType}/${compBase}_Ball.png`,
          `${BASE}images/${compType}/${compBaseDash}_Ball.png`,
          // Старые варианты .webp / .jpg
          `${BASE}images/${compType}/${compBase}_Ball.webp`,
          `${BASE}images/${compType}/${compBaseDash}_Ball.webp`,
          `${BASE}images/${compType}/${compBase}_Ball.jpg`,
          `${BASE}images/${compType}/${compBaseDash}_Ball.jpg`,
          `${BASE}images/${compType}/${compBase}.webp`,
          `${BASE}images/${compType}/${compBaseDash}.webp`,
          `${BASE}images/${compType}/${compBase}.jpg`,
          `${BASE}images/${compType}/${compBaseDash}.jpg`
        ].filter(Boolean);
        
        const compImg = document.createElement('img');
        let compIdx = 0;
        compImg.src = compVariants[0] || '';
        compImg.alt = compName;
        compImg.onerror = function () {
          compIdx += 1;
          if (compIdx < compVariants.length) {
            this.src = compVariants[compIdx];
            return;
          }
          this.src = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%22%23d81b60%22 width=%2280%22 height=%2280%22/%3E%3Ctext x=%2240%22 y=%2240%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2210%22%3E${compName}%3C/text%3E%3C/svg%3E`;
          this.onerror = null;
        };
        
        compDiv.appendChild(compImg);

        // Tier badge для пассивок в эволюциях
        const compPassive = passivesData.find(p => p.name === compName);
        if (compPassive && compPassive.tier) {
          const tierBadge = document.createElement('div');
          tierBadge.className = 'tier-badge';
          tierBadge.textContent = compPassive.tier;
          compDiv.appendChild(tierBadge);
        }

        const compLabel = document.createElement('div');
        compLabel.textContent = compName;
        compDiv.appendChild(compLabel);

        // Tooltip с описанием для компонентов (balls и passives)
        if (compItem && compItem.description) {
          const compTooltip = document.createElement('div');
          compTooltip.className = 'evolution-tooltip';
          compTooltip.textContent = compItem.description;
          compDiv.appendChild(compTooltip);
        }

        componentsDiv.appendChild(compDiv);

        if (idx < evo.components.length - 1) {
          const plus = document.createElement('div');
          plus.className = 'evolution-operator evolution-plus';
          componentsDiv.appendChild(plus);
        }
      });

      const arrow = document.createElement('div');
      arrow.className = 'evolution-operator evolution-arrow';
      componentsDiv.appendChild(arrow);

      const resultDiv = document.createElement('div');
      resultDiv.className = 'evolution-result';
      
      const resultType = ballsData.find(b => b.name === evo.result) ? 'balls' : 'passives';
      const resultBase = evo.result
        .replace(/\s+/g, '_')
        .replace(/'/g, '')
        .replace(/\(/g, '')
        .replace(/\)/g, '')
        .trim();
      const resultBaseDash = resultBase.replace(/_/g, '-');
      const resultVariants: string[] = [
        evo.resultItem?.image || '',
        // Новые .png иконки
        `${BASE}images/${resultType}/${resultBase}.png`,
        `${BASE}images/${resultType}/${resultBaseDash}.png`,
        `${BASE}images/${resultType}/${resultBase}_Ball.png`,
        `${BASE}images/${resultType}/${resultBaseDash}_Ball.png`,
        // Старые варианты .webp / .jpg
        `${BASE}images/${resultType}/${resultBase}_Ball.webp`,
        `${BASE}images/${resultType}/${resultBaseDash}_Ball.webp`,
        `${BASE}images/${resultType}/${resultBase}_Ball.jpg`,
        `${BASE}images/${resultType}/${resultBaseDash}_Ball.jpg`,
        `${BASE}images/${resultType}/${resultBase}.webp`,
        `${BASE}images/${resultType}/${resultBaseDash}.webp`,
        `${BASE}images/${resultType}/${resultBase}.jpg`,
        `${BASE}images/${resultType}/${resultBaseDash}.jpg`
      ].filter(Boolean);
      
      const resultImg = document.createElement('img');
      let resultIdx = 0;
      resultImg.src = resultVariants[0] || '';
      resultImg.alt = evo.result;
      resultImg.onerror = function () {
        resultIdx += 1;
        if (resultIdx < resultVariants.length) {
          this.src = resultVariants[resultIdx];
          return;
        }
        this.src = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23d81b60%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2212%22%3E${evo.result}%3C/text%3E%3C/svg%3E`;
        this.onerror = null;
      };
      
      resultDiv.appendChild(resultImg);

      // Tier badge для результата, если это пассивка
      const resultPassive = passivesData.find(p => p.name === evo.result);
      if (resultType === 'passives' && resultPassive && resultPassive.tier) {
        const tierBadge = document.createElement('div');
        tierBadge.className = 'tier-badge';
        tierBadge.textContent = resultPassive.tier;
        resultDiv.appendChild(tierBadge);
      }
      const resultName = document.createElement('div');
      resultName.className = 'evolution-result-name';
      resultName.textContent = evo.result;
      resultDiv.appendChild(resultName);
      
      // Добавляем tooltip с описанием результата эволюции
      if (evo.resultItem && evo.resultItem.description) {
        const resultTooltip = document.createElement('div');
        resultTooltip.className = 'evolution-result-tooltip';
        resultTooltip.textContent = evo.resultItem.description;
        resultDiv.appendChild(resultTooltip);
        resultDiv.style.position = 'relative';
      }
      
      componentsDiv.appendChild(resultDiv);

      evoDiv.appendChild(componentsDiv);
      modalEvolutions.appendChild(evoDiv);
    });
  }

  modal.style.display = 'block';
}

// Helper function to get character image URL
function getCharacterImageUrl(name: string): string {
  const BASE = (import.meta as any).env.BASE_URL || '/';
  // Имена файлов используют подчеркивания и сохраняют "The "
  const fileName = name.replace(/\s+/g, '_');
  return `${BASE}images/characters/${fileName}.png`;
}

// Helper function to get item image by name
function getItemImage(name: string, type: 'ball' | 'passive'): string {
  const data = type === 'ball' ? ballsData : passivesData;
  
  // Normalize function for comparison - handles apostrophes and special characters
  const normalize = (str: string) => {
    return str.toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[''"]/g, "'") // Normalize different apostrophe types
      .replace(/[''"]/g, "'");
  };
  
  // Try exact match first
  let item = data.find(i => i.name === name);
  
  // Try case-insensitive match with normalized apostrophes
  if (!item) {
    const normalizedSearch = normalize(name);
    item = data.find(i => {
      const normalizedItem = normalize(i.name);
      return normalizedItem === normalizedSearch;
    });
  }
  
  // Handle "Laser (either)" - try both Horizontal and Vertical
  if (!item && name.includes('Laser') && name.includes('either')) {
    item = data.find(i => i.name === 'Laser (Horizontal)') || data.find(i => i.name === 'Laser (Vertical)');
  }
  
  // Handle "Laser" without direction - try Horizontal first
  if (!item && name === 'Laser') {
    item = data.find(i => i.name === 'Laser (Horizontal)') || data.find(i => i.name === 'Laser (Vertical)');
  }
  
  // Try removing parentheses content
  if (!item) {
    const nameWithoutParentheses = name.replace(/ \(.*?\)/g, '').trim();
    item = data.find(i => {
      const itemNameClean = i.name.replace(/ \(.*?\)/g, '').trim();
      return itemNameClean === nameWithoutParentheses || normalize(itemNameClean) === normalize(nameWithoutParentheses);
    });
  }
  
  // Try partial match (contains) - but only if names are similar enough
  if (!item) {
    const normalizedSearch = normalize(name);
    // Find items where one name contains the other (but not too short to avoid false matches)
    item = data.find(i => {
      const normalizedItem = normalize(i.name);
      return (normalizedItem.length > 5 && normalizedSearch.length > 5) && 
             (normalizedItem.includes(normalizedSearch) || normalizedSearch.includes(normalizedItem));
    });
  }
  
  if (item && item.image) {
    return item.image;
  }
  
  // Log warning if item not found
  console.warn(`Item not found: ${name} (type: ${type})`);
  
  // Fallback: try to construct path - используем правильную нормализацию
  // Сохраняем апострофы, так как они есть в файлах
  let baseName = name
    .replace(/\s+/g, '_')  // Пробелы -> подчеркивания
    .replace(/\(/g, '')    // Убираем открывающие скобки
    .replace(/\)/g, '')    // Убираем закрывающие скобки
    .trim();
  
  // Для шаров: пробуем маппинг из nameToPngFile (если бы он был доступен)
  // Но так как его нет, просто используем нормализованное имя
  if (type === 'ball') {
    // Специальные случаи для шаров
    const ballMappings: Record<string, string> = {
      'Frozen Flame': 'Frozen_Flame',
      'Radiation Beam': 'Radiation_Beam',
      'Black Hole': 'Black_Hole',
      'Freeze Ray': 'Freeze_Ray',
      'Holy Laser': 'Holy_Laser',
      'Laser Beam': 'Laser_Beam',
      'Lightning Rod': 'Lightning_Rod',
      'Mosquito King': 'Mosquito_King',
      'Mosquito Swarm': 'Mosquito_Swarm',
      'Nuclear Bomb': 'Nuclear_Bomb',
      'Laser Cutter': 'Laser_Cutter',
      'Soul Sucker': 'Soul_Sucker',
      'Spider Queen': 'Spider_Queen',
      'Vampire Lord': 'Vampire_Lord',
      'Voluptuous Egg Sac': 'Voluptuous_Egg_Sac',
      'Brood Mother': 'Brood_Mother',
      'Egg Sac': 'Egg_Sac',
    };
    
    const mappedName = ballMappings[name];
    if (mappedName) {
      return `${BASE}images/balls/${mappedName}.png`;
    }
    
    return `${BASE}images/balls/${baseName}.png`;
  }
  
  // Для пассивок: пробуем маппинг для особых случаев
  const passivesMappings: Record<string, string> = {
    "Lover's Quiver": "Lover's_Quiver",
    "Spiked Collar": "Spiked_Collar",
    "Crown of Thorns": "Crown_of_Thorns",
    "Radiant Feather": "Radiant_Feather",
    "Fleet Feet": "Fleet_Feet",
    "Deadeye's Amulet": "Deadeye's_Amulet",
    "Deadeye's Cross": "Deadeye's_Cross",
    "Deadeye's Impaler": "Deadeye's_Impaler",
    "Reacher's Spear": "Reacher's_Spear",
    "Archer's Effigy": "Archer's_Effigy",
    "Healer's Effigy": "Healer's_Effigy",
    "Traitor's Cowl": "Traitor's_Cowl",
    "Tormenter's Mask": "Tormenters_Mask",
    "Wings of the Anointed": "Wings_of_the_Anointed",
    "Eye of the Beholder": "Eye_of_the_Beholder",
    "Kiss of Death": "Kiss_of_Death",
    "Vampiric Sword": "Vampiric_Sword",
    "Everflowing Goblet": "Everflowing_Goblet",
    "Ghostly Corset": "Ghostly_Corset",
    "Ethereal Cloak": "Ethereal_Cloak",
    "Diamond Hilted Dagger": "Diamond_Hilted_Dagger",
    "Sapphire Hilted Dagger": "Sapphire_Hilted_Dagger",
    "Ruby Hilted Dagger": "Ruby_Hilted_Dagger",
    "Emerald Hilted Dagger": "Emerald_Hilted_Dagger",
    "Grotesque Artillery": "Grotesque_Artillery",
    "Brood Mother": "Brood_Mother",
    "Egg Sac": "Egg_Sac",
    "Lightning Rod": "Lightning_Rod",
  };
  
  const mappedName = passivesMappings[name];
  if (mappedName) {
    return `${BASE}images/passives/${mappedName}.png`;
  }
  
  return `${BASE}images/passives/${baseName}.png`;
}

function renderCharacterCombos() {
  const container = document.getElementById('characters-combos');
  if (!container) return;

  container.innerHTML = '';

  characterCombos.forEach(combo => {
    const comboCard = document.createElement('div');
    comboCard.className = 'combo-card';

    // Header with character images and names
    const header = document.createElement('div');
    header.className = 'combo-header';
    
    const char1Div = document.createElement('div');
    char1Div.className = 'character-info';
    const char1Img = document.createElement('img');
    char1Img.src = combo.character1Image;
    char1Img.alt = combo.character1;
    char1Img.className = 'character-image';
    char1Img.onerror = () => {
      console.warn(`Failed to load character image: ${combo.character1} from ${combo.character1Image}`);
      // Don't hide, show placeholder instead
      char1Img.style.opacity = '0.3';
    };
    const char1Name = document.createElement('div');
    char1Name.className = 'character-name';
    char1Name.textContent = combo.character1;
    char1Div.appendChild(char1Img);
    char1Div.appendChild(char1Name);

    const comboX = document.createElement('div');
    comboX.className = 'combo-x';
    comboX.textContent = '×';

    const char2Div = document.createElement('div');
    char2Div.className = 'character-info';
    const char2Img = document.createElement('img');
    char2Img.src = combo.character2Image;
    char2Img.alt = combo.character2;
    char2Img.className = 'character-image';
    char2Img.onerror = () => {
      console.warn(`Failed to load character image: ${combo.character2} from ${combo.character2Image}`);
      // Don't hide, show placeholder instead
      char2Img.style.opacity = '0.3';
    };
    const char2Name = document.createElement('div');
    char2Name.className = 'character-name';
    char2Name.textContent = combo.character2;
    char2Div.appendChild(char2Img);
    char2Div.appendChild(char2Name);

    header.appendChild(char1Div);
    header.appendChild(comboX);
    header.appendChild(char2Div);

    // Explanation
    const explanation = document.createElement('div');
    explanation.className = 'combo-explanation';
    explanation.textContent = combo.explanation;

    // Best Balls section
    const bestBallsSection = document.createElement('div');
    bestBallsSection.className = 'combo-section';
    const ballsTitle = document.createElement('h3');
    ballsTitle.textContent = 'Best Balls';
    bestBallsSection.appendChild(ballsTitle);
    
    const ballsGrid = document.createElement('div');
    ballsGrid.className = 'combo-items-grid';
    combo.bestBalls.forEach(ballName => {
      const ballItem = document.createElement('div');
      ballItem.className = 'combo-item';
      const ballImg = document.createElement('img');
      const ballImageUrl = getItemImage(ballName, 'ball');
      ballImg.src = ballImageUrl;
      ballImg.alt = ballName;
      ballImg.className = 'combo-item-image';
      ballImg.onerror = () => {
        console.warn(`Failed to load ball image: ${ballName} from ${ballImageUrl}`);
        // Don't hide, show placeholder instead
        ballImg.style.opacity = '0.3';
      };
      const ballLabel = document.createElement('div');
      ballLabel.className = 'combo-item-label';
      ballLabel.textContent = ballName;
      ballItem.appendChild(ballImg);
      ballItem.appendChild(ballLabel);
      ballsGrid.appendChild(ballItem);
    });
    bestBallsSection.appendChild(ballsGrid);

    // Best Passives section
    const bestPassivesSection = document.createElement('div');
    bestPassivesSection.className = 'combo-section';
    const passivesTitle = document.createElement('h3');
    passivesTitle.textContent = 'Best Passives';
    bestPassivesSection.appendChild(passivesTitle);
    
    const passivesGrid = document.createElement('div');
    passivesGrid.className = 'combo-items-grid';
    combo.bestPassives.forEach(passiveName => {
      const passiveItem = document.createElement('div');
      passiveItem.className = 'combo-item';
      const passiveImg = document.createElement('img');
      const passiveImageUrl = getItemImage(passiveName, 'passive');
      passiveImg.src = passiveImageUrl;
      passiveImg.alt = passiveName;
      passiveImg.className = 'combo-item-image';
      passiveImg.onerror = () => {
        console.warn(`Failed to load passive image: ${passiveName} from ${passiveImageUrl}`);
        // Don't hide, show placeholder instead
        passiveImg.style.opacity = '0.3';
      };
      const passiveLabel = document.createElement('div');
      passiveLabel.className = 'combo-item-label';
      passiveLabel.textContent = passiveName;
      passiveItem.appendChild(passiveImg);
      passiveItem.appendChild(passiveLabel);
      passivesGrid.appendChild(passiveItem);
    });
    bestPassivesSection.appendChild(passivesGrid);

    comboCard.appendChild(header);
    comboCard.appendChild(explanation);
    comboCard.appendChild(bestBallsSection);
    comboCard.appendChild(bestPassivesSection);

    container.appendChild(comboCard);
  });
}

function renderCharacterTiers() {
  const container = document.getElementById('characters-tier-list');
  if (!container) return;

  container.innerHTML = '';

  // Группируем по тирам
  const tiers: Record<'S' | 'A' | 'B' | 'C', typeof characterTiers> = {
    'S': [],
    'A': [],
    'B': [],
    'C': []
  };

  characterTiers.forEach(char => {
    tiers[char.tier].push(char);
  });

  // Рендерим каждый тир
  (['S', 'A', 'B', 'C'] as const).forEach(tier => {
    const tierSection = document.createElement('div');
    tierSection.className = 'tier-section';
    
    const tierHeader = document.createElement('div');
    tierHeader.className = 'tier-header';
    
    const tierBadge = document.createElement('div');
    tierBadge.className = `tier-header-badge tier-${tier.toLowerCase()}`;
    tierBadge.textContent = tier;
    
    tierHeader.appendChild(tierBadge);
    tierSection.appendChild(tierHeader);

    const tierGrid = document.createElement('div');
    tierGrid.className = 'tier-grid';

    tiers[tier].forEach(char => {
      const charCard = document.createElement('div');
      charCard.className = 'tier-character-card';

      const charImage = document.createElement('img');
      charImage.src = char.image;
      charImage.alt = char.name;
      charImage.className = 'tier-character-image';
      charImage.onerror = () => {
        charImage.style.opacity = '0.3';
      };

      const charName = document.createElement('div');
      charName.className = 'tier-character-name';
      charName.textContent = char.name;

      const charAbility = document.createElement('div');
      charAbility.className = 'tier-character-ability';
      charAbility.textContent = char.ability;

      const charReason = document.createElement('div');
      charReason.className = 'tier-character-reason';
      charReason.textContent = char.reason;

      charCard.appendChild(charImage);
      charCard.appendChild(charName);
      charCard.appendChild(charAbility);
      charCard.appendChild(charReason);

      tierGrid.appendChild(charCard);
    });

    tierSection.appendChild(tierGrid);
    container.appendChild(tierSection);
  });

  // Добавляем обработчики клика на карточки персонажей
  container.querySelectorAll('.tier-character-card').forEach(card => {
    const cardElement = card as HTMLElement;
    cardElement.style.cursor = 'pointer';
    cardElement.addEventListener('click', () => {
      const charName = card.querySelector('.tier-character-name')?.textContent;
      if (charName) {
        // Проверяем, есть ли персонаж в buildGuides
        const hasGuide = buildGuides.some(g => g.name === charName);
        
        // Переключаемся на вкладку Build Guides только если есть гайд
        if (hasGuide) {
          const buildGuidesTab = document.querySelector('[data-tab="build-guides"]') as HTMLElement;
          if (buildGuidesTab) {
            buildGuidesTab.click();
            // Прокручиваем к нужному персонажу после небольшой задержки
            setTimeout(() => {
              renderBuildGuides(charName);
              setTimeout(() => {
                const guideElement = document.querySelector(`[data-character="${charName}"]`);
                if (guideElement) {
                  guideElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  // Подсвечиваем элемент
                  guideElement.classList.add('highlight');
                  setTimeout(() => {
                    guideElement.classList.remove('highlight');
                  }, 2000);
                }
              }, 50);
            }, 100);
          }
        } else {
          // Если гайда нет, переключаемся и показываем сообщение
          const buildGuidesTab = document.querySelector('[data-tab="build-guides"]') as HTMLElement;
          if (buildGuidesTab) {
            buildGuidesTab.click();
            setTimeout(() => {
              renderBuildGuides(charName);
            }, 100);
          }
        }
      }
    });
  });
}

function renderBuildGuides(characterName?: string) {
  const container = document.getElementById('build-guides-list');
  if (!container) return;

  container.innerHTML = '';

  // Если указано имя персонажа, фильтруем
  const guidesToShow = characterName 
    ? buildGuides.filter(g => g.name === characterName)
    : buildGuides;

  // Если персонаж не найден в buildGuides, показываем сообщение
  if (characterName && guidesToShow.length === 0) {
    const message = document.createElement('div');
    message.className = 'build-guide-card';
    message.style.textAlign = 'center';
    message.style.padding = '40px';
    message.innerHTML = `
      <h2 style="color: var(--pink-main); margin-bottom: 16px;">Build Guide Not Available</h2>
      <p style="color: var(--text-gray);">Build guide for "${characterName}" is not available yet.</p>
    `;
    container.appendChild(message);
    return;
  }

  guidesToShow.forEach(guide => {
    const guideCard = document.createElement('div');
    guideCard.className = 'build-guide-card';
    guideCard.setAttribute('data-character', guide.name);

    // Заголовок с изображением
    const header = document.createElement('div');
    header.className = 'build-guide-header';
    
    const charImage = document.createElement('img');
    charImage.src = guide.image;
    charImage.alt = guide.name;
    charImage.className = 'build-guide-character-image';
    charImage.onerror = () => {
      charImage.style.opacity = '0.3';
    };

    const headerText = document.createElement('div');
    headerText.className = 'build-guide-header-text';
    
    const charName = document.createElement('h2');
    charName.className = 'build-guide-title';
    charName.textContent = guide.name;

    headerText.appendChild(charName);
    header.appendChild(charImage);
    header.appendChild(headerText);
    guideCard.appendChild(header);

    // Основная информация
    const infoSection = document.createElement('div');
    infoSection.className = 'build-guide-info';

    const startingBall = document.createElement('div');
    startingBall.className = 'build-guide-info-item';
    startingBall.innerHTML = `<strong>Starting Ball:</strong> ${guide.startingBall}`;

    const passive = document.createElement('div');
    passive.className = 'build-guide-info-item';
    passive.innerHTML = `<strong>Passive:</strong> ${guide.passive}`;

    const strengths = document.createElement('div');
    strengths.className = 'build-guide-info-item';
    strengths.innerHTML = `<strong>Strengths:</strong> ${guide.strengths}`;

    const weaknesses = document.createElement('div');
    weaknesses.className = 'build-guide-info-item';
    weaknesses.innerHTML = `<strong>Weaknesses:</strong> ${guide.weaknesses}`;

    infoSection.appendChild(startingBall);
    infoSection.appendChild(passive);
    infoSection.appendChild(strengths);
    infoSection.appendChild(weaknesses);
    guideCard.appendChild(infoSection);

    // Best Balls
    const bestBallsSection = document.createElement('div');
    bestBallsSection.className = 'build-guide-section';
    const bestBallsTitle = document.createElement('h3');
  bestBallsTitle.textContent = 'Best Balls';
    bestBallsSection.appendChild(bestBallsTitle);

    guide.bestBalls.forEach(ball => {
      const ballItem = document.createElement('div');
      ballItem.className = 'build-guide-item';
      
      // Извлекаем имя шара (до скобки, если есть)
      const ballNameOnly = ball.name.split('(')[0].trim();
      const ballImageUrl = getItemImage(ballNameOnly, 'ball');
      
      const ballImage = document.createElement('img');
      ballImage.src = ballImageUrl;
      ballImage.alt = ballNameOnly;
      ballImage.className = 'build-guide-item-image';
      ballImage.onerror = () => {
        ballImage.style.opacity = '0.3';
      };
      
      const ballContent = document.createElement('div');
      ballContent.className = 'build-guide-item-content';
      
      const ballName = document.createElement('div');
      ballName.className = 'build-guide-item-name';
      ballName.textContent = ball.name;
      const ballReason = document.createElement('div');
      ballReason.className = 'build-guide-item-reason';
      ballReason.textContent = ball.reason;
      
      ballContent.appendChild(ballName);
      ballContent.appendChild(ballReason);
      
      ballItem.appendChild(ballImage);
      ballItem.appendChild(ballContent);
      bestBallsSection.appendChild(ballItem);
    });
    guideCard.appendChild(bestBallsSection);

    // Best Passives
    const bestPassivesSection = document.createElement('div');
    bestPassivesSection.className = 'build-guide-section';
    const bestPassivesTitle = document.createElement('h3');
    bestPassivesTitle.textContent = 'Best Passives';
    bestPassivesSection.appendChild(bestPassivesTitle);

    guide.bestPassives.forEach(passive => {
      const passiveItem = document.createElement('div');
      passiveItem.className = 'build-guide-item';
      
      // Извлекаем имя пассивки (до скобки, если есть)
      const passiveNameOnly = passive.name.split('(')[0].trim();
      const passiveImageUrl = getItemImage(passiveNameOnly, 'passive');
      
      const passiveImage = document.createElement('img');
      passiveImage.src = passiveImageUrl;
      passiveImage.alt = passiveNameOnly;
      passiveImage.className = 'build-guide-item-image';
      passiveImage.onerror = () => {
        passiveImage.style.opacity = '0.3';
      };
      
      const passiveContent = document.createElement('div');
      passiveContent.className = 'build-guide-item-content';
      
      const passiveName = document.createElement('div');
      passiveName.className = 'build-guide-item-name';
      passiveName.textContent = passive.name;
      const passiveReason = document.createElement('div');
      passiveReason.className = 'build-guide-item-reason';
      passiveReason.textContent = passive.reason;
      
      passiveContent.appendChild(passiveName);
      passiveContent.appendChild(passiveReason);
      
      passiveItem.appendChild(passiveImage);
      passiveItem.appendChild(passiveContent);
      bestPassivesSection.appendChild(passiveItem);
    });
    guideCard.appendChild(bestPassivesSection);

    // Best Character Pair
    const pairSection = document.createElement('div');
    pairSection.className = 'build-guide-section';
    const pairTitle = document.createElement('h3');
    pairTitle.textContent = 'Best Character Pair';
    pairSection.appendChild(pairTitle);
    
    const pairItem = document.createElement('div');
    pairItem.className = 'build-guide-item';
    
    // Получаем изображение персонажа
    const characterImageUrl = getCharacterImageUrl(guide.bestCharacterPair.name);
    const characterImage = document.createElement('img');
    characterImage.src = characterImageUrl;
    characterImage.alt = guide.bestCharacterPair.name;
    characterImage.className = 'build-guide-item-image';
    characterImage.onerror = () => {
      characterImage.style.opacity = '0.3';
    };
    
    const pairContent = document.createElement('div');
    pairContent.className = 'build-guide-item-content';
    
    const pairName = document.createElement('div');
    pairName.className = 'build-guide-item-name';
    pairName.textContent = guide.bestCharacterPair.name;
    const pairReason = document.createElement('div');
    pairReason.className = 'build-guide-item-reason';
    pairReason.textContent = guide.bestCharacterPair.reason;
    
    pairContent.appendChild(pairName);
    pairContent.appendChild(pairReason);
    
    pairItem.appendChild(characterImage);
    pairItem.appendChild(pairContent);
    pairSection.appendChild(pairItem);
    guideCard.appendChild(pairSection);

    // How to Unlock
    const unlockSection = document.createElement('div');
    unlockSection.className = 'build-guide-section';
    const unlockTitle = document.createElement('h3');
    unlockTitle.textContent = 'How to Unlock';
    unlockSection.appendChild(unlockTitle);
    
    const unlockText = document.createElement('div');
    unlockText.className = 'build-guide-text';
    unlockText.textContent = guide.howToUnlock;
    unlockSection.appendChild(unlockText);
    guideCard.appendChild(unlockSection);

    // How to Play
    const playSection = document.createElement('div');
    playSection.className = 'build-guide-section';
    const playTitle = document.createElement('h3');
    playTitle.textContent = 'How to Play';
    playSection.appendChild(playTitle);
    
    const playText = document.createElement('div');
    playText.className = 'build-guide-text';
    playText.textContent = guide.howToPlay;
    playSection.appendChild(playText);
    guideCard.appendChild(playSection);

    container.appendChild(guideCard);
  });
}

