class Child extends Component {
  constructor(props) {
    super(props)

    this.state = Reactive.call(this, {
      count: 0,
      hello: "awdawd123123",
      testTitle: "test_11222333"
    })
  }

  mounted() {
    asyncSet().then(get => {
      const testBtn = get("test")
      const testClick = get('btn')
      const minus = get("minus")
      const plus = get("plus")

      testBtn.onclick = this.test
      testClick.onclick = this.testClick
      minus.onclick = () => this.changeCount(-1)
      plus.onclick = () => this.changeCount(1)
    })
  }

  changeCount = (op) => {
    this.state.count += op
  }

  test = () => {
    console.log("test", this.state.testTitle)
  }

  testClick = () => {
    console.log("testClick", this.state.hello)
  }

  render() {
    const { title } = this.props
    return (
      h('div', {}, [
        h('div', { style: "color: #b019e1; font-size: 40px;" }, title),
        h('button', { id: "test" }, 'Child Click'),
        h('button', { id: "btn" }, 'press me'),
        h('div', { style: "display: flex" }, [
          h('button', { id: "minus", style: "color: red; font-size: 32px" }, 'minus'),
          h("h3", { style: 'margin: 20px; font-size: 32px' }, String(this.state.count)),
          h('button', { id: "plus", style: "color: green; font-size: 32px" }, 'plus')
        ]),
        h('hr')
      ])
    )
  }
}
class Test extends Component {
  constructor(props) {
    super(props)

    this.state = Reactive.call(this, {
      users: [],
      edit: false,
      wrongArray: ['first', 'second'],
      showHello: false,
      comments: [],
      titleeee: 'privet title!'
    })

    this.mount({ container: document.getElementById('app') })
  }

  async getUsers() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    const users = await res.json()
    this.state.users = [users[0], users[1]]
  }
  async allUsers() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    this.state.users = await res.json()
  }
  async getComments() {
    const res = await fetch("https://jsonplaceholder.typicode.com/comments")
    const comments = await res.json()
    this.state.comments = comments
  }

  pushComment() {
    const comm = {
      id: this.state.comments.length + 2,
      name: "comment_" + this.state.comments.length + 2,
      body: 'est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et'
    }
    this.state.comments = [comm, ...this.state.comments]
  }

  insert() {
    const user = {
      id: Math.random(),
      username: "first pos",
      email: "time: "
    }
    this.state.users = [user, ...this.state.users]
  }

  getContext(args) {
    console.log("getContext!", args, this)
  }

  deleteUser(userId) {
    this.state.users = this.state.users.filter(user => user.id !== userId)
  }

  addUser() {
    const user = {
      id: Math.random(),
      username: "VOVA",
      email: "time: "
    }
    this.state.users = [...this.state.users, user]
  }

  changeEdit() {
    this.state.edit = !this.state.edit
    this.state.showHello = !this.state.showHello
  }
  makeError() {
    this.state.wrongArray = null
  }

  changeTitle() {
    this.state.titleeee = 'new privet title'
  }

  renderList() {
    if (!this.state.users.length) {
      return [h('h1', {}, 'List is empty')]
    }
    return (
      this.state.users.map((el, i) => (
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
        h("div", { test: "RENDER_CHILD123123" }, [new Child({ title: this.state.titleeee })]),
        h("button", { onclick: "_this.changeTitle()" }, 'change child title'),
        h('button', { onclick: "_this.getUsers()" }, 'Get users btn'),
        h('button', { onclick: "_this.addUser()" }, 'Add user btn'),
        h('button', { onclick: "_this.allUsers()" }, "Get all users"),
        h('button', { onclick: "_this.changeEdit()" }, this.state.edit ? "NON" : "EDIT"),
        h('br'),
        h("button", { onclick: "_this.insert()" }, 'ON FIRST POS'),
        h("button", { onclick: "_this.getComments()" }, "GET_COMMENTS"),
        h("button", { onclick: "_this.pushComment()" }, "pushComment"),
        h("div", {}, [
          h('button', { onclick: "_this.makeError()", style: "color: red; font-size: 25px" }, 'makeError'),
          h("div", {}, [...this.state.wrongArray.map(e => h('div', {}, e))])
        ]),
        h("button", { style: `color:red; font-size: 40px`, onclick: '_this.getContext()' }, "TEST"),

        this.state.showHello && h('div', {}, "HELLO!!!!"),
        h('ol', {}, this.renderList()),
        this.state.edit ? h('h3', { style: "color: blue" }, "EDIT") : h('h3', { style: "color: red" }, "NON_EDIT"),
        h("h2", {}, "Comments"),
        h('ul', {}, [...this.state.comments.map((el, i) => (
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