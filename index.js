import { useRef, useState, useCallback} from 'react';


function useScrollInfo() {
  const [scroll, setScroll] = useState({ x: {}, y: {} });
  const ref = useRef(null);

  function handleScroll() {
    const element = ref.current;
    const maxY = element.scrollHeight - element.clientHeight;
    const maxX = element.scrollWidth - element.clientWidth;

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

    setScroll({
      x: {
        percentage: percentageX,
        value: element.scrollLeft,
        total: maxX,
        className: classNameX,
      },
      y: {
        percentage: percentageY,
        value: element.scrollTop,
        total: maxY,
        className: classNameY,
      }
    });
  }

  const setRef = useCallback(node => {
    if (node) {
      // When the ref is first set (after mounting)
      node.addEventListener('scroll', handleScroll);
      ref.current = node;
      handleScroll();  // initialization
    } else if (ref.current) {
      // When unmounting
      ref.current.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return [scroll, setRef, ref];
}


export default useScrollInfo;
