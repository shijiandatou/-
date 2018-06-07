//这是使用类 进行编程
class EventManager{
    construct(eventMap=new Map()) {
        this.eventMap=eventMap
    }
    //添加订阅
    addEventListener(event,handler){
        if(this.eventMap.has(event)){
            this.eventMap.set(event,this.eventMap.get(event).concat([handler]));
        }else{
            this.eventMap.set(event,[handler]);
        }
    }
    //派发订阅
    dispatchEvent(event){
        if(this.eventMap.has(event)){
            const fonc = this.eventMap.get(event);
            for(let i=0;i<fonc.length;i++){
                fonc[i]()
            }
        }
    }
}
const add = new EventManager();
add.addEventListener('ok',()=>{
    console.log('终于成功了!');
});
add.dispatchEvent('ok');

//改造第一版 使用函数替代class 如果进行模块化开发的话 直接export出去

const dat = new Map();
function addEventListener(event,handler){
    if(dat.has(event)){
        dat.set(event,dat.get(event).concat(handler));
    }else{
        dat.set(event,handler);
    }
}
function dispatchEvent(event) {
    if(dat.has(event)){
        const eventList = dat.get(event);
        for(let i=0;i<eventList.length;i++){
            eventList[i]()
        }
    }
}
//导出
export{addEventListener,dispatchEvent}
//引入
import * as fnc from "./index.js";


//改造第二版 去点if判断语句和for循环 使用箭头函数 使用三元运算符和foreach语句
const dat = new Map();
const addEventListener = (event,handler)=>{
    dat.has(event) ? dat.set(event,dat.get(event).concat(handler)) : dat.set(event,handler);
}
const dispatchEvent = (event)=>{
    dat.has(event)?dat.get(event).forEach((v)=>{v()}):'';
}
//改造第三版 根据纯函数特性 不能改动全局变量，而是应该返回一个全新的Map类型的数据，所以
//对addEventListener和 dispatchEvent的方法参数进行修改，增加上一个状态的eventMap,
//以便返回新的Map
const addEventListener = (event,handler,eventMap)=>{
   return eventMap.has(event) ? new eventMap(eventMap).set(event,dat.get(event).concat(handler)) :  new eventMap(eventMap).set(event,handler);
}
const dispatchEvent = (event,eventMap)=>{
   return (eventMap.has(event) && new eventMap(eventMap).get(event).forEach((v)=>{v()})) ||eventMap;
}
//改造第四版 去掉{} 箭头函数总是返回表达式的值
const addEventListener = (event,handler,eventMap)=>(
    eventMap.has(event) ? new eventMap(eventMap).set(event,dat.get(event).concat(handler)) :  new eventMap(eventMap).set(event,handler)
);
 const dispatchEvent = (event,eventMap)=>(
     (eventMap.has(event) && new eventMap(eventMap).get(event).forEach((v)=>{v()})) ||eventMap
 );
 //改造第五版 根据currying(柯里化)函数的思想 将多参数的函数 变成一元函数 即使用高级函数 进行编写
 const addEventListener=(handler)=(event)=(eventMap)=>(
    eventMap.has(event) ? new eventMap(eventMap).set(event,dat.get(event).concat(handler)) :  new eventMap(eventMap).set(event,handler)
 );
 const dispatchEvent=(event)=(eventMap)=>(
    (eventMap.has(event) && new eventMap(eventMap).get(event).forEach((v)=>{v()})) ||eventMap
 );
//调用
const log = v => console.log('v',v)|| v;
const myEventMap = addEventListener(()=>log('adadasd'))('hello')(new Map());
dispatchEvent('hello')(myEventMap);
//组合使用  composer函数的作用是 将函数进行组合使用
const log = a=>console.log('a',a)||a;
const composer = (...fns) => fns.reduce((f,g)=>(...args)=>f(g(...args)));
const addEventListeners = compose(
    log,
    addEventListener(() => log('hey'))('hello'),
    addEventListener(() => log('hi'))('hello')
  ); 
const myEventMap3 = addEventListeners(new Map()); // myEventMap3
dispatchEvent('hello')(myEventMap3); // hi he
//最后 addEventListeners的样子应该是 
//addEventListeners -> log(addEventListener(() => log('hey'))('hello')( addEventListener(() => log('hi'))('hello')(...args) ));
//所以 调用时候的样子
//const myEventMap3 = addEventListeners(new Map()); // myEventMap3
// myEventMap3 -> log(addEventListener(() => log('hey'))('hello')( addEventListener(() => log('hi'))('hello')(new Map()) ) );