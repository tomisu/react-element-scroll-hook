# react-element-scroll-hook
A react hook to use the scroll information of an element.

## Install
`npm install react-element-scroll-hook`

## Usage
```
// Import the hook
import useScrollInfo from 'react-element-scroll-hook';

function Mycomponent(props) {
  // Initialize the hook
  const [scrollInfo, setRef] = useScrollInfo();

  // Use the scrollInfo at will
  console.log(scrollInfo);

  // use setRef to indicate the element you want to monitor
  return (
    <div id="content" ref={setRef}>
      {props.children}
    </div>
  );
}
```

## scrollInfo object
When using this hook, you'll get an object containing the scroll data. It has two keys, `x` and `y`, each of them contain the following keys:
 * value: amount of pixels scrolled
 * total: amount of pixels that can be scrolled
 * percentage: a value from 0 to 1 or `null` if there's no scroll
 * className: a string to identify the state of the scroll

#### className
For the y axis, className can take 4 values:
`scroll-top`, `scroll-middle-y`, `scroll-bottom`, and `no-scroll-y`.

For the x axis, the values are:
`scroll-left`, `scroll-middle-x`, `scroll-right`, and `no-scroll-x`. 

#### Example scrollInfo object
```
{
  x: {
    percentage: 0.5,
    value: 120,
    total: 240,
    className: 'scroll-middle-x',
  },
  y: {
    percentage: 1,
    value: 200,
    total: 200,
    className: 'scroll-bottom',
  }
}
```

## Basic Example
In this basic example, we'll add the scroll Y className to a component, to later style it with CSS based on weather it's scrolle or not.
```
// Import the hook
import useScrollInfo from 'react-element-scroll-hook';

function Mycomponent(props) {
  // Initialize the hook
  const [scrollInfo, setRef] = useScrollInfo();

  return (
    <div id="content" ref={setRef} className={scrollInfo.y.className}>
      {props.children}
    </div>
  );
}
```

## Accessing the element ref
If you also need to access the monitored element, you can use the third constant returned by `useScrollInfo`:

```
function Mycomponent(props) {
  // Initialize the hook
  const [scrollInfo, setRef, ref] = useScrollInfo();

  // Do something with the element
  console.log(ref.current);

  return (
    <div id="content" ref={setRef}>
      {props.children}
    </div>
  );
}
```