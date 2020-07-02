
export default class State {
	constructor(cordinates, weight = 0) {
		const [i, j] = cordinates;
		this.i = i;
		this.j = j;
		this.weight = weight;
	}
}