class _Logger {
  // Logger.info("beforeMount...").style({ color: "red", "font-size": "16px" })
  // info(...args) {
  //   if (isInfo) {
  //     this.args = args
  //     return Logger
  //   }
  // }
  info(...args) {
    if (isInfo) {
      // this.args = args
      // return Logger
      console.log(...args)
    }
  }
  log = (...args) => {
    if (isDev) {
      console.log(...args)
    }
  }
  logCall = (name, ...args) => {
    if (showHooks) {
      // if (name.toLocaleLowerCase().includes("mount")) {
      //   console.log(`%c [${name}] ${className}`, 'background: #222; color: #bada55; font-size: 14px', ...args)
      //   return
      // } else if (name.toLocaleLowerCase().includes("update")) {
      //   console.log(`%c [${name}] ${className}`, 'background: #222; color: #3cd2ffe0; font-size: 14px', ...args)
      // } else if (name.toLocaleLowerCase().includes("destroy")) {
      //   console.log(`%c [${name}] ${className}`, 'background: #222; color: #ffa80b; font-size: 14px', ...args)
      // } else if (name.toLocaleLowerCase().includes("catched")) {
      //   console.log(`%c [${name}] ${className}`, 'background: #222; color: #ff6680; font-size: 14px', ...args)
      // }
      switch (name) {
        case "beforeMount":
        case "mounted":
          console.log(`%c [${name}]`, 'background: #222; color: #bada55; font-size: 14px', ...args)
          break
        case "beforeUpdated":
        case "updated":
          console.log(`%c [${name}]`, 'background: #222; color: #3cd2ffe0; font-size: 14px', ...args)
          break
        case "beforeDestroy":
        case "destroyed":
          console.log(`%c [${name}]`, 'background: #222; color: #ffa80b; font-size: 14px', ...args)
          break
        case "catched":
          console.log(`%c [${name}]`, 'background: #222; color: #ff6680; font-size: 14px', ...args)
        default:
          break;
      }
    }
  }
  // style(styles = {}) {
  //   let _styles = ""
  //   for (let s in styles) {
  //     _styles += `${s}:${styles[s]}; `
  //   }
  //   console.log(`%c [${this.args}]`, _styles)
  // }
}

const Logger = new _Logger()