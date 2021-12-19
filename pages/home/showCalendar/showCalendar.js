// pages/home/Calendar/showCalendar.js
Component({
    options: {
        addGlobalClass: true,
      },
    data: {
        banner: [{
            picUrl: '/image/cander/title.png',
            
          }],
        elements: [
            { title: '本部作息', name: 'east', color: 'mauve', icon: 'formfill' },
            { title: '东区作息', name: 'baiYun', color: 'pink', icon: 'list' },
            { title: '南区作息', name: 'HeYuan', color: 'green', icon: 'newsfill' },
            { title: '西区作息', name: 'West', color: 'red', icon: 'formfill' },
            { title: '北区作息', name: 'North', color: 'orange', icon: 'timefill' }
        ]
    }

})
