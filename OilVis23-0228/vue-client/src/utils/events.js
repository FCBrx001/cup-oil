// 编辑器自定义事件
const events = {
    redirect(url) {
        if (url) {
            window.location.href = url
        }
    },

    alert(msg) {
        if (msg) {
            alert(msg)
        }
    },
    event1(msg1){
        if(msg1){
            //console.log('hello')
            var f=eval(msg1)
            f
        }
    }
}

const mixins = {
    methods: events,
}

const eventList = [
    {
        key: 'redirect',
        label: '跳转事件',
        event: events.redirect,
        param: '',
    },
    {
        key: 'alert',
        label: 'alert 事件',
        event: events.alert,
        param: '',
    },
    {
        key: 'event1',
        label: '自定义事件',
        event: events.event1,
        param: '',
    }
]

export {
    mixins,
    events,
    eventList,
}