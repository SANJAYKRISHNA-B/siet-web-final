// Defensive guard against React DOM reconciliation crashes caused by external scripts, browser extensions, or translation
if (typeof Node !== 'undefined' && Node.prototype) {
  const origRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function(child) {
    if (child && child.parentNode !== this) {
      if (child.parentNode) {
        return child.parentNode.removeChild(child);
      }
      return child;
    }
    return origRemoveChild.apply(this, arguments);
  };
  const origInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      return this.appendChild(newNode);
    }
    return origInsertBefore.apply(this, arguments);
  };
}

// CSP-compliant global image error fallback handler (strictly eliminates inline onerror event handlers)
if (typeof window !== 'undefined') {
  window.addEventListener('error', function(event) {
    var target = event.target;
    if (target && target.tagName === 'IMG') {
      if (target.dataset.hasFallback) return;
      target.dataset.hasFallback = 'true';
      if (target.dataset.hideOnError === 'true') {
        target.style.display = 'none';
        return;
      }
      var fallback = target.dataset.fallback;
      if (fallback && target.src !== fallback) {
        target.src = fallback;
      }
    }
  }, true);
}
