
const sales = ["Sales-A", "Sales-B", "Sales-C"];
let index = 0;

export function assignOwner() {
  const owner = sales[index];
  index = (index + 1) % sales.length;
  return owner;
}
