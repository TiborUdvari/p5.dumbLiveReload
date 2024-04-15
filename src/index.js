console.log('dumb reload');

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
  console.log('dumb reload');
}

preventSketchLoading();
populateGlobalVarNames();

setInterval(() => {
  reloadSketch();
}, 200);

