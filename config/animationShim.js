// This is a workaround for:
//    Warning: React depends on requestAnimationFrame. Make sure that you load a polyfill in older browsers. http://fb.me/react-polyfills
// that occurs in tests after upgrading to React 16.
global.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0);
};
