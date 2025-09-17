(function() {
  'use strict';

  // Configuration from data attributes
  const script = document.currentScript;
  const clubName = script.getAttribute('data-club') || 'Widzew Łódź';
  const primaryColor = script.getAttribute('data-color') || '#AD180F';
  const baseUrl = script.getAttribute('data-base-url') || window.location.origin;

  // Create chat widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'widzew-chat-widget';
  widgetContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    height: 500px;
    border: none;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    z-index: 9999;
    background: white;
    display: none;
    overflow: hidden;
  `;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = `${baseUrl}/widget?club=${encodeURIComponent(clubName)}&color=${encodeURIComponent(primaryColor)}`;
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 12px;
  `;

  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white"/>
      <path d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" fill="white"/>
    </svg>
  `;
  toggleButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    background: ${primaryColor};
    color: white;
    cursor: pointer;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  `;

  // Add hover effect
  toggleButton.addEventListener('mouseenter', () => {
    toggleButton.style.transform = 'scale(1.1)';
  });

  toggleButton.addEventListener('mouseleave', () => {
    toggleButton.style.transform = 'scale(1)';
  });

  // Toggle widget visibility
  let isOpen = false;
  toggleButton.addEventListener('click', () => {
    isOpen = !isOpen;
    widgetContainer.style.display = isOpen ? 'block' : 'none';
    
    // Update button icon
    if (isOpen) {
      toggleButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="white"/>
        </svg>
      `;
    } else {
      toggleButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white"/>
          <path d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" fill="white"/>
        </svg>
      `;
    }
  });

  // Handle messages from iframe
  window.addEventListener('message', (event) => {
    if (event.origin !== baseUrl) return;

    switch (event.data.type) {
      case 'close-widget':
        isOpen = false;
        widgetContainer.style.display = 'none';
        toggleButton.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white"/>
            <path d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" fill="white"/>
          </svg>
        `;
        break;
      case 'widget-ready':
        console.log('Widzew Chat Widget loaded successfully');
        break;
    }
  });

  // Assemble widget
  widgetContainer.appendChild(iframe);
  document.body.appendChild(widgetContainer);
  document.body.appendChild(toggleButton);

  // Initialize widget
  console.log(`Widzew Chat Widget initialized for ${clubName}`);
})();
