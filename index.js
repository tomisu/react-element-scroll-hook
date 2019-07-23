import { useRef, useState, useCallback } from 'react';


// Edge has a bug where scrollHeight is 1px bigger than clientHeight when there's no scroll.
const isEdge = /Edge\/\d./i.test(navigator.userAgent);


function throttle(func, wait) {
  let context, args, result;
  let timeout = null;
  let previous = 0;
  const later = function () {
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) {
      context = args = null;
    }
  };
  return function () {
    const now = Date.now();
    const remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

function useScrollInfo() {
  const [scroll, setScroll] = useState({ x: {}, y: {} });
  const ref = useRef(null);
  const previousScroll = useRef(null);

  const throttleTime = 50;

  function handleScroll() {
    const element = ref.current;
    let maxY = element.scrollHeight - element.clientHeight;
    const maxX = element.scrollWidth - element.clientWidth;

    // Edge has a bug where scrollHeight is 1px bigger than clientHeight when there's no scroll.
    if (isEdge && maxY === 1 && element.scrollTop === 0) {
      maxY = 0;
    }

    const percentageY = maxY !== 0 ? element.scrollTop / maxY : null;
    const percentageX = maxX !== 0 ? element.scrollLeft / maxX : null;

    let classNameY = 'no-scroll-y';
    if (percentageY === 0) {
      classNameY = 'scroll-top';
    } else if (percentageY === 1) {
      classNameY = 'scroll-bottom';
    } else if (percentageY) {
      classNameY = 'scroll-middle-y';
    }

    let classNameX = 'no-scroll-x';
    if (percentageX === 0) {
      classNameX = 'scroll-left';
    } else if (percentageX === 1) {
      classNameX = 'scroll-right';
    } else if (percentageX) {
      classNameX = 'scroll-middle-x';
    }

    const previous = previousScroll.current;

    const scrollInfo = {
      x: {
        percentage: percentageX,
        value: element.scrollLeft,
        total: maxX,
        className: classNameX,
        direction: previous ? Math.sign(element.scrollLeft - previous.x.value) : 0,
      },
      y: {
        percentage: percentageY,
        value: element.scrollTop,
        total: maxY,
        className: classNameY,
        direction: previous ? Math.sign(element.scrollTop - previous.y.value) : 0,
      }
    };
    previousScroll.current = scrollInfo;
    setScroll(scrollInfo);
  }

  const throttledHandleScroll = throttle(handleScroll, throttleTime);

  const setRef = useCallback(node => {
    if (node) {
      // When the ref is first set (after mounting)
      node.addEventListener('scroll', throttledHandleScroll);
      window.addEventListener('resize', throttledHandleScroll);
      ref.current = node;
      throttledHandleScroll();  // initialization
    } else if (ref.current) {
      // When unmounting
      ref.current.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('resize', throttledHandleScroll);
    }
  }, []);


  return [scroll, setRef, ref];
}


export default useScrollInfo;
