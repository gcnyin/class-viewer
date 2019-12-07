export default class Field {
  /**
   * @param {string[]} accessFlags
   * @param {number} nameIndex
   * @param {number} descriptorIndex
   * @param {number} attributesCount
   * @param {Attribute[]} attributes
   */
  constructor(accessFlags, nameIndex, descriptorIndex, attributesCount, attributes) {
    this.accessFlags = accessFlags;
    this.nameIndex = nameIndex;
    this.descriptorIndex = descriptorIndex;
    this.attributesCount = attributesCount;
    this.attributes = attributes;
  }
}
