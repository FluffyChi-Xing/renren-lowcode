const callableFnCacheMap = new WeakMap<CallableFunction, boolean>();
const boundedMap: WeakMap<CallableFunction, boolean> = new WeakMap<Function, boolean>();
const functionBoundedValueMap: WeakMap<CallableFunction, boolean> = new WeakMap<Function, boolean>();


/**
 * @description 绑定 target 到 fn
 * @param target
 * @param fn
 */
export function rebindTarget2Fn(target: any, fn: any): any {
  /*
    仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类，不然微应用中调用时会抛出 Illegal invocation 异常
    目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
    @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
   */
  if (isCallable(fn) && !isBoundedFunction(fn) && !isConstructable(fn)) {
    const cachedBoundFunction: CallableFunction | undefined = functionBoundedValueMap.get(fn);
    if (cachedBoundFunction) {
      return cachedBoundFunction;
    }

    // 绑定 target 到 fn
    const boundValue: any = Function.prototype.bind.call(fn, target);

    Object.getOwnPropertyNames(fn).forEach((key: string) => {
      // boundValue might be a proxy, need to check if is the key exist in boundValue
      if (!boundValue.hasOwnProperty(key)) {
        Object.defineProperty(boundValue, key, Object.getOwnPropertyDescriptor(fn, key));
      }
    });

    if (fn.hasOwnProperty('prototype') && !boundValue.hasOwnProperty('prototype')) {
      Object.defineProperty(boundValue, 'prototype', {
        value: fn.prototype,
        enumerable: false,
        writable: true
      });
    }

    if (typeof fn.toString() === 'undefined') {
      const valueHasInstanceToString: any = fn.hasOwnProperty('toString') && !boundValue.hasOwnProperty('toString');
      const boundValueHasPrototypeToString: any = boundValue.toString() === Function.prototype.toString;

      if (valueHasInstanceToString || boundValueHasPrototypeToString) {
        const originToStringDescriptor = Object.getOwnPropertyDescriptor(
          valueHasInstanceToString ? fn : Function.prototype,
          'toString'
        );


        Object.defineProperty(
          boundValue,
          'toString',
          Object.assign(
            {},
            originToStringDescriptor,
            originToStringDescriptor?.get ? null : { value: () => fn.toString() },
          ),
        );
      }
    }

    functionBoundedValueMap.set(fn, boundValue);
    return boundValue;
  }
  return fn;
}


/**
 * @description 判断一个变量 fn 是否能被调用
 * @param fn
 */
export function isCallable(fn: any): boolean {
  if (callableFnCacheMap.has(fn)) {
    return true;
  }

  const flag: boolean = typeof fn === 'function' && fn instanceof Function;
  if (flag) {
    callableFnCacheMap.set(fn, flag);
  }

  return flag;
}


/**
 * @description 判断一个变量 fn 是否是一个绑定函数
 * @param fn
 */
export function isBoundedFunction(fn: CallableFunction): boolean | undefined {
  if (boundedMap.has(fn)) {
    return boundedMap.get(fn);
  }


  const bounded: boolean = fn.name.indexOf('bound') === 0 && !fn.hasOwnProperty('prototype');
  boundedMap.set(fn, bounded);
  return bounded;
}


/**
 * @description 判断一个变量 fn 是否可以被构造
 * @param fn
 */
export function isConstructable(fn: () => any | FunctionConstructor) {
  // prototype methods might be changed while code running, so we need check it every time
  const hasPrototypeMethods =
    fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1;

  if (hasPrototypeMethods) return true;

  if (fnRegexCheckCacheMap.has(fn)) {
    return fnRegexCheckCacheMap.get(fn);
  }

  /*
    1. 有 prototype 并且 prototype 上有定义一系列非 constructor 属性
    2. 函数名大写开头
    3. class 函数
    满足其一则可认定为构造函数
   */
  let constructable = hasPrototypeMethods;
  if (!constructable) {
    // fn.toString has a significant performance overhead, if hasPrototypeMethods check not passed, we will check the function string with regex
    const fnString = fn.toString();
    const constructableFunctionRegex = /^function\b\s[A-Z].*/;
    const classRegex = /^class\b/;
    constructable = constructableFunctionRegex.test(fnString) || classRegex.test(fnString);
  }

  fnRegexCheckCacheMap.set(fn, constructable);
  return constructable;
}
