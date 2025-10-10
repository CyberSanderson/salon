(function() {
  const scriptTag = document.currentScript;
  const botId = scriptTag.getAttribute('data-bot-id');

  if (!botId) {
    console.error("Ariah Desk: 'data-bot-id' attribute is missing.");
    return;
  }

  // --- 1. CREATE THE FLOATING BUBBLE ---
  const bubble = document.createElement('div');
  bubble.id = 'ariah-desk-bubble';
  bubble.style.position = 'fixed';
  bubble.style.bottom = '20px';
  bubble.style.right = '20px';
  bubble.style.width = '64px';
  bubble.style.height = '64px';
  bubble.style.borderRadius = '50%';
  bubble.style.backgroundColor = '#14B8A6'; // Default teal color
  bubble.style.color = 'white';
  bubble.style.display = 'flex';
  bubble.style.alignItems = 'center';
  bubble.style.justifyContent = 'center';
  bubble.style.cursor = 'pointer';
  bubble.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  bubble.style.zIndex = '999999998';
  bubble.style.transition = 'transform 0.2s ease-in-out';
  bubble.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:32px; height:32px;"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>`;
  
  bubble.onmouseenter = () => bubble.style.transform = 'scale(1.1)';
  bubble.onmouseleave = () => bubble.style.transform = 'scale(1)';

  document.body.appendChild(bubble);

  // --- 2. CREATE THE IFRAME CONTAINER (BUT HIDE IT) ---
  const iframeContainer = document.createElement('div');
  iframeContainer.id = 'ariah-desk-iframe-container';
  iframeContainer.style.position = 'fixed';
  iframeContainer.style.bottom = '100px';
  iframeContainer.style.right = '20px';
  iframeContainer.style.width = '400px';
  iframeContainer.style.height = 'calc(100% - 120px)';
  iframeContainer.style.maxHeight = '520px';
  iframeContainer.style.border = 'none';
  iframeContainer.style.borderRadius = '12px';
  iframeContainer.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
  iframeContainer.style.display = 'none'; // Start hidden
  iframeContainer.style.zIndex = '999999999';
  
  document.body.appendChild(iframeContainer);

  // --- 3. HANDLE THE CLICK EVENT ---
  let iframeLoaded = false;
  bubble.addEventListener('click', () => {
    if (iframeContainer.style.display === 'none') {
      iframeContainer.style.display = 'block';
      // Load the iframe content only the first time it's opened
      if (!iframeLoaded) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.ariahdesk.com/chat-embed?id=${botId}`;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframeContainer.innerHTML = ''; // Clear any previous content
        iframeContainer.appendChild(iframe);
        iframeLoaded = true;
      }
    } else {
      iframeContainer.style.display = 'none';
    }
  });
})();