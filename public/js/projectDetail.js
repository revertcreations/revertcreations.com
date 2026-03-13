/******/ (() => { // webpackBootstrap
/*!***************************************!*\
  !*** ./resources/js/projectDetail.js ***!
  \***************************************/
(function () {
  var init = function init() {
    var projectRoot = document.querySelector('[data-project-detail]');
    if (!projectRoot) {
      return;
    }
    var body = document.body;
    var activeThumb = null;
    var modalOverlay = null;
    var closeModal = function closeModal() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$preserveThumb = _ref.preserveThumb,
        preserveThumb = _ref$preserveThumb === void 0 ? false : _ref$preserveThumb;
      if (!modalOverlay) {
        return;
      }
      document.removeEventListener('keydown', handleEscape);
      modalOverlay.remove();
      modalOverlay = null;
      body.classList.remove('hire-modal-open');
      if (!preserveThumb && activeThumb) {
        activeThumb.classList.remove('is-active');
        activeThumb = null;
      }
    };
    var handleEscape = function handleEscape(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    var openModal = function openModal(content) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$preserveThumb = _ref2.preserveThumb,
        preserveThumb = _ref2$preserveThumb === void 0 ? false : _ref2$preserveThumb,
        _ref2$variant = _ref2.variant,
        variant = _ref2$variant === void 0 ? 'default' : _ref2$variant;
      closeModal({
        preserveThumb: preserveThumb
      });
      modalOverlay = document.createElement('div');
      modalOverlay.classList.add('hire-modal-overlay');
      if (variant === 'media') {
        modalOverlay.classList.add('hire-modal-overlay--media');
      }
      modalOverlay.setAttribute('role', 'dialog');
      modalOverlay.setAttribute('aria-modal', 'true');
      modalOverlay.addEventListener('click', function (event) {
        if (event.target === modalOverlay) {
          closeModal({
            preserveThumb: preserveThumb
          });
        }
      });
      var modal = document.createElement('div');
      modal.classList.add('hire-modal');
      if (variant === 'media') {
        modal.classList.add('hire-modal--media');
      }
      modalOverlay.appendChild(modal);
      var closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.classList.add('hire-modal-close');
      if (variant === 'media') {
        closeButton.classList.add('hire-modal-close--media');
      }
      closeButton.setAttribute('aria-label', 'Close dialog');
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', function () {
        return closeModal({
          preserveThumb: preserveThumb
        });
      });
      modal.appendChild(closeButton);
      if (variant === 'media') {
        modal.appendChild(content);
      } else {
        var header = document.createElement('div');
        header.classList.add('hire-modal-header');
        modal.insertBefore(header, closeButton);
        header.appendChild(closeButton);
        var modalBody = document.createElement('div');
        modalBody.classList.add('hire-modal-body', 'project-modal-body');
        modal.appendChild(modalBody);
        modalBody.appendChild(content);
      }
      body.appendChild(modalOverlay);
      body.classList.add('hire-modal-open');
      document.addEventListener('keydown', handleEscape);
      if (typeof closeButton.focus === 'function') {
        requestAnimationFrame(function () {
          closeButton.focus({
            preventScroll: true
          });
        });
      }
    };
    var renderFeaturedAsset = function renderFeaturedAsset(button) {
      var type = button.dataset.assetType;
      var url = button.dataset.assetUrl;
      if (!type || !url) {
        return;
      }
      var title = button.dataset.assetTitle;
      var caption = button.dataset.assetCaption;
      if (type === 'image') {
        var img = document.createElement('img');
        img.src = url;
        img.alt = title || 'Project asset';
        img.loading = 'lazy';
        openModal(img, {
          preserveThumb: true,
          variant: 'media'
        });
        return;
      }
      var content = document.createElement('div');
      content.classList.add('project-modal-content');
      if (title && type !== 'image') {
        var heading = document.createElement('h2');
        heading.textContent = title;
        content.appendChild(heading);
      }
      var figure = document.createElement('figure');
      figure.classList.add('project-modal-asset');
      if (type === 'video') {
        var iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.title = title || 'Project video';
        iframe.setAttribute('allowfullscreen', '');
        iframe.loading = 'lazy';
        figure.appendChild(iframe);
      } else {
        var link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.classList.add('terminal-link');
        link.textContent = title || url;
        figure.appendChild(link);
      }
      if (caption) {
        var figcaption = document.createElement('figcaption');
        figcaption.textContent = caption;
        figure.appendChild(figcaption);
      }
      content.appendChild(figure);
      openModal(content, {
        preserveThumb: true
      });
    };
    projectRoot.querySelectorAll('[data-featured-thumb]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (activeThumb && activeThumb !== button) {
          activeThumb.classList.remove('is-active');
        }
        button.classList.add('is-active');
        activeThumb = button;
        renderFeaturedAsset(button);
      });
    });
    projectRoot.querySelectorAll('[data-update-trigger]').forEach(function (button) {
      button.addEventListener('click', function () {
        var templateId = button.dataset.updateTrigger;
        var template = templateId ? document.getElementById(templateId) : null;
        if (!template) {
          return;
        }
        var fragment = template.content.cloneNode(true);
        var modalContent = fragment.querySelector('.project-modal-content') || fragment.firstElementChild;
        if (!modalContent) {
          return;
        }
        openModal(modalContent);
      });
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
/******/ })()
;