const list = [
  { success: true, value: "A" },
  { success: true, value: "B" },
  { success: false, value: "C" },
  { success: false, value: "D" },
  { success: true, value: "E" },
  { success: true, value: "F" },
  { success: false, value: "G" },
  { success: true, value: "H" },
  { success: false, value: "I" },
];

const result=list.filter(each=>each.success==true)
console.log(result.values())

console.log(result)
const result2=list.map(each=>{
    return each.value
})

console.log(result2)


const obj = { a: "Text", b: 5 };
const val = retrieveValue(obj, "b");
console.log(val); // 5

function retrieveValue(obj,key){
    return (obj[key])
    
}