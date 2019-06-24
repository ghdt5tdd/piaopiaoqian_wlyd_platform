// components/datetimePicker.js
const date = new Date()
const years = [];
const months = [];
const days = [];
const hours = [];
const mins = [];
for (let i = date.getFullYear(); i <= date.getFullYear() + 2; i++) {
  years.push("" + i)
}
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = '0' + i;
  }
  months.push("" + i)
}

for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = '0' + i;
  }
  days.push("" + i)
}

for (let i = 0; i <= 23; i++) {
  if (i < 10) {
    i = '0' + i;
  }
  hours.push("" + i)
}

for (let i = 0; i <= 59; i++) {
  if (i < 10) {
    i = '0' + i;
  }
  if(i % 15 === 0) {
    mins.push("" + i)
  }
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 日期的数据
    years: years,
    months: months,
    days: days,
    hours: hours,
    mins: mins,

    year: date.getFullYear(),
    month: '02',
    day: 2,
    hour: 9,
    min: 16,

    showPicker: false,
    value: [0, date.getMonth(), date.getDate() - 1, date.getHours(), 0]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindChange: function (e) {

      const val = e.detail.value
      this.setData({
        year: this.data.years[val[0]],
        month: this.data.months[val[1]],
        day: this.data.days[val[2]],
        hour: this.data.hours[val[3]],
        min: this.data.mins[val[4]],
        value: [val[0], val[1], val[2], val[3], val[4]]
      })
      this.triggerEvent('datechange', {
        dateTime: this.data.year + '-' + this.data.month + '-' + this.data.day + ' ' + this.data.hour + ':' + this.data.min
      })
    },

    showPicker: function () {
      this.setData({ 
        showPicker: true 
      })
    },

    closePicker: function (e) {
      this.setData({ 
        showPicker: false 
      })
    } 
  }
})
