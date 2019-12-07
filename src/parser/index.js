import { getConstantList } from "../service/ConstantService";
import { getAccessFlagsFromNumber } from "../service/AccessFlagService";

export default class ClassFileParser {
  /**
   * @param {ByteStream} byteStream
   */
  constructor(byteStream) {
    this.byteStream = byteStream;
    this._constantList = null;
    this._constantPoolCount = null;
    this._interfacesCount = null;
  }

  classFile = () => {
    const magic = this.magic();
    const minorVersion = this.minorVersion();
    const majorVersion = this.majorVersion();
    const constantPoolCount = this.constantPoolCount();
    const constantPool = this.constantPool();
    const constantPoolEnd = this.constantPoolEnd;
    const accessFlags = this.accessFlags();
    const thisClass = this.thisClass();
    const superClass = this.superClass();
    const interfacesCount = this.interfacesCount();
    const interfaces = this.interfaces();
    const interfacesEnd = this.interfacesEnd;
    const fieldsCount = this.fieldsCount();
    return {
      magic,
      minorVersion,
      majorVersion,
      constantPoolCount,
      constantPool,
      constantPoolEnd,
      accessFlags,
      thisClass,
      superClass,
      interfacesCount,
      interfaces,
      interfacesEnd,
      fieldsCount
    };
  };

  magic = () => this.byteStream.sliceToHexStr(4);

  minorVersion = () => this.byteStream.sliceToNumber(2);

  majorVersion = () => this.byteStream.sliceToNumber(2);

  constantPoolCount = () => {
    this._constantPoolCount = this.byteStream.sliceToNumber(2);
    return this._constantPoolCount;
  };

  constantPool = () => {
    this._constantList = getConstantList(this._constantPoolCount, this.byteStream);
    this.constantPoolEnd = this.byteStream.position;
    this._constantList.constantList.map(c => c.setConstantList(this._constantList));
    return this._constantList;
  };

  accessFlags = () => {
    const accessFlagsNumber = this.byteStream.sliceToNumber(2);
    const accessFlags = getAccessFlagsFromNumber(accessFlagsNumber);
    return { value: accessFlagsNumber, accessFlags };
  };

  thisClass = () => {
    const index = this.byteStream.sliceToNumber(2);
    const text = this._constantList.getByIndex(this._constantList.getByIndex(index).name_index).bytes;
    return { index, text };
  };

  superClass = () => {
    const index = this.byteStream.sliceToNumber(2);
    const text = this._constantList.getByIndex(this._constantList.getByIndex(index).name_index).bytes;
    return { index, text };
  };

  interfacesCount = () => {
    this._interfacesCount = this.byteStream.sliceToNumber(2);
    return this._interfacesCount;
  };

  interfaces = () => {
    let result = [];
    for (let i = 0; i < this._interfacesCount; i++) {
      const position = this.byteStream.position;
      result.push({ position, value: this.byteStream.sliceToNumber(2) });
    }
    this.interfacesEnd = this.byteStream.position;
    return result.map(i => {
      return {
        name: this._constantList.getByIndex(this._constantList.getByIndex(i.value).name_index).bytes,
        value: i.value,
        position: i.position
      };
    });
  };

  fieldsCount = () => this.byteStream.sliceToNumber(2);

  fields = () => {};

  methodsCount = () => {};

  methods = () => {};

  attributesCount = () => {};

  attributes = () => {};
}
