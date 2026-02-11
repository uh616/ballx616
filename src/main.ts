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
  evolutions?: Evolution[];
}

let currentTab: 'balls' | 'passives' = 'balls';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupSearch();
  renderBalls();
  setupModal();
});

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
      
      currentTab = tab;
      
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
  renderItems(ballsData, 'balls');
}

function renderPassives() {
  renderItems(passivesData, 'passives');
}

function renderItems(items: Item[], type: 'balls' | 'passives') {
  const withEvo = items.filter(item => item.evolutions && item.evolutions.length > 0);
  const noEvo = items.filter(item => !item.evolutions || item.evolutions.length === 0);

  renderColumn(withEvo, `${type}-evo`, type);
  renderColumn(noEvo, `${type}-no-evo`, type);
}

function renderColumn(items: Item[], containerId: string, type: 'balls' | 'passives') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const hasEvo = item.evolutions && item.evolutions.length > 0;
    
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ff1493%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2214%22%3E${item.name}%3C/text%3E%3C/svg%3E'">
      <div class="item-name">${item.name}</div>
      ${hasEvo ? '<div class="item-has-evo">Has Evolution</div>' : ''}
    `;

    if (hasEvo) {
      card.addEventListener('click', () => showEvolutionModal(item));
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

function showEvolutionModal(item: Item) {
  const modal = document.getElementById('evolution-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalEvolutions = document.getElementById('modal-evolutions');

  if (!modal || !modalTitle || !modalEvolutions) return;

  modalTitle.textContent = item.name;
  modalEvolutions.innerHTML = '';

  if (item.evolutions) {
    item.evolutions.forEach(evo => {
      const evoDiv = document.createElement('div');
      evoDiv.className = 'evolution-item';

      const title = document.createElement('div');
      title.className = 'evolution-title';
      title.textContent = `→ ${evo.result}`;
      evoDiv.appendChild(title);

      const componentsDiv = document.createElement('div');
      componentsDiv.className = 'evolution-components';

      evo.components.forEach((component, idx) => {
        const componentItem = [...ballsData, ...passivesData].find(i => i.name === component);
        
        const compDiv = document.createElement('div');
        compDiv.className = 'evolution-component';
        compDiv.innerHTML = `
          <img src="${componentItem?.image || ''}" alt="${component}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%22%23ff1493%22 width=%2280%22 height=%2280%22/%3E%3Ctext x=%2240%22 y=%2240%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2210%22%3E${component}%3C/text%3E%3C/svg%3E'">
          <div>${component}</div>
        `;
        componentsDiv.appendChild(compDiv);

        if (idx < evo.components.length - 1) {
          const plus = document.createElement('span');
          plus.className = 'evolution-arrow';
          plus.textContent = '+';
          componentsDiv.appendChild(plus);
        }
      });

      const arrow = document.createElement('span');
      arrow.className = 'evolution-arrow';
      arrow.textContent = '→';
      componentsDiv.appendChild(arrow);

      const resultDiv = document.createElement('div');
      resultDiv.className = 'evolution-result';
      const resultItem = [...ballsData, ...passivesData].find(i => i.name === evo.result);
      resultDiv.innerHTML = `
        <img src="${resultItem?.image || evo.resultImage || ''}" alt="${evo.result}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ff1493%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2212%22%3E${evo.result}%3C/text%3E%3C/svg%3E'">
        <div class="evolution-result-name">${evo.result}</div>
      `;
      componentsDiv.appendChild(resultDiv);

      evoDiv.appendChild(componentsDiv);
      modalEvolutions.appendChild(evoDiv);
    });
  }

  modal.style.display = 'block';
}

