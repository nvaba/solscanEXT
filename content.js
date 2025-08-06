function createLinks(address) {
  console.log(`Creating links for address: ${address}`);

  const cieloLink = `https://app.cielo.finance/profile/${address}`;
  const gmgnLink = `https://gmgn.ai/sol/address/${address}`;
  const twitterLink = `https://x.com/search?q=${address}&src=typed_query`;

  const container = document.createElement("span");
  container.style.marginLeft = "8px";

  const linkStyle = `
    color: #00acee;
    margin-left: 4px;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  `;

  const links = [
    { name: "Cielo", href: cieloLink },
    { name: "GMGN", href: gmgnLink },
    { name: "Twitter", href: twitterLink },
  ];

  links.forEach((link) => {
    const a = document.createElement("a");
    a.href = link.href;
    a.target = "_blank";
    a.innerText = `[${link.name}]`;
    a.style = linkStyle;
    container.appendChild(a);
  });

  return container;
}

// Enhance signer addresses on /tx/ pages
function enhanceSigners() {
  console.log("Trying to enhance transaction signers...");
  const signerLinks = document.querySelectorAll(
    'a.text-current[href^="/account/"]'
  );

  signerLinks.forEach((el) => {
    const address = el.textContent.trim();
    if (!el.dataset.enhanced && address.length > 20) {
      console.log(`Enhancing signer: ${address}`);
      el.after(createLinks(address));
      el.dataset.enhanced = "true";
    }
  });
}

// Enhance wallet address on /account/ pages
function enhanceAccountSpan() {
  console.log("Trying to enhance account page via <span>...");

  const span = document.querySelector("span.break-words");

  if (!span) {
    console.log("No .break-words span found yet.");
    return;
  }

  const address = span.textContent.trim();
  if (!address || address.length < 32 || span.dataset.enhanced) {
    console.log("Invalid or already enhanced wallet span.");
    return;
  }

  console.log(`Enhancing account wallet span: ${address}`);
  span.after(createLinks(address));
  span.dataset.enhanced = "true";
}

// MutationObserver wrapper
function observeAndEnhance(matcherFn) {
  const observer = new MutationObserver(() => {
    matcherFn();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log("MutationObserver attached.");
}

// Entrypoint function to run logic based on URL
function runEnhancements() {
  console.log("Running enhancements for URL:", location.href);
  if (location.href.includes("/tx/")) {
    observeAndEnhance(enhanceSigners);
  } else if (location.href.includes("/account/")) {
    observeAndEnhance(enhanceAccountSpan);
  } else {
    console.log("Not a tx or account page, skipping...");
  }
}

console.log("Solscan QOL content script loaded");
runEnhancements();

// SPA URL change detection
let lastUrl = location.href;
setInterval(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    console.log("Detected URL change:", currentUrl);
    lastUrl = currentUrl;
    runEnhancements();
  }
}, 500);
