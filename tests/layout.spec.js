import { test, expect } from '@playwright/test';

// Helper function to check if two bounding boxes overlap
function isOverlapping(rect1, rect2) {
  if (
    rect1.width === 0 || rect1.height === 0 ||
    rect2.width === 0 || rect2.height === 0
  ) {
    return false;
  }
  return !(
    rect1.right <= rect2.left ||
    rect1.left >= rect2.right ||
    rect1.bottom <= rect2.top ||
    rect1.top >= rect2.bottom
  );
}

// Check overlaps among a set of selectors
async function checkSelectorsOverlap(page, selectors, ignorePairs = []) {
  return await page.evaluate(({ selectors, ignorePairs }) => {
    const elements = selectors.map(s => ({
      selector: s,
      el: document.querySelector(s)
    })).filter(item => item.el && window.getComputedStyle(item.el).display !== 'none' && window.getComputedStyle(item.el).visibility !== 'hidden');

    const overlaps = [];

    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const item1 = elements[i];
        const item2 = elements[j];

        // Check if this pair should be ignored
        const isIgnored = ignorePairs.some(pair => 
          (pair[0] === item1.selector && pair[1] === item2.selector) ||
          (pair[1] === item1.selector && pair[0] === item2.selector)
        );

        if (isIgnored) continue;

        // Ignore parent/child and ancestor/descendant relationships
        if (item1.el.contains(item2.el) || item2.el.contains(item1.el)) continue;

        const r1 = item1.el.getBoundingClientRect();
        const r2 = item2.el.getBoundingClientRect();

        // Check overlap
        const overlap = !(
          r1.right <= r2.left ||
          r1.left >= r2.right ||
          r1.bottom <= r2.top ||
          r1.top >= r2.bottom
        );

        if (overlap) {
          overlaps.push({
            el1: item1.selector,
            el2: item2.selector,
            rect1: { left: r1.left, right: r1.right, top: r1.top, bottom: r1.bottom },
            rect2: { left: r2.left, right: r2.right, top: r2.top, bottom: r2.bottom }
          });
        }
      }
    }
    return overlaps;
  }, { selectors, ignorePairs });
}

const VIEWPORTS = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 830, height: 1024, name: 'tablet-narrow-desktop' },
  { width: 1024, height: 768, name: 'desktop-medium' },
  { width: 1440, height: 900, name: 'desktop-large' }
];

const LANGUAGES = ['en', 'de', 'fr', 'ja', 'ru', 'zh'];

test.describe('CSS Overlap Tests across Languages and Viewports', () => {
  for (const lang of LANGUAGES) {
    for (const vp of VIEWPORTS) {
      test(`Check overlaps on Home Page [lang=${lang}] at ${vp.width}x${vp.height} (${vp.name})`, async ({ page }) => {
        // Set viewport
        await page.setViewportSize({ width: vp.width, height: vp.height });
        
        // Navigate to site
        await page.goto('/');
        
        // Set language in localStorage
        await page.evaluate((l) => {
          localStorage.setItem('lang', l);
        }, lang);
        
        // Reload to apply language
        await page.reload();

        // Inject style to disable transitions/animations instantly
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              transition: none !important;
              transition-duration: 0s !important;
              transition-delay: 0s !important;
              animation: none !important;
              animation-duration: 0s !important;
              animation-delay: 0s !important;
            }
          `
        });
        
        // Wait for page layout to settle
        await page.waitForTimeout(200);

        // 1. Check Header Elements
        const headerSelectors = [
          '.logo',
          '.main-nav',
          '.nav-links',
          '.header-actions',
          '.lang-picker-container',
          '#mobile-nav-toggle'
        ];
        
        const headerOverlaps = await checkSelectorsOverlap(page, headerSelectors, [
          ['.main-nav', '.nav-links'],
          ['.main-nav', '.header-actions'],
          ['.main-nav', '.lang-picker-container'],
          ['.nav-links', '.header-actions'],
          ['.nav-links', '.lang-picker-container'],
          ['.header-actions', '.lang-picker-container']
        ]);

        if (headerOverlaps.length > 0) {
          console.log(`[FAIL] Overlap in Header - Lang: ${lang}, Viewport: ${vp.width}px`, headerOverlaps);
        }
        expect(headerOverlaps).toEqual([]);

        // 2. Check Hero Section Elements
        const heroSelectors = [
          '.hero-text-content',
          '.hero-visual-wrapper',
          '.hero-badge',
          '#cli-cmd',
          '#btn-copy',
          '.hero-ctas',
          '.trust-stats'
        ];

        const heroOverlaps = await checkSelectorsOverlap(page, heroSelectors, [
          ['.hero-text-content', '.hero-badge'],
          ['.hero-text-content', '.hero-ctas'],
          ['.hero-text-content', '.trust-stats'],
          ['.hero-ctas', '#cli-cmd'],
          ['.hero-ctas', '#btn-copy']
        ]);

        if (heroOverlaps.length > 0) {
          console.log(`[FAIL] Overlap in Hero - Lang: ${lang}, Viewport: ${vp.width}px`, heroOverlaps);
        }
        expect(heroOverlaps).toEqual([]);
        
        // 3. Check CLI command and copy button overlap specifically
        const cliOverlaps = await checkSelectorsOverlap(page, ['#cli-cmd', '#btn-copy']);
        expect(cliOverlaps).toEqual([]);

        // 4. Check Dashboard Simulator layout
        const simOverlaps = await checkSelectorsOverlap(page, [
          '.dashboard-simulator',
          '.sim-sidebar',
          '.sim-view',
          '.visual-panel h4',
          '.legend'
        ]);
        expect(simOverlaps).toEqual([]);

        const legendItemsOverlap = await checkSelectorsOverlap(page, [
          '.lg-in',
          '[data-i18n="demo.inbound"]',
          '.lg-out',
          '[data-i18n="demo.outbound"]'
        ]);
        if (legendItemsOverlap.length > 0) {
          console.log(`[FAIL] Overlap in Legend Items - Lang: ${lang}, Viewport: ${vp.width}px`, legendItemsOverlap);
        }
        expect(legendItemsOverlap).toEqual([]);

        const chartWrapperHeight = await page.evaluate(() => {
          const wrapper = document.querySelector('.svg-chart-wrapper');
          return wrapper ? wrapper.getBoundingClientRect().height : null;
        });
        if (chartWrapperHeight !== null) {
          if (chartWrapperHeight <= 10) {
            console.log(`[FAIL] Chart collapsed - Lang: ${lang}, Viewport: ${vp.width}px, Height: ${chartWrapperHeight}px`);
          }
          expect(chartWrapperHeight).toBeGreaterThan(10);
        }
      });

      test(`Check overlaps on Docs Page [lang=${lang}] at ${vp.width}x${vp.height} (${vp.name})`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('/docs.html');
        
        await page.evaluate((l) => {
          localStorage.setItem('lang', l);
        }, lang);
        await page.reload();

        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              transition: none !important;
              transition-duration: 0s !important;
              transition-delay: 0s !important;
              animation: none !important;
              animation-duration: 0s !important;
              animation-delay: 0s !important;
            }
          `
        });
        await page.waitForTimeout(200);

        const headerSelectors = [
          '.logo',
          '.main-nav',
          '.nav-links',
          '.header-actions',
          '.lang-picker-container',
          '#mobile-nav-toggle'
        ];
        
        const headerOverlaps = await checkSelectorsOverlap(page, headerSelectors, [
          ['.main-nav', '.nav-links'],
          ['.main-nav', '.header-actions'],
          ['.main-nav', '.lang-picker-container'],
          ['.nav-links', '.header-actions'],
          ['.nav-links', '.lang-picker-container'],
          ['.header-actions', '.lang-picker-container']
        ]);

        if (headerOverlaps.length > 0) {
          console.log(`[FAIL] Overlap in Docs Header - Lang: ${lang}, Viewport: ${vp.width}px`, headerOverlaps);
        }
        expect(headerOverlaps).toEqual([]);
      });
    }
  }
});
