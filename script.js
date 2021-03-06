class Child extends Component {
  constructor(props) {
    super(props)
  }
  // mounted() {
  //   console.log("beforeMount", this._$node)
  // }
  // updated() {
  //   console.log("update", this._$node)
  // }
  // beforeUpdate(oldNode) {
  //   console.log("beforeUpdate", this._$node, "oldNode", oldNode)
  // }
  render() {
    const { title } = this.props
    return (h('div', { style: "color: #b019e1; font-size: 40px;" }, title))
  }
}

// const _child = new Child({ title: "privet from props" })


class Test extends Component {
  constructor() {
    super()

    this.users = []
    this.edit = false
    this.showHello = false
    this.comments = []
    this.wrongArray = ['first', 'second']
    this.titleeee = 'privet title!'

    this._append({ container: document.getElementById('app') })

    // this.getComments()
    // this.getUsers() // Здесь вызывается маунт (Во время срабатывания конструктора. Отталкиваясь от этого, можно заюзать и другие циклы)
  }

  // beforeUpdate(oldNode) {
  //   console.log("oldNode", oldNode)
  // }

  async getUsers() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    const users = await res.json()
    this.users = [users[0], users[1]]
    this._update({})
  }
  async allUsers() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    this.users = await res.json()
    // this.users = TEST//users
    this._update({})
  }
  async getComments() {
    const res = await fetch("https://jsonplaceholder.typicode.com/comments")
    const comments = await res.json()
    this.comments = comments
    this._update({})
  }

  pushComment() {
    const comm = {
      id: this.comments.length + 2,
      name: "comment_" + this.comments.length + 2,
      body: 'est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et'
    }
    this.comments = [comm, ...this.comments]
    // this.comments = [...this.comments, comm]

    this._update({})
  }

  insert() {
    const user = {
      id: Math.random(),
      username: "first pos",
      email: "time: "
    }
    this.users = [user, ...this.users]
    this._update({})
  }

  getContext(args) {
    console.log("getContext!", args, this)
  }

  deleteUser(userId) {
    this.users = this.users.filter(user => user.id !== userId)

    this._update({})
  }

  addUser() {
    const user = {
      id: Math.random(),
      username: "VOVA",
      email: "time: "
    }
    this.users = [...this.users, user]
    this._update({})
  }

  changeEdit() {
    this.edit = !this.edit
    this.showHello = !this.showHello

    console.log("this.showHello", this.showHello)
    this._update({})
  }
  makeError() {
    this.wrongArray = null
    this._update({})
  }

  changeTitle() {
    this.titleeee = 'new privet title'// 'privet titlte: ' + new Date().getMilliseconds() + "!"
    this._update({})
  }

  renderList() {
    if (!this.users.length) {
      return [h('h1', {}, 'List is empty')]
    }
    return (
      this.users.map((el, i) => (
        h('li', { key: el.id, onclick: `_this.deleteUser(${el.id})`, style: "cursor: pointer" }, [
          h('h3', {}, el.username + "_" + i),
          h('p', {}, el.email + new Date().getSeconds())
        ])
      ))
    )
  }

  render() {
    return (
      h('div', {}, [
        h('h1', { style: 'color: green' }, 'hello'),
        h("div", { test: "RENDER_CHILD123123" }, [new Child({ title: this.titleeee })]),
        // h("div", { test: "RENDER_CHILD123123" }, [_child]),
        h("button", { onclick: "_this.changeTitle()" }, 'change child title'),
        h('button', { onclick: "_this.getUsers()" }, 'Get users btn'),
        h('button', { onclick: "_this.addUser()" }, 'Add user btn'),
        h('button', { onclick: "_this.allUsers()" }, "Get all users"),
        h('button', { onclick: "_this.changeEdit()" }, this.edit ? "NON" : "EDIT"),
        h('br'),
        h("button", { onclick: "_this.insert()" }, 'ON FIRST POS'),
        h("button", { onclick: "_this.getComments()" }, "GET_COMMENTS"),
        h("button", { onclick: "_this.pushComment()" }, "pushComment"),
        h("div", {}, [
          h('button', { onclick: "_this.makeError()", style: "color: red; font-size: 25px" }, 'makeError'),
          h("div", {}, [...this.wrongArray.map(e => h('div', {}, e))])
        ]),
        h("button", { style: `color:red; font-size: 40px`, onclick: '_this.getContext()' }, "TEST"),

        this.showHello && h('div', {}, "HELLO!!!!"),
        h('ol', {}, this.renderList()),
        this.edit ? h('h3', { style: "color: blue" }, "EDIT") : h('h3', { style: "color: red" }, "NON_EDIT"),
        h("h2", {}, "Comments"),
        h('ul', {}, [...this.comments.map((el, i) => (
          h('li', { key: el.id }, [
            h('div', {}, el.name),
            h('span', { style: "color: green" }, el.email),
            h('small', {}, el.body)
          ])
        ))])
      ])
    )
  }
}

const _this = new Test()
// _this.createEl({ container: document.getElementById('app') })
// ----------------------------------------------------------------------------------------------------------------

// const log = text => `Log: ${text}`;
// class Testing {
//   test(arg) {
//     console.log("RENDER FUNCTION", arg)
//   }
//   beforeMount() {
//     console.log("beforeMount...")
//   }
//   mounted() {
//     console.log("mounted...")
//   }

//   // mountProxy - по идее, это наш createEl (не приватный, а уже публичная функция в class Component -> lib) 
//   // mountProxy - маунтед, а beforeMount и mounted - наши "прослушки" через прокси
//   // По такой же логике переписать _update и unmount
//   mountProxy = new Proxy(this.test, {
//     apply: (target, ctx, args) => {
//       this.beforeMount()
//       target.apply(ctx, args)
//       this.mounted()
//     }
//   })
// }
// class Comp extends Testing {
//   constructor() {
//     super()
//   }
//   doSmt(arg) {
//     console.log("dosmt", arg)
//   }
//   beforeMount() {
//     this.doSmt("beforeMount my mount")
//   }
//   mounted() {
//     this.doSmt("mounted my mount element")
//   }
// }
// // const t = new Testing()
// const c = new Comp()

// function MOUNT() {
//   const app = document.getElementById('app')
//   const el = document.createElement("div")
//   el.textContent = 'MOUNTED_ELEMENT'
//   app.append(el)
//   console.log("Element appended!")
// }
// function beforeMount() {
//   console.log("beforeMount...")
// }
// function mounted() {
//   console.log("mounted...")
// }

// const p = new Proxy(MOUNT, {
//   apply(target, ctx, args) {
//     beforeMount()
//     target.apply(ctx, args)
//     mounted()
//   }
// })
//target - функция log
//ctx - контекст
//args - все параметры, которые передаются в функцию (тут text)
// const fp = new Proxy(log, {
//   apply(target, ctx, args) {
//     console.log("Calling fn...", target, ctx, args);
//     return target.apply(ctx, args).toUpperCase(); //target - сама функция (тут log)
//   }
// });
// console.log(fp("text"));