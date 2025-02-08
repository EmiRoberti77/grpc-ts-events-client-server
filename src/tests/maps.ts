const myMap = new Map<string, string>();
const key = "value";
for (let i = 0; i < 10; i++) {
  myMap.set(`${key}${i}`, "emi" + i);
}
console.log(myMap.get(`${key}3`));
console.log(myMap);
console.log(myMap.has(`${key}3`));
myMap.forEach((item) => console.log(item));
for (let value of myMap.values()) {
  console.log(value);
}
for (let keys of myMap.keys()) {
  console.log(key);
}
