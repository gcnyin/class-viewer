export default class ByteStream {
  /**
   * @param {string[]} byteArray
   */
  constructor(byteArray) {
    this.byteArray = byteArray;
    this.position = 0;
    this.length = byteArray.length;
  }

  /**
   * @returns {boolean}
   */
  hasNext() {
    return this.position < this.length - 1;
  }

  /**
   * @returns {string}
   */
  next() {
    if (this.position === this.length) {
      console.error(`stream position(${this.position}) out of length(${this.length})`);
      return;
    }
    return this.byteArray[this.position++];
  }

  /**
   * @param {number} step
   * @returns {string[]}
   */
  slice(step) {
    const destination = this.position + step;
    if (destination >= this.length) {
      console.error(`step(${step}) is out of length${this.length}`);
      return;
    }
    const result = this.byteArray.slice(this.position, destination);
    this.position += step;
    return result;
  }

  sliceToNumber(step) {
    return parseInt(`0x${this.slice(step).join("")}`, 16);
  }

  sliceToHexStr(step) {
    return `0x${this.slice(step).join("")}`;
  }
}
