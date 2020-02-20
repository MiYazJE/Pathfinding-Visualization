
export default class Stack {

    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    peek() {
        return this.items[this.items.length - 1];
    }

    pop() {
        if (this.items.length === 0) return undefined;
        return this.items.pop();
    }

    isEmpty() {
        return this.items.length == 0;
    }


}