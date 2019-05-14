export default function Log(target : object, methodName : string , descriptor : TypedPropertyDescriptor<any>) {
  
  let originalMethod = descriptor.value;

  descriptor.value = function(...args : any[]){

    console.log('antes');

    let result = originalMethod.apply(this, args);

    console.log('Depois');
  }

  return descriptor;
};
