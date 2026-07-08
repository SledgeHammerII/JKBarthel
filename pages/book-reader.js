/* ================================================================
   book-reader.js - gemeinsame "Buch mit Blätterfunktion"-Engine für
   Kurzbeschreibung, Leseprobe, Charaktere und Hinter den Kulissen.

   Aufruf (siehe jede der 4 HTML-Seiten):
     initBookReader({ flow: [...], backHref: '...' });

   "flow" ist eine FLIESSENDE LISTE von Inhaltsblöcken - das Programm
   berechnet beim Laden automatisch, wie viele Blöcke (bzw. wie viele
   Zeilen Text) auf eine Buchseite passen, bei FESTER Schriftgröße
   (siehe PAGE_FONT_SIZE_PX). Passt nicht mehr alles auf eine Seite,
   rutscht der Rest automatisch auf die nächste.

   Jeder Block in "flow" ist eines von:
     { type: "title", heading: "...", subheading: "..." }
     { type: "paragraph", text: "..." }
     { type: "character", media: "...", mediaType: "image"/"video",
       flip: true/false, heading: "...", text: "..." }
   ================================================================ */
window.initBookReader = function initBookReader(options) {
  const flow = options.flow || [];
  const backHref = options.backHref || 'trinn.html';
  const mount = document.querySelector(options.mountSelector || '#bookReaderMount');

  mount.innerHTML =
    '<a class="global-back-link" href="' + backHref + '">← Zurück zum Buch</a>' +
    '<div class="book-page">' +
      '<div class="book-frame book-frame--double" id="bookFrame">' +
        '<img class="book-frame__img" id="bookFrameImg" src="../img/trinn/BuchLeer.png" alt="">' +
        '<div class="book-visual-bounds" id="bookVisualBounds">' +
          '<div class="book-area">' +
            '<div class="book-half left"><div class="page-face" id="pageFaceLeft"></div></div>' +
            '<div class="book-half right"><div class="page-face" id="pageFaceRight"></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="book-frame book-frame--single" id="bookFrameSingle">' +
        '<img class="book-frame__img" id="bookFrameSingleImg" src="../img/trinn/SeiteLeer.png" alt="">' +
        '<div class="book-visual-bounds" id="bookVisualBoundsSingle">' +
          '<div class="single-page-area"><div class="book-half single"><div class="page-face" id="pageFaceSingle"></div></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="flip-controls">' +
        '<button class="flip-btn" id="flipPrevBtn">← Zurückblättern</button>' +
        '<button class="flip-btn" id="flipNextBtn">Weiterblättern →</button>' +
      '</div>' +
    '</div>';

  const pageFaceLeft   = document.getElementById('pageFaceLeft');
  const pageFaceRight  = document.getElementById('pageFaceRight');
  const pageFaceSingle = document.getElementById('pageFaceSingle');
  const flipPrevBtn    = document.getElementById('flipPrevBtn');
  const flipNextBtn    = document.getElementById('flipNextBtn');

  const bookFrame         = document.getElementById('bookFrame');
  const bookFrameImg      = document.getElementById('bookFrameImg');
  const bookVisualBounds  = document.getElementById('bookVisualBounds');

  const bookFrameSingle        = document.getElementById('bookFrameSingle');
  const bookFrameSingleImg     = document.getElementById('bookFrameSingleImg');
  const bookVisualBoundsSingle = document.getElementById('bookVisualBoundsSingle');

  const SINGLE_PAGE_BREAKPOINT_PX = 700;

  function isSinglePageMode() {
    return window.innerWidth < SINGLE_PAGE_BREAKPOINT_PX;
  }

  function applyPageModeClass() {
    document.body.classList.toggle('single-page-mode', isSinglePageMode());
  }
  applyPageModeClass();

  // ============================================================
  // Berechnet, wo ein Buch-Bild (object-fit: contain) innerhalb
  // seines Frame-Containers TATSÄCHLICH sichtbar ist, und positioniert
  // das zugehörige .book-visual-bounds-Element exakt auf diese
  // sichtbare Bildfläche, damit der Text-Bereich immer exakt auf der
  // gemalten Buchseite sitzt - unabhängig vom Bildschirmformat.
  // ============================================================
  function updateVisualBoundsFor(frameEl, imgEl, boundsEl) {
    const frameRect = frameEl.getBoundingClientRect();
    const naturalW = imgEl.naturalWidth || frameRect.width;
    const naturalH = imgEl.naturalHeight || frameRect.height;
    const imgRatio = naturalW / naturalH;
    const frameRatio = frameRect.width / frameRect.height;

    let visibleWidth, visibleHeight, offsetX, offsetY;

    if (frameRatio > imgRatio) {
      visibleHeight = frameRect.height;
      visibleWidth = visibleHeight * imgRatio;
      offsetY = 0;
      offsetX = (frameRect.width - visibleWidth) / 2;
    } else {
      visibleWidth = frameRect.width;
      visibleHeight = visibleWidth / imgRatio;
      offsetX = 0;
      offsetY = (frameRect.height - visibleHeight) / 2;
    }

    boundsEl.style.left = offsetX + 'px';
    boundsEl.style.top = offsetY + 'px';
    boundsEl.style.width = visibleWidth + 'px';
    boundsEl.style.height = visibleHeight + 'px';
  }

  function updateBookVisualBounds() {
    updateVisualBoundsFor(bookFrame, bookFrameImg, bookVisualBounds);
    updateVisualBoundsFor(bookFrameSingle, bookFrameSingleImg, bookVisualBoundsSingle);
  }

  if (bookFrameImg.complete) updateVisualBoundsFor(bookFrame, bookFrameImg, bookVisualBounds);
  if (bookFrameSingleImg.complete) updateVisualBoundsFor(bookFrameSingle, bookFrameSingleImg, bookVisualBoundsSingle);
  bookFrameImg.addEventListener('load', () => updateVisualBoundsFor(bookFrame, bookFrameImg, bookVisualBounds));
  bookFrameSingleImg.addEventListener('load', () => updateVisualBoundsFor(bookFrameSingle, bookFrameSingleImg, bookVisualBoundsSingle));

  // Feste Schriftgröße für den Buchtext (in Pixel) - ändert sich NICHT
  // mit der Bildschirmgröße, stattdessen wechselt die Seitenzahl.
  const PAGE_FONT_SIZE_PX = 18;

  function renderFlowBlock(block) {
    if (block.type === 'title') {
      return (
        '<div class="page-title">' + (block.heading || '') + '</div>' +
        '<div class="page-subtitle">' + (block.subheading || '') + '</div>'
      );
    }

    if (block.type === 'paragraph') {
      return '<p class="page-paragraph">' + (block.text || '') + '</p>';
    }

    if (block.type === 'character-head') {
      const flipStyle = block.flip ? 'transform: scaleX(-1);' : '';
      let mediaHtml = '';
      if (block.mediaType === 'video') {
        mediaHtml = '<video class="page-media" src="' + block.media + '" style="' + flipStyle + '" controls playsinline></video>';
      } else {
        mediaHtml = '<img class="page-media" src="' + block.media + '" alt="' + (block.heading || '') + '" style="' + flipStyle + '">';
      }
      return (
        '<div class="char-unit" data-atomic="true">' +
          mediaHtml +
          '<div class="page-title" style="font-size: 1.5em; text-align:center; margin-bottom: 0.6em;">' + (block.heading || '') + '</div>' +
        '</div>'
      );
    }

    return '';
  }

  // Verstecktes Mess-Element: exakt gleiche Maße/Schrift wie eine echte
  // Buchseite, aber unsichtbar und nicht im Layout.
  const measureEl = document.createElement('div');
  measureEl.style.position = 'fixed';
  measureEl.style.visibility = 'hidden';
  measureEl.style.pointerEvents = 'none';
  measureEl.style.zIndex = '-1';
  document.body.appendChild(measureEl);

  function syncMeasureElToRealPage(referencePageEl) {
    const rect = referencePageEl.getBoundingClientRect();
    const cs = window.getComputedStyle(referencePageEl);
    measureEl.style.width = rect.width + 'px';
    measureEl.style.height = 'auto';
    measureEl.style.padding = cs.padding;
    measureEl.style.boxSizing = 'border-box';
    measureEl.style.fontSize = PAGE_FONT_SIZE_PX + 'px';
    measureEl.style.fontFamily = cs.fontFamily;
    measureEl.style.lineHeight = cs.lineHeight;
    measureEl.style.overflow = 'visible';
  }

  // Teilt einen einzelnen Absatz (paragraph) in Wort-Häppchen auf und
  // gibt zurück, wie viele Wörter noch in die übrige Höhe passen - so
  // kann ein Absatz mitten im Satz auf die nächste Seite umbrechen.
  function splitParagraphToFit(text, maxHeightPx) {
    const words = text.split(' ');
    measureEl.innerHTML = '';
    let low = 0, high = words.length;

    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      const candidate = words.slice(0, mid).join(' ');
      measureEl.innerHTML = '<p class="page-paragraph">' + candidate + '</p>';
      if (measureEl.scrollHeight <= maxHeightPx) {
        low = mid;
      } else {
        high = mid - 1;
      }
    }

    const fittedWordCount = low;
    const fittedText = words.slice(0, fittedWordCount).join(' ');
    const remainderText = words.slice(fittedWordCount).join(' ');
    return { fittedText, remainderText };
  }

  // Wandelt "character"-Blöcke in eine interne, feinere Darstellung um:
  // ein atomarer "character-head" (Bild+Name, darf nie geteilt werden)
  // gefolgt von einzelnen "paragraph"-Blöcken für jeden Absatz.
  function expandFlow(rawFlow) {
    const expanded = [];
    rawFlow.forEach((block) => {
      if (block.type === 'character') {
        expanded.push({
          type: 'character-head',
          media: block.media,
          mediaType: block.mediaType,
          flip: block.flip,
          heading: block.heading
        });
        const paragraphs = (block.text || '').split('\n\n').filter((p) => p.trim() !== '');
        paragraphs.forEach((p) => {
          expanded.push({ type: 'paragraph', text: p });
        });
      } else {
        expanded.push(Object.assign({}, block));
      }
    });
    return expanded;
  }

  function paginateFlow(rawFlow, referencePageEl) {
    syncMeasureElToRealPage(referencePageEl);
    const pageMaxHeight = referencePageEl.clientHeight
      - (parseFloat(window.getComputedStyle(referencePageEl).paddingTop) || 0)
      - (parseFloat(window.getComputedStyle(referencePageEl).paddingBottom) || 0);

    const pages = [];
    let currentHtml = '';
    let currentHeight = 0;

    const queue = expandFlow(rawFlow);

    function commitCurrentPage() {
      pages.push(currentHtml);
      currentHtml = '';
      currentHeight = 0;
    }

    let safetyCounter = 0;
    while (queue.length > 0) {
      safetyCounter++;
      if (safetyCounter > 1000) break;

      const block = queue.shift();
      const blockHtml = renderFlowBlock(block);

      measureEl.innerHTML = currentHtml + blockHtml;
      const combinedHeight = measureEl.scrollHeight;

      if (combinedHeight <= pageMaxHeight) {
        currentHtml += blockHtml;
        currentHeight = combinedHeight;
        continue;
      }

      if (block.type === 'character-head' || block.type === 'title') {
        if (currentHtml === '') {
          currentHtml = blockHtml;
          commitCurrentPage();
        } else {
          commitCurrentPage();
          queue.unshift(block);
        }
        continue;
      }

      if (block.type === 'paragraph') {
        const remainingHeight = pageMaxHeight - currentHeight;

        if (remainingHeight > 30) {
          const { fittedText, remainderText } = splitParagraphToFit(block.text, remainingHeight);
          if (fittedText) {
            currentHtml += '<p class="page-paragraph">' + fittedText + '</p>';
          }
          commitCurrentPage();
          if (remainderText) {
            queue.unshift({ type: 'paragraph', text: remainderText });
          }
        } else {
          commitCurrentPage();
          queue.unshift(block);
        }
        continue;
      }
    }

    if (currentHtml !== '') {
      commitCurrentPage();
    }
    if (pages.length === 0) {
      pages.push('');
    }
    return pages;
  }

  let currentPages = [];
  let currentSpreadIndex = 0;

  function totalSteps() {
    if (isSinglePageMode()) {
      return currentPages.length;
    }
    return Math.ceil(currentPages.length / 2);
  }

  function showStepImmediately(stepIndex) {
    if (isSinglePageMode()) {
      const html = currentPages[stepIndex] || '';
      pageFaceSingle.innerHTML = html;
      pageFaceSingle.classList.remove('flip-out-right', 'flip-out-left');
    } else {
      const leftHtml  = currentPages[stepIndex * 2] || '';
      const rightHtml = currentPages[stepIndex * 2 + 1] || '';
      pageFaceLeft.innerHTML  = leftHtml;
      pageFaceRight.innerHTML = rightHtml;
      pageFaceLeft.classList.remove('flip-out-right', 'flip-out-left');
      pageFaceRight.classList.remove('flip-out-right', 'flip-out-left');
    }
    updateFlipButtons();
  }

  function updateFlipButtons() {
    flipPrevBtn.disabled = currentSpreadIndex <= 0;
    flipNextBtn.disabled = currentSpreadIndex >= totalSteps() - 1;
  }

  function flipToStep(direction) {
    const nextIndex = direction === 'next' ? currentSpreadIndex + 1 : currentSpreadIndex - 1;
    if (nextIndex < 0 || nextIndex >= totalSteps()) return;

    const outClass = direction === 'next' ? 'flip-out-right' : 'flip-out-left';
    if (isSinglePageMode()) {
      pageFaceSingle.classList.add(outClass);
    } else {
      pageFaceRight.classList.add(outClass);
      pageFaceLeft.classList.add(outClass);
    }

    setTimeout(() => {
      currentSpreadIndex = nextIndex;
      showStepImmediately(currentSpreadIndex);
    }, 700);
  }

  flipNextBtn.addEventListener('click', () => flipToStep('next'));
  flipPrevBtn.addEventListener('click', () => flipToStep('prev'));

  function preloadImages(rawFlow) {
    const urls = rawFlow
      .filter((b) => b.type === 'character' && b.mediaType !== 'video' && b.media)
      .map((b) => b.media);

    const promises = urls.map((url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = url;
      });
    });

    return Promise.all(promises);
  }

  function recalculatePagination(keepRelativePosition) {
    applyPageModeClass();
    updateBookVisualBounds();
    const referencePageEl = isSinglePageMode() ? pageFaceSingle : pageFaceLeft;
    currentPages = paginateFlow(flow, referencePageEl);
    const maxStep = Math.max(0, totalSteps() - 1);
    currentSpreadIndex = Math.min(currentSpreadIndex, maxStep);
    if (!keepRelativePosition) currentSpreadIndex = 0;
    showStepImmediately(currentSpreadIndex);
  }

  window.addEventListener('resize', () => {
    recalculatePagination(true);
  });

  preloadImages(flow).then(() => {
    recalculatePagination(false);
  });
};
