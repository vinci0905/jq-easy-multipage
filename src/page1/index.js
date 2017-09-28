import '../common/header';
import Tip from 'arale-tip';
import Select from 'arale-select';
import Overlay from 'arale-overlay';
import Popup from 'arale-popup';
import { Slide } from 'arale-switchable';
import 'alice-table';
import 'alice-form';
import 'alice-paging';
import 'alice-iconfont';
import 'alice-tab';
import './style.less';


var template = require("./file.tpl");
var context = {title: "My New Post", body: "This is my first post!"};
var html    = template(context);
console.log(html);

// 箭头位置
new Tip({
    trigger: '#test',
    content: '<div style="padding:10px">我是内容 我是内容</div>',
    arrowPosition: 10
});

new Select({
    trigger: '#example2',
    model: [
        {value:'option1', text:'option1'},
        {value:'option2', text:'option2', selected: true},
        {value:'option3', text:'option3', disabled: true}
    ]
}).render();

var overlay = new Overlay({
    template: '<div class="overlay"></div>',
    width: 500,
    height: 200,
    zIndex: 99,
    style: 'border:1px solid red;color:green;backgroundColor:red',
    parentNode: '#c',
    align: {
        selfXY: ['-100%', 0],
        baseElement: '#a',
        baseXY: [0, 0]
    }
});
// overlay.show();
// overlay.set('style', {
//     backgroundColor: 'red',
//     border: '1px solid green'
// });
// overlay.set('width', 500);
// overlay.set('className', 'myclass');

new Popup({
    trigger: '#triggerId',
    element: '#targetId'
});

new Slide({
    element: '#slide-demo-2',
    effect: 'fade',
    activeIndex: 1
}).render();