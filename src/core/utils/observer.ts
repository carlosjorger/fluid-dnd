export const observeMutation = (
  callback: (observer: MutationObserver, mutation: MutationRecord) => void,
  element: Element,
  options?: MutationObserverInit
) => {
  const observe = new MutationObserver((mutations) => {
    if (mutations.length > 0) {
      const mutation = mutations[0];
      callback(observe, mutation);
    }
  });
  observe.observe(element, options);
  return observe
};
