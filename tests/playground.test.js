import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { Playground } from '../resources/js/playground.js';

const CONTAINER_WIDTH = 960;
const CONTAINER_HEIGHT = 600;

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      const base = this.textContent ? this.textContent.length : 8;
      const explicit = this.dataset && this.dataset.testWidth;
      return explicit ? Number(explicit) : Math.max(48, base * 8);
    },
  });

  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      const base = this.textContent ? this.textContent.length : 8;
      const explicit = this.dataset && this.dataset.testHeight;
      return explicit ? Number(explicit) : Math.max(32, base * 4);
    },
  });
});

const buildPlaygroundDom = () => {
  document.body.innerHTML = '';

  const lead = document.createElement('div');
  lead.id = 'lead';
  lead.style.position = 'relative';
  lead.style.width = `${CONTAINER_WIDTH}px`;
  lead.style.height = `${CONTAINER_HEIGHT}px`;
  lead.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    right: CONTAINER_WIDTH,
    bottom: CONTAINER_HEIGHT,
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
  });

  document.body.appendChild(lead);

  const nameTag = document.createElement('div');
  document.body.appendChild(nameTag);

  const title = document.createElement('h1');
  document.body.appendChild(title);

  Playground.setup({ playground: lead, homepageTag: nameTag, pageTitle: title });

  return lead;
};

const mockSkills = [
  { id: 1, name: 'README.md', experience: 100, excerpt: '' },
  { id: 2, name: 'CSS', experience: 90, excerpt: '' },
  { id: 3, name: 'HTML', experience: 80, excerpt: '' },
  { id: 4, name: 'CSS', experience: 70, excerpt: '' },
  { id: 5, name: 'JavaScript', experience: 95, excerpt: '' },
];

let randomSpy;

beforeEach(() => {
  let seed = 0;
  randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => {
    const values = [0.11, 0.39, 0.62, 0.85, 0.18, 0.73, 0.94, 0.27];
    const value = values[seed % values.length];
    seed += 1;
    return value;
  });
});

afterEach(() => {
  Playground.destroy();
  randomSpy.mockRestore();
  document.body.innerHTML = '';
});

describe('normalizeSkills', () => {
  it('deduplicates skills by id or name', () => {
    const normalized = Playground.normalizeSkills(mockSkills);
    const names = normalized.map((skill) => skill.name);

    expect(names).toEqual(['README.md', 'CSS', 'HTML', 'JavaScript']);
  });
});

describe('layout behaviour', () => {
  it('renders each skill once without overlap inside the playground', () => {
    const lead = buildPlaygroundDom();

    Playground.init(mockSkills);

    const childCount = lead.children.length;
    expect(childCount).toBe(4); // duplicate CSS removed

    const placements = Playground.placedSkills;
    expect(placements).toHaveLength(4);

    // Ensure placements are inside bounds and do not overlap
    for (let i = 0; i < placements.length; i += 1) {
      const current = placements[i];
      expect(current.x).toBeGreaterThanOrEqual(0);
      expect(current.y).toBeGreaterThanOrEqual(0);
      expect(current.x + current.width).toBeLessThanOrEqual(CONTAINER_WIDTH + 1);
      expect(current.y + current.height).toBeLessThanOrEqual(CONTAINER_HEIGHT + 1);

      for (let j = i + 1; j < placements.length; j += 1) {
        const other = placements[j];
        const overlap = Playground.skillsOverlap(current, other);
        expect(overlap).toBe(false);
      }
    }
  });
});
