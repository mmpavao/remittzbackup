export function logRegistration(
  type: 'info' | 'error' | 'success',
  message: string
) {
  // Ensure we have a valid message
  if (!message) {
    console.error('Logger received empty message');
    return;
  }

  try {
    const event = new CustomEvent('registration-log', {
      detail: {
        timestamp: new Date().toISOString(),
        type,
        message,
      },
    });
    window.dispatchEvent(event);

    // Also log to console for debugging
    if (type === 'error') {
      console.error(message);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  } catch (error) {
    console.error('Failed to log registration event:', error);
  }
}