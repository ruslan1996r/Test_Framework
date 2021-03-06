function h(tag, props = {}, children = []) {
  return {
    tag,
    props,
    children
  }
}

class LifeHooks {
  beforeMount() {
    Logger.logCall("beforeMount", this.constructor.name)
  }
  mounted() {
    Logger.logCall('mounted', this.constructor.name)
  }
  beforeUpdate(oldNode) {
    Logger.logCall("beforeUpdated", this.constructor.name) //oldNode
  }
  updated() {
    Logger.logCall("updated", this.constructor.name)
  }
  beforeDestroy(node) {
    Logger.logCall("beforeDestroy", node)
  }
  destroyed() {
    Logger.logCall("destroyed")
  }
  catched(error) {
    Logger.logCall("catched", error)
  }
  _update = new Proxy(this.updateEl, {
    apply: (target, ctx, args) => {
      try {
        const oldNode = args.oldNode || this._$node
        this.beforeUpdate(oldNode)
        target.apply(ctx, args)
        this.updated()
      } catch (e) {
        this.catched(e)
      }
    }
  })
  _append = new Proxy(this.createEl, {
    apply: (target, ctx, args) => {
      try {
        this.beforeMount()
        target.apply(ctx, args)
        this.mounted()
      } catch (e) {
        this.catched(e)
      }
    }
  })
  _destroy = new Proxy(this.removeEl, {
    apply: (target, ctx, args) => {
      try {
        this.beforeDestroy(this._$node)
        target.apply(ctx, args)
        this.destroyed()
      } catch (e) {
        this.catched(e)
      }
    }
  })
}

class Component extends LifeHooks {
  constructor(props) {
    super(props)
    this._$node = null
    this.props = props
  }
  _compareByKeys(oldList, newList) {
    try {
      let _destr = {}
      let _common = {}
      let _mount = {}

      for (let i = 0; i < newList.length; i++) {
        if (oldList[i] && !oldList[i].props.key) {
          _destr[i] = oldList[i] // Если у предыдущего элемента в списке ключа не было
        }

        if (oldList.find(e => e.props.key === newList[i].props.key)) { // Если первый массив содержит элемент из нового (элемент не поменялся)
          _common[i] = newList[i]
        } else {
          _mount[i] = newList[i]
        }
      }
      for (let i = 0; i < oldList.length; i++) { // Если есть в первом, но нет во втором, нужно удалить (устаревшие ноды)
        if (oldList[i].props.key && !newList.find(e => e.props.key === oldList[i].props.key)) {
          _destr[i] = oldList[i]
        }
      }
      return {
        _destr,
        _common,
        _mount
      }
    } catch (e) {
      console.error('ERR: ', e)
    }
  }
  /**
   * 
   * @param {Object} oldKeys
   * @property {String} oldKeys.key
   * @param {Object} newKeys
   * @property {String} oldKeys.key
   * @return {Boolean} - Если false, то отправит компонент на перерисовку
   */
  _shalowEqual({ oldKeys, newKeys }) {
    let isEqual = true
    if (Object.keys(oldKeys).length !== Object.keys(newKeys).length) {
      isEqual = false
      return isEqual
    }
    for (let i in oldKeys) {
      if (oldKeys[i] !== newKeys[i]) {
        isEqual = false
        break
      }
    }
    Logger.log("[ShalowEqual][isEqual]: ", isEqual)
    return isEqual
  }

  // Используется единожды, как метод класса
  removeEl(node = this._$node) {
    this._removeEl(node)
  }

  // Используется для всех дом-узлов
  _removeEl(node = this._$node) {
    try {
      // НУЖНО БУДЕТ ЧИСТИТЬ СВОЕГО РОДИТЕЛЯ, ЕСЛИ УДАЛЁН БЫЛ КОМПОНЕНТ
      Logger.log("UNMOUNT_element: ", node)
      node.$el.remove()
      if (this._$node !== null) {
        this._$node = null
      }
    } catch (e) {
      console.error('ERR: ', e)
    }
  }

  // Используется единожды, как метод класса
  createEl({ node = this.render(), container, parent, mountMethod = 'append' }) {
    if (this._$node === null) {
      // debugger
      this._$node = node
    }
    this._createEl({ node, container, parent, mountMethod })
  }

  // Используется для всех дом-узлов
  /**
   * @param {Object} vNode 
   * @property {Object} vNode.node - объект, возвращаемый функцией h()
   * @property {Node} vNode.container - дом-элемент, в который будет монтироваться данный элемент
   * @property {Object} vNode.parent - ссылка на родительский vNode-объект
   * @property {String} vNode.mountMethod - может быть 'append', 'prepend', 'after' (для сестринских элементов)
   */
  _createEl({ node, container, parent, mountMethod = 'append' }) {
    if (typeof node !== "object") {
      return
    }
    try {
      if (node._$node === null) {
        node._append({ container, parent })
        // return node._$node
      } else {
        const element = document.createElement(node.tag)
        Logger.log("MOUNT_element: ", element)

        if (parent) {
          node.parent = parent
        }
        for (const key in node.props) {
          // Создаст хеш-таблицу с ключами
          if (key === 'key' && parent && !parent.keys) { // Запишет ключи в родительскую виртуальную ноду
            parent.keys = {}
            parent.keys[node.props[key]] = node
          } else if (key === 'key' && !parent.keys[key]) { // Занесёт в хеш-таблицу все ноды, которые имеют ключ "кеу"
            parent.keys[node.props[key]] = node
          } else if (key === 'key' && parent.keys[key]) {
            parent.keys[node.props[key]] = node
            console.error(`Duplicate key ${key}. Use only unique key values `)
          }
          // Запишет аттрибут. Установит все пропсы как ключи (айди, классы и тд)
          element.setAttribute(key, node.props[key])
        }
        if (typeof node.children === 'string') {
          element.innerText = node.children
        } else {
          if (node.children && node.children.length) {
            node.children.forEach(child => this._createEl({ node: child, container: element, parent: node }))
          }
        }
        container[mountMethod](element)
        node.$el = element
      }

    } catch (e) {
      console.error('ERR: ', e)
    }
  }

  // Используется единожды, как метод класса
  updateEl({ oldNode = this._$node, newNode = this.render() }) {
    this._updateEl({ oldNode, newNode })
    this._$node = newNode //oldNode//newNode// newNode
  }

  // Используется для всех дом-узлов и компонентов
  _updateEl({ oldNode, newNode, parent }) {
    try {
      if (oldNode._$node || oldNode._$node === null) {
        oldNode.updateEl({ container: parent.$el, newNode, parent })
        return
      }
      if (oldNode.tag !== newNode.tag) {
        if (
          newNode._$node === null &&
          this._shalowEqual({ oldKeys: this.props, newKeys: newNode.props })
        ) {
          // Если пропсы в новом компоненте равны старым, просто запишет старую ноду в качестве новой (оставит всё как есть)
          newNode._$node = oldNode
          return
        }
        this._createEl({ node: newNode, container: oldNode.$el.parentNode, parent })
        this._removeEl(oldNode)
        Logger.log("UPDATE_element(by tag): ", newNode)
      } else {
        newNode.$el = oldNode.$el
        if (oldNode.parent) {
          newNode.parent = oldNode.parent
        }

        while (newNode.$el.attributes.length > 0) { // Удаляет все аттрибуты, пока они не исчезнут (удалит старые аттрибуты)
          newNode.$el.removeAttribute(newNode.$el.attributes[0].name)
        }
        for (const key in newNode.props) {
          newNode.$el.setAttribute(key, newNode.props[key])
        }

        if (typeof newNode.children === 'string') {
          newNode.$el.textContent = newNode.children
          Logger.log("UPDATE_element(by string): ", newNode)
        } else {
          if (typeof oldNode.children === 'string') {
            newNode.$el.textContent = null
            newNode.children.forEach(child => {
              this._createEl({
                node: child,
                container: newNode.$el,
                parent: newNode
              })
            })
            Logger.log("UPDATE_element(array): ", newNode)
          } else {
            if (!oldNode.children || !newNode.children) {
              debugger
            }
            const maxChildren = Math.max(oldNode.children.length, newNode.children.length)
            let nodes
            if (oldNode.keys && Object.keys(oldNode.keys).length) {
              nodes = this._compareByKeys(oldNode.children, newNode.children)
              if (!newNode.keys) {
                newNode.keys = {}
              }
            }
            for (let i = 0; i < maxChildren; i++) {
              if (nodes) {
                // Оставить без изменений. Если ключ текущей равен ключу, который есть в подмножестве на повторение
                if (nodes._common[i] && newNode.children[i].props.key === nodes._common[i].props.key) {
                  // Добавить новому элементу ссылку на дом-узел
                  let _commonChild = newNode.children.find(child => child.props.key === nodes._common[i].props.key)
                  _commonChild['parent'] = newNode
                  _commonChild['$el'] = oldNode.keys[nodes._common[i].props.key].$el
                  newNode.keys[nodes._common[i].props.key] = oldNode.keys[nodes._common[i].props.key]
                }
                // Удалить. Если находится в подмножестве на удаление 
                // Если ключ текущей ноды равен ключу на удаление и такой ключ есть в виртуальной ноде
                if (
                  nodes._destr[i] &&
                  oldNode.children[i].props.key === nodes._destr[i].props.key &&
                  oldNode.keys[oldNode.children[i].props.key]
                ) {
                  this._removeEl(oldNode.children[i])
                } else if (nodes._destr[i] && !oldNode.children[i].props.key) {
                  this._removeEl(oldNode.children[i])
                }
                if (
                  newNode.children[i] &&
                  nodes._mount[i] &&
                  newNode.children[i].props.key === nodes._mount[i].props.key
                ) {
                  if (i === 0) { // Если вставляемый элемент должен вставиться в начало списка
                    this._createEl({
                      node: newNode.children[i],
                      container: newNode.$el,
                      parent: newNode,
                      mountMethod: "prepend"
                    })
                  } else if (newNode.keys[newNode.children[i - 1].props.key]) { // Если есть предыдущий сосед, добавь ему нового соседа
                    this._createEl({
                      node: newNode.children[i],
                      container: newNode.keys[newNode.children[i - 1].props.key].$el, // подсунуть братана этажом выше
                      parent: newNode,
                      mountMethod: "after"
                    })
                  }
                }
                // Если этот элемент был с атрибутом "key", выйди из данной итерации цикла после выполненной логики
                continue
              }

              if (oldNode.children[i] && newNode.children[i]) {
                this._updateEl({ oldNode: oldNode.children[i], newNode: newNode.children[i], parent: newNode })
              } else if (!oldNode.children[i] && newNode.children[i]) {
                this._createEl({
                  node: newNode.children[i],
                  container: newNode.$el,
                  parent: newNode
                })
              } else if (oldNode.children[i] && !newNode.children[i]) {
                this._removeEl(oldNode.children[i])
              }
            }
            nodes = null
          }
        }
      }
    } catch (e) {
      console.error('ERR: ', e)
    }
  }
}