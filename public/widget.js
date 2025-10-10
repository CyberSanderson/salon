(function() {
  // Find the script tag on the host page
  const scriptTag = document.currentScript;
  const botId = scriptTag.getAttribute('data-bot-id');

  if (!botId) {
    console.error("Ariah Desk: 'data-bot-id' attribute is missing from the script tag.");
    return;
  }

  // Create a container for our iframe
  const iframeContainer = document.createElement('div');
  iframeContainer.id = 'ariah-desk-widget-container';
  iframeContainer.style.position = 'fixed';
  iframeContainer.style.bottom = '0';
  iframeContainer.style.right = '0';
  iframeContainer.style.width = '450px'; // A bit wider to avoid scrollbars
  iframeContainer.style.height = '600px'; // Taller to avoid scrollbars
  iframeContainer.style.border = 'none';
  iframeContainer.style.zIndex = '999999999';

  // Create the iframe
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.ariahdesk.com/chat-embed?id=${botId}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  // Append everything to the page
  iframeContainer.appendChild(iframe);
  document.body.appendChild(iframeContainer);
})();