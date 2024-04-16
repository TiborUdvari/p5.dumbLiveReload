let globalVarNames = [];
let p5Loaded = false;

function preventSketchLoading() {
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.tagName === 'SCRIPT' && node.src.includes('sketch.js')) {
          node.remove();
          observer.disconnect();
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

async function populateGlobalVarNames() {
  let beforeSketch = new Set(Object.keys(window));
  await loadSketch();
  let afterSketch = new Set(Object.keys(window));

  const sketchSymbols = afterSketch.difference(beforeSketch);
  globalVarNames = Array.from(sketchSymbols).filter((s) => typeof window[s] !== 'function');
}

function getGlobals() {
    let globals = {};
    for (const varName of globalVarNames) {
        globals[varName] = window[varName];
    }
    return globals;
}

function restoreGlobals(globals) {
  window = {...window, ...globals};
}

async function loadSketch(){
  try {
    const now = new Date().getTime();
    const response = await fetch(`sketch.js?${now}`);
    let scriptText = await response.text();

    scriptText = scriptText.replace(/\bconst\b/g, 'var');
    scriptText = scriptText.replace(/\blet\b/g, 'var');

    var indirect = eval;
    indirect(scriptText);
    if (!p5Loaded) {
      new p5();
      p5Loaded = true;
    }
  } catch (error) {
    console.error(error); 
  }
}

async function reloadSketch() {
  const globals = getGlobals();
  await loadSketch();
  restoreGlobals(globals);
  // console.log('dumb reload');
}


if (window.location.origin === "https://preview.p5js.org"){
  console.error("Dumb Live Reload does not work with the p5 editor for now");
} else {
  preventSketchLoading();
  populateGlobalVarNames();
}

p5.prototype.dumbReloadInterval = 500;
p5.prototype.dumbReloadIntervalId = undefined;

p5.prototype.dumbReloadRunning = function() {
  return this.dumbReloadIntervalId !== undefined;
}

p5.prototype.stopDumbReload = function() {
  if (this.dumbReloadIntervalId === undefined) return;
  console.log("Stopping dumb reload");
  clearInterval(this.dumbReloadIntervalId);
  this.dumbReloadIntervalId = undefined;
}

p5.prototype.startDumbReload = function(interval) {
  this.stopDumbReload();
  this.dumbReloadInterval = interval || this.dumbReloadInterval; 
  console.log(`Starting dumb reload with interval of ${this.dumbReloadInterval}ms`);
  this.dumbReloadIntervalId = setInterval(() => {
    reloadSketch();
  }, this.dumbReloadInterval);
}

// p5.prototype.registerMethod("afterSetup", p5.prototype.startDumbReload);
