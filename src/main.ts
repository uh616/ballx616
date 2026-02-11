import { ballsData, passivesData } from './data';
import '../style.css';

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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');
  console.log('Balls data:', ballsData.length);
  console.log('Passives data:', passivesData.length);
  setupTabs();
  setupSearch();
  renderBalls();
  setupModal();
  setupTonAddress();
});

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
      const tab = btn.getAttribute('data-tab') as 'balls' | 'passives';
      
      navButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(t => t.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`${tab}-tab`)?.classList.add('active');
      
      if (tab === 'balls') {
        renderBalls();
      } else {
        renderPassives();
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
  const filtered = query 
    ? data.filter(item => item.name.toLowerCase().includes(query))
    : data;
  
  if (type === 'balls') {
    renderItems(filtered, 'balls');
  } else {
    renderItems(filtered, 'passives');
  }
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
    
    const description = item.description || 'No description available';
    
    // Escape HTML in description for tooltip
    const escapedDescription = description
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    
    // Генерируем варианты путей к картинке
    // Самый надежный вариант — item.image из data.ts (там можно задавать overrides)
    const baseName = item.name.replace(/\s+/g, '_').replace(/'/g, '').replace(/\(/g, '').replace(/\)/g, '');
    const baseNameDash = baseName.replace(/_/g, '-');

    const variants: string[] = [
      item.image, // absolute from /images/... (самое важное!)
      `/images/${type}/${baseName}_Ball.webp`,
      `/images/${type}/${baseNameDash}_Ball.webp`,
      `/images/${type}/${baseName}_Ball.jpg`,
      `/images/${type}/${baseNameDash}_Ball.jpg`,
      `/images/${type}/${baseName}.webp`,
      `/images/${type}/${baseNameDash}.webp`,
      `/images/${type}/${baseName}.jpg`,
      `/images/${type}/${baseNameDash}.jpg`
    ];
    
    // Экранируем имя для использования в onerror
    const escapedName = item.name.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    
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
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'item-name';
    nameDiv.textContent = item.name;
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
        
        // Путь к картинке: сначала берем compItem.image (самый надежный), потом фоллбеки
        const compType = ballsData.find(b => b.name === compName) ? 'balls' : 'passives';
        const compBase = compName.replace(/\s+/g, '_').replace(/'/g, '').replace(/\(/g, '').replace(/\)/g, '');
        const compBaseDash = compBase.replace(/_/g, '-');
        const compVariants: string[] = [
          compItem?.image || '',
          `/images/${compType}/${compBase}_Ball.webp`,
          `/images/${compType}/${compBaseDash}_Ball.webp`,
          `/images/${compType}/${compBase}_Ball.jpg`,
          `/images/${compType}/${compBaseDash}_Ball.jpg`,
          `/images/${compType}/${compBase}.webp`,
          `/images/${compType}/${compBaseDash}.webp`,
          `/images/${compType}/${compBase}.jpg`,
          `/images/${compType}/${compBaseDash}.jpg`
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
      
      // Определяем тип для результата
      const resultType = ballsData.find(b => b.name === evo.result) ? 'balls' : 'passives';
      const resultBase = evo.result.replace(/\s+/g, '_').replace(/'/g, '').replace(/\(/g, '').replace(/\)/g, '');
      const resultBaseDash = resultBase.replace(/_/g, '-');
      const resultVariants: string[] = [
        evo.resultItem?.image || '',
        `/images/${resultType}/${resultBase}_Ball.webp`,
        `/images/${resultType}/${resultBaseDash}_Ball.webp`,
        `/images/${resultType}/${resultBase}_Ball.jpg`,
        `/images/${resultType}/${resultBaseDash}_Ball.jpg`,
        `/images/${resultType}/${resultBase}.webp`,
        `/images/${resultType}/${resultBaseDash}.webp`,
        `/images/${resultType}/${resultBase}.jpg`,
        `/images/${resultType}/${resultBaseDash}.jpg`
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

