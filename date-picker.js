/**
 * Created by ZLY on 2017/5/8.
 */

(function (window) {
    var datePicker = {
        selectDate: 0,               // 选中年月
        TARGET: null,
        targetPosition: {},
        PICKERBOX: null,
        today: 0,
        currentYear: 0,             // 当前年
        currentMonth: 0,            // 当前月
        // currentDay: 0,              // 当前日
        firstDay: 0,                // 本月第一天周几
        preMonthTotalCount: 0,      // 上个月总共几天
        prevMonthCount: 0,          // 需要显示上个月的天数
        lastDay: 0,                 // 本月最后一天周几
        lastDate: 0,                // 本月最后一天是几号
        nextMonthCount: 0,          // 需要显示下个月的天数
        dataArr: [],                // 渲染数据
        init: function ($ele) {
            // 赋值当前年月
            this.today = new Date();
            this.TARGET = document.getElementById($ele);
            this._insertPicker();
            this._getYearAndMonth();
            this._addEvent();
        },
        _getYearAndMonth: function (year, month) {
            this.currentYear = year || this.today.getFullYear();
            this.currentMonth = month || this.today.getMonth() + 1;
            this.preMonthTotalCount = (new Date(this.currentYear, this.currentMonth - 1, 0)).getDate();
            this._getFirstDay();
            this._getLastDay();
            this._getDataArr();
            this._renderHtml();
        },
        _getFirstDay: function () {  // 计算第一天周几
            this.firstDay = (new Date(this.currentYear, this.currentMonth - 1, 1)).getDay();
            this.prevMonthCount = this.firstDay
        },
        _getLastDay: function () {
            var date = new Date(this.currentYear, this.currentMonth, 0);
            this.lastDay = date.getDay();
            this.lastDate = date.getDate();
            this.nextMonthCount = 6 - this.lastDay;
        },
        _getDataArr: function () {
            // 清空数据
            this.dataArr = [];
            for (var i = 0; i < 7 * 6; i++) {
                // 减去上个月显示的天数，才是这个月显示的
                var date = i - this.prevMonthCount + 1;
                var showDate = date;
                var thisMonth = this.currentMonth;
                if (date <= 0) {    // 上一个月
                    thisMonth -= 1;
                    showDate = this.preMonthTotalCount + date;
                } else if (date > this.lastDate) {  // 下一个月
                    thisMonth += 1;
                    showDate = showDate - this.lastDate;
                }
                if (thisMonth === 0) thisMonth = 12;
                if (thisMonth === 13) thisMonth = 1;
                this.dataArr.push({
                    date: date,
                    month: thisMonth,
                    showDate: showDate
                });
            }
        },
        _renderHtml: function () {
            var html = '<div class="date-picker-ui-header">' +
                '<a href="javascript:;" class="date-picker-ui-btn date-picker-ui-prev">&lt;</a>' +
                '<a href="javascript:;" class="date-picker-ui-btn date-picker-ui-next">&gt;</a>' +
                '<span>' + this.currentYear + '-' + (this.currentMonth < 9 ? '0' + this.currentMonth : this.currentMonth) + '</span>' +
                '<b class="date-picker-ui-btn-hidden">&times;</b>' +
                '</div>' +
                '<div class="date-picker-ui-body">' +
                '<table>' +
                '<thead>' +
                '<tr>' +
                '<th>日</th>' +
                '<th>一</th>' +
                '<th>二</th>' +
                '<th>三</th>' +
                '<th>四</th>' +
                '<th>五</th>' +
                '<th>六</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';
            for (var i = 0, len = this.dataArr.length; i < len; i++) {
                var className = '';
                var date = this.dataArr[i];
                if (date.date > 0 && date.date <= this.lastDate) {
                    className = "currentMonth";
                }
                if (i % 7 === 0)
                    html += "<tr>";
                html += "<td class='" + className + "'data-month='" + date.month + "'data-date='" + date.date + "'>" + date.showDate + "</td>";
                if (i % 7 === 6)
                    html += "</tr>";
            }
            html += '</tbody>' +
                '</table>' +
                '</div>';
            this.PICKERBOX.innerHTML = html;
        },
        _getTargetPosition: function () {
            this.targetPosition.left = this.TARGET.offsetLeft;
            this.targetPosition.top = this.TARGET.offsetTop + this.TARGET.offsetHeight + 2;
        },
        // 插入操作
        _insertPicker: function () {
            this._getTargetPosition();
            this.PICKERBOX = document.createElement("div");
            this.PICKERBOX.id = "date-picker-wrapper";
            this.PICKERBOX.style.top = this.targetPosition.top + 'px';
            this.PICKERBOX.style.left = this.targetPosition.left + 'px';
            document.getElementsByTagName("body")[0].appendChild(this.PICKERBOX);
        },
        _addEvent: function () {  // 添加事件
            var self = this;
            this.PICKERBOX.addEventListener('click', function (e) {
                var target = e.target || window.event.target;
                if (target.nodeName === 'A') {
                    if (target.className.indexOf("ui-next") > -1) {
                        if ((self.currentMonth += 1) > 12) {
                            self.currentMonth = 1;
                            self.currentYear += 1;
                        }
                    } else {
                        if ((self.currentMonth -= 1) <= 0) {
                            self.currentMonth = 12;
                            self.currentYear -= 1;
                        }
                    }
                    self._getYearAndMonth(self.currentYear, self.currentMonth);
                }
                if (target.nodeName === 'TD' && target.className.indexOf("currentMonth") > -1) {
                    self.selectDate = self.currentYear + '-' + target.getAttribute("data-month") + '-' + target.getAttribute("data-date");
                    self.TARGET.innerHTML = self.selectDate;
                    self.TARGET.value = self.selectDate;
                    // self._toggleClass();
                }
                if (target.nodeName === 'B') {
                    self._toggleClass();
                }
            }, false);
            self.TARGET.addEventListener("click", self._toggleClass.bind(self), false);
        },
        // 控制显示
        _toggleClass: function () {
            this.PICKERBOX.className =
                this.PICKERBOX.className.indexOf("show") > 0 ? "" : "picker-show";
        }
    }
    window.datePicker = datePicker;
}(window));