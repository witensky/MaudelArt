export const isAbortLikeError = (error: unknown) => {
  if (!error) {
    return false;
  }

  const anyError = error as any;
  const name = String(anyError?.name ?? '');
  const message = String(anyError?.message ?? '');
  const details = String(anyError?.details ?? '');

  return (
    name === 'AbortError' ||
    message.includes('AbortError') ||
    message.includes('signal is aborted') ||
    details.includes('AbortError') ||
    details.includes('signal is aborted')
  );
};

export const getErrorMessage = (error: unknown) => {
  if (!error) {
    return 'Unknown error';
  }

  if (typeof error === 'string') {
    return error;
  }

  const anyError = error as any;
  return (
    anyError?.message ??
    anyError?.error_description ??
    anyError?.details ??
    anyError?.hint ??
    'Unknown error'
  );
};

