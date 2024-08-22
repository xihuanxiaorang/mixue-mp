Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
    underlineWidth: 0,
    underlineLeft: 0,
  },

  lifetimes: {
    attached() {
      this.calculateUnderlineLeft()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTabChange(e) {
      const { index: currentIndex } = e.currentTarget.dataset
      if (currentIndex === this.data.currentIndex) {
        return
      }
      this.setData({
        currentIndex,
      })
      this.calculateUnderlineLeft()
    },
    calculateUnderlineLeft() {
      this.createSelectorQuery()
        .selectAll('.tab')
        .boundingClientRect((rects) => {
          const rect = rects[this.data.currentIndex]
          const underlineWidth = rect.width >> 1
          const underlineLeft = rect.left + ((rect.width - underlineWidth) >> 1) - rects[0].left
          this.setData({
            underlineWidth,
            underlineLeft,
          })
        })
        .exec()
    },
  },
})
