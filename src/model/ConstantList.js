import { Constant } from "./Constant";

export default class ConstantList {
  /**
   * @param {Constant[]} constantList
   */
  constructor(constantList) {
    this.constantList = constantList;
  }

  /**
   * @param {number} index
   * @returns {Constant}
   */
  getByIndex(index) {
    return this.constantList.filter(c => c.index === index)[0];
  }
}
