(function () {

  const copy = {
    stillDontLikeIt: `I still don't like 'em.`
  }
  
  const elements = {
    blowItUp: document.getElementById('blowup-colors'),
    okTooMuch: document.getElementById('ok-too-much'),
    buttons: document.querySelectorAll('.btn')
  }

  const cssVars = getAllCSSVariableNames();
  // const originalCSSProps = { 
  //   ...getElementCSSVariables(cssVars, document.documentElement)
  // };
  
  let interval;

  elements.blowItUp.addEventListener('click', () => {
    firstTime = false;
    interval = setInterval(blowUpColors, 1);
    elements.blowItUp.innerText = copy.stillDontLikeIt;
    elements.blowItUp.style = 'display:none;';
    elements.okTooMuch.style = 'display:block';
    [...elements.buttons].forEach(button => {
      button.style.color = '#fff';
      button.style.fontWeight = 'bold';  
    });
  });

  elements.okTooMuch.addEventListener('click', () => {
    clearInterval(interval);
    elements.okTooMuch.style = 'display:none;';
    elements.blowItUp.style = 'display:block';
  });

  function blowUpColors () {
    cssVars.forEach(variable => setColor(variable, getRandomRGB()));
  }

  function getRandomRGB () {
    // range + offset must be less than 255
    const range = 40;
    const offset = 160;  
    const randomR = Math.random() * range + offset;
    const randomG = Math.random() * range + offset;
    const randomB = Math.random() * range + offset;
    return `rgb(${randomR}, ${randomG}, ${randomB})`;
  }

  function setColor (variable, color) {
    const style = document.documentElement.style;
    style.setProperty(variable, color);
  }


  // -- VARIABLE GETTERS ----------------------- //
  // shout out to tnt-rox
  // https://stackoverflow.com/questions/48760274/get-all-css-root-variables-in-array-using-javascript-and-change-the-values
  function getAllCSSVariableNames () {
    return Array.from(document.styleSheets)
      .filter(
        sheet =>
          sheet.href === null || sheet.href.startsWith(window.location.origin)
      )
      .reduce(
        (acc, sheet) =>
          (acc = [
            ...acc,
            ...Array.from(sheet.cssRules).reduce(
              (def, rule) =>
                (def =
                  rule.selectorText === ":root"
                    ? [
                        ...def,
                        ...Array.from(rule.style).filter(name =>
                          name.startsWith("--")
                        )
                      ]
                    : def),
              []
            )
          ]),
        []
      );    
  }


  function getElementCSSVariables (allCSSVars, element = document.body, pseudo){
    const elStyles = window.getComputedStyle(element, pseudo);
    const cssVars = {};
    for(var i = 0; i < allCSSVars.length; i++){
      let key = allCSSVars[i];
      let value = elStyles.getPropertyValue(key)
      if(value){cssVars[key] = value;}
    } 
    return cssVars;
  } 
})();