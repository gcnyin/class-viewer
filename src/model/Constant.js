import React from "react";
import { Menu } from "antd";
import bigInt from "big-integer";
import ConstantType from "./ConstantType";
import ConstantList from "./ConstantList";
import {
  getRefKindName,
  REF_getField,
  REF_getStatic,
  REF_putField,
  REF_putStatic,
  REF_invokeVirtual,
  REF_invokeStatic,
  REF_invokeSpecial,
  REF_newInvokeSpecial,
  REF_invokeInterface
} from "../service/ReferenceKindService";

const SubMenu = Menu.SubMenu;

export class Constant {
  /**
   * @param {number} tag
   */
  constructor(tag, start, end, tagName) {
    this.tag = tag;
    this.start = start;
    this.end = end;
    this.tagName = tagName;
    this.index = null;
    this.constantList = null;
  }
  getConstantByIndex = index => this.constantList.getByIndex(index);

  /**
   * @param {ConstantList} constantList
   */
  setConstantList(constantList) {
    this.constantList = constantList;
  }

  tagIndex = () => {
    return [this.start - 1];
  };

  toMenu(callback) {
    return <Menu.Item onClick={callback(this.tagIndex())}>{`tag: ${this.tag}`}</Menu.Item>;
  }
}

export class ClassConstant extends Constant {
  constructor(name_index, start, end, tagName) {
    super(ConstantType.CONSTANT_Class, start, end, tagName);
    this.name_index = name_index;
  }

  classIndex = () => {
    const first = this.start;
    return [first, first + 1];
  };

  /**
   * @param {ConstantList} constantList
   */
  setConstantList(constantList) {
    super.setConstantList(constantList);
    this.name = constantList.getByIndex(this.name_index).bytes;
  }

  toMenu(callback) {
    return (
      <SubMenu key={this.name_index + this.tag} title={`#${this.index} (${this.tagName}): ${this.name}`}>
        {super.toMenu(callback)}
        <Menu.Item onClick={callback(this.classIndex())}>{`class_index: ${this.name_index}`}</Menu.Item>
      </SubMenu>
    );
  }
}

export class FieldrefConstant extends Constant {
  constructor(class_index, name_and_type_index, start, end, tagName) {
    super(ConstantType.CONSTANT_Fieldref, start, end, tagName);
    this.class_index = class_index;
    this.name_and_type_index = name_and_type_index;
  }

  classIndex = () => {
    const first = this.start;
    return [first, first + 1];
  };

  nameAndTypeConstant = () => {
    const first = this.start + 2;
    return [first, first + 1];
  };

  /**
   * @param {ConstantList} constantList
   */
  setConstantList(constantList) {
    super.setConstantList(constantList);
    this.class = constantList.getByIndex(constantList.getByIndex(this.class_index).name_index).bytes;
    const name = constantList.getByIndex(constantList.getByIndex(this.name_and_type_index).name_index).bytes;
    const descriptor = constantList.getByIndex(constantList.getByIndex(this.name_and_type_index).descriptor_index)
      .bytes;
    this.name_and_type = { name, descriptor };
  }

  toMenu(callback) {
    return (
      <SubMenu
        key={
          this.class_index +
          this.name_and_type_index +
          this.name_and_type.name +
          this.name_and_type.descriptor +
          this.tag
        }
        title={`#${this.index} (${this.tagName}): ${this.class}.${this.name_and_type.name} ${
          this.name_and_type.descriptor
        }`}
      >
        {super.toMenu(callback)}
        <Menu.Item onClick={callback(this.classIndex())}>{`class_index: ${this.class_index}`}</Menu.Item>
        <Menu.Item onClick={callback(this.nameAndTypeConstant())}>{`name_and_type_index: ${
          this.name_and_type_index
        }`}</Menu.Item>
      </SubMenu>
    );
  }
}

export class MethodrefConstant extends Constant {
  constructor(class_index, name_and_type_index, start, end, tagName) {
    super(ConstantType.CONSTANT_Methodref, start, end, tagName);
    this.class_index = class_index;
    this.name_and_type_index = name_and_type_index;
  }

  classIndex = () => {
    const first = this.start;
    return [first, first + 1];
  };

  nameAndTypeConstant = () => {
    const first = this.start + 2;
    return [first, first + 1];
  };

  /**
   * @param {ConstantList} constantList
   */
  setConstantList(constantList) {
    super.setConstantList(constantList);
    this.class = constantList.getByIndex(constantList.getByIndex(this.class_index).name_index).bytes;
    const name = constantList.getByIndex(constantList.getByIndex(this.name_and_type_index).name_index).bytes;
    const descriptor = constantList.getByIndex(constantList.getByIndex(this.name_and_type_index).descriptor_index)
      .bytes;
    this.name_and_type = { name, descriptor };
  }

  toMenu(callback) {
    return (
      <SubMenu
        key={
          this.class_index +
          this.name_and_type_index +
          this.name_and_type.name +
          this.name_and_type.descriptor +
          this.tag
        }
        title={`#${this.index} (${this.tagName}): ${this.class}::${this.name_and_type.name} ${
          this.name_and_type.descriptor
        }`}
      >
        {super.toMenu(callback)}
        <Menu.Item onClick={callback(this.classIndex())}>{`class_index: ${this.class_index}`}</Menu.Item>
        <Menu.Item onClick={callback(this.nameAndTypeConstant())}>{`name_and_type_index: ${
          this.name_and_type_index
        }`}</Menu.Item>
      </SubMenu>
    );
  }
}

export class InterfaceMethodrefConstant extends Constant {
  constructor(class_index, name_and_type_index, start, end, tagName) {
    super(ConstantType.CONSTANT_InterfaceMethodref, start, end, tagName);
    this.class_index = class_index;
    this.name_and_type_index = name_and_type_index;
  }

  /**
   * @param {ConstantList} constantList
   */
  setConstantList(constantList) {
    super.setConstantList(constantList);
    this.class = constantList.getByIndex(constantList.getByIndex(this.class_index).name_index).bytes;
    const name = constantList.getByIndex(constantList.getByIndex(this.name_and_type_index).name_index).bytes;
    const descriptor = constantList.getByIndex(constantList.getByIndex(this.name_and_type_index).descriptor_index)
      .bytes;
    this.name_and_type = { name, descriptor };
  }

  classIndex = () => {
    const first = this.start;
    return [first, first + 1];
  };

  nameAndTypeConstant = () => {
    const first = this.start + 2;
    return [first, first + 1];
  };

  toMenu(callback) {
    return (
      <SubMenu
        key={
          this.class_index +
          this.name_and_type_index +
          this.name_and_type.name +
          this.name_and_type.descriptor +
          this.tag
        }
        title={`#${this.index} (${this.tagName}): ${this.class}.${this.name_and_type.name} ${
          this.name_and_type.descriptor
        }`}
      >
        {super.toMenu(callback)}
        <Menu.Item onClick={callback(this.classIndex())}>{`class_index: ${this.class_index}`}</Menu.Item>
        <Menu.Item onClick={callback(this.nameAndTypeConstant())}>{`name_and_type_index: ${
          this.name_and_type_index
        }`}</Menu.Item>
      </SubMenu>
    );
  }
}

export class StringConstant extends Constant {
  constructor(string_index, start, end, tagName) {
    super(ConstantType.CONSTANT_String, start, end, tagName);
    this.string_index = string_index;
  }

  string() {
    const first = this.start;
    return [first, first + 1];
  }

  /**
   * @param {ConstantList} constantList
   */
  setConstantList(constantList) {
    super.setConstantList(constantList);
    this.string = constantList.getByIndex(this.string_index).bytes;
  }

  toMenu(callback) {
    return (
      <SubMenu key={this.string_index + this.tag} title={`#${this.index} (${this.tagName}): ${this.string}`}>
        {super.toMenu(callback)}
        <Menu.Item onClick={callback(this.string())}>{`string_index: ${this.string_index}`}</Menu.Item>
      </SubMenu>
    );
  }
}

export class IntegerConstant extends Constant {
  constructor(bytes) {
    super(ConstantType.CONSTANT_Integer);
    this.bytes = bytes;
  }

  int() {
    const first = this.start;
    return [first, first + 1, first + 2, first + 3];
  }

  toMenu(callback) {
    return (
      <SubMenu key={this.bytes + this.tag} title={`#${this.index} (${this.tagName}): ${this.bytes}`}>
        {super.toMenu(callback)}
        <Menu.Item onClick={this.int()}>{`bytes: ${this.bytes}`}</Menu.Item>
      </SubMenu>
    );
  }
}

export class FloatConstant extends Constant {
  constructor(bytes, start, end, tagName) {
    super(ConstantType.CONSTANT_Float, start, end, tagName);
    this.bytes = bytes;
  }

  float() {
    const first = this.start;
    return [first, first + 1, first + 2, first + 3];
  }

  toNumber() {
    const bits = this.bytes;
    const s = bits >> 31 === 0 ? 1 : -1;
    const e = (bits >> 23) & 0xff;
    const m = e === 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    return s * m * Math.pow(2, e - 150);
  }

  toMenu(callback) {
    return (
      <SubMenu key={this.bytes + this.tag} title={`#${this.index} (${this.tagName}): ${this.toNumber()}`}>
        {super.toMenu(callback)}
        <Menu.Item onClick={callback(this.float())}>{`bytes: ${this.bytes}`}</Menu.Item>
      </SubMenu>
    );
  }
}

export class LongConstant extends Constant {
  constructor(high_bytes, low_bytes, start, end, tagName) {
    super(ConstantType.CONSTANT_Long, start, end, tagName);
    this.high_bytes = high_bytes;
    this.low_bytes = low_bytes;
  }

  high() {
    const first = this.start;
    return [first, first + 1, first + 2, first + 3];
  }

  low() {
    const first = this.start;
    return [first + 4, first + 5, first + 6, first + 7];
  }

  toNumber = () =>
    bigInt(this.high_bytes)
      .shiftLeft(32)
      .add(bigInt(this.low_bytes))
      .toString();

  toMenu(callback) {
    return (
      <SubMenu
        key={this.low_bytes + this.high_bytes + this.tag}
        title={`#${this.index} (${this.tagName}): ${this.toNumber()}`}
      >
        {super.toMenu(callback)}
        <Menu.Item onClick={callback(this.high())}>{`high_bytes: ${this.high_bytes}`}</Menu.Item>
        <Menu.Item onClick={callback(this.low())}>{`low_bytes: ${this.low_bytes}`}</Menu.Item>
      </SubMenu>
    );
  }
}

export class DoubleConstant extends Constant {
  constructor(high_bytes, low_bytes, start, end, tagName) {
    super(ConstantType.CONSTANT_Double, start, end, tagName);
    this.high_bytes = high_bytes;
    this.low_bytes = low_bytes;
  }

  high() {
    const first = this.start;
    return [first, first + 1, first + 2, first + 3];
  }

  low() {
    const first = this.start;
    return [first + 4, first + 5, first + 6, first + 7];
  }

  toNumber = () => {
    let bits = bigInt(this.high_bytes)
      .shiftLeft(32)
      .add(bigInt(this.low_bytes));
    let s = bits.shiftRight(63).eq(bigInt(0)) ? bigInt.one : bigInt.minusOne;
    let e = bits.shiftRight(52).and(bigInt("7ff", 16));
    let m = e.eq(bigInt.zero)
      ? bits.and(bigInt("fffffffffffff", 16)).shiftLeft(bigInt.one)
      : bits.and(bigInt("fffffffffffff", 16)).or(bigInt("10000000000000", 16));
    s = parseInt(s.toString());
    e = parseInt(e.toString());
    m = parseInt(m.toString());
    return s * m * Math.pow(2, e - 1075);
  };

  toMenu(callback) {
    return (
      <SubMenu
        key={this.low_bytes + this.high_bytes + this.tag}
        title={`#${this.index} (${this.tagName}): ${this.toNumber()}`}
      >
        {super.toMenu(callback)}
        <Menu.Item onClick={callback(this.high())}>{`high_bytes: ${this.high_bytes}`}</Menu.Item>
        <Menu.Item onClick={callback(this.low())}>{`low_bytes: ${this.low_bytes}`}</Menu.Item>
      </SubMenu>
    );
  }
}

export class NameAndTypeConstant extends Constant {
  constructor(name_index, descriptor_index, start, end, tagName) {
    super(ConstantType.CONSTANT_NameAndType, start, end, tagName);
    this.name_index = name_index;
    this.descriptor_index = descriptor_index;
  }

  nameIndex() {
    const first = this.start;
    return [first, first + 1];
  }

  descriptorIndex() {
    const first = this.start + 2;
    return [first, first + 1];
  }

  /**
   * @param {ConstantList} constantList
   */
  setConstantList(constantList) {
    super.setConstantList(constantList);
    this.name = constantList.getByIndex(this.name_index).bytes;
    this.descriptor = constantList.getByIndex(this.descriptor_index).bytes;
  }

  toMenu(callback) {
    return (
      <SubMenu
        key={this.name_index + this.descriptor_index + this.tag}
        title={`#${this.index} (${this.tagName}): ${this.name}&${this.descriptor}`}
      >
        {super.toMenu(callback)}
        <Menu.Item onClick={callback(this.nameIndex())}>{`name_index: ${this.name_index}`}</Menu.Item>
        <Menu.Item onClick={callback(this.descriptorIndex())}>{`descriptor_index: ${this.descriptor_index}`}</Menu.Item>
      </SubMenu>
    );
  }
}

export class Utf8Constant extends Constant {
  constructor(length, bytes, start, end, tagName) {
    super(ConstantType.CONSTANT_Utf8, start, end, tagName);
    this.length = length;
    this.bytes = bytes;
  }

  bytesIndex() {
    let result = [];
    for (let i = this.start; i <= this.start + this.length + 1; i++) {
      result.push(i);
    }
    return result;
  }

  toMenu(callback) {
    return (
      <SubMenu key={this.bytes + this.tag} title={`#${this.index} (${this.tagName}): ${this.bytes}`}>
        {super.toMenu(callback)}
        <Menu.Item onClick={callback(this.bytesIndex())}>{`bytes: ${this.bytes}`}</Menu.Item>
      </SubMenu>
    );
  }
}

export class MethodHandleConstant extends Constant {
  constructor(reference_kind, reference_index, start, end, tagName) {
    super(ConstantType.CONSTANT_MethodHandle, start, end, tagName);
    this.reference_kind = reference_kind;
    this.reference_index = reference_index;
  }

  referenceKind() {
    const first = this.start;
    return [first];
  }

  referenceIndex() {
    const first = this.start + 1;
    return [first, first + 1];
  }

  setConstantList(constantList) {
    super.setConstantList(constantList);
    this.ref_kind_name = getRefKindName(this.reference_kind);
    if (
      this.reference_kind === REF_getField ||
      this.reference_kind === REF_getStatic ||
      this.reference_kind === REF_putField ||
      this.reference_kind === REF_putStatic
    ) {
      this.ref_index_name = this.constantList.getByIndex(
        this.constantList.getByIndex(this.constantList.getByIndex(this.reference_index).name_and_type_index).name_index
      ).bytes;
    } else if (
      this.reference_kind === REF_invokeVirtual ||
      this.reference_kind === REF_newInvokeSpecial ||
      this.reference_kind === REF_invokeStatic ||
      this.reference_kind === REF_invokeStatic ||
      this.reference_kind === REF_invokeSpecial ||
      this.reference_kind === REF_invokeInterface
    ) {
      const className = this.constantList.getByIndex(
        this.constantList.getByIndex(this.constantList.getByIndex(this.reference_index).class_index).name_index
      ).bytes;
      const methodName = this.constantList.getByIndex(
        this.constantList.getByIndex(this.constantList.getByIndex(this.reference_index).name_and_type_index).name_index
      ).bytes;
      this.ref_index_name = `${className}.${methodName}`;
    }
  }

  toMenu(callback) {
    return (
      <SubMenu
        key={this.reference_kind + this.reference_index + this.tag}
        title={`#${this.index} (${this.tagName}): ${this.ref_kind_name}->${this.ref_index_name}`}
      >
        {super.toMenu(callback)}
        <Menu.Item onClick={callback(this.referenceKind())}>{`reference_kind: ${this.reference_kind}`}</Menu.Item>
        <Menu.Item onClick={callback(this.referenceIndex())}>{`reference_index: ${this.reference_index}`}</Menu.Item>
      </SubMenu>
    );
  }
}

export class MethodTypeConstant extends Constant {
  constructor(descriptor_index, start, end, tagName) {
    super(ConstantType.CONSTANT_MethodType, start, end, tagName);
    this.descriptor_index = descriptor_index;
  }

  descriptorIndex() {
    let first = this.start;
    return [first, first + 1];
  }

  /**
   * @param {ConstantList} constantList
   */
  setConstantList(constantList) {
    super.setConstantList(constantList);
    this.descriptor = constantList.getByIndex(this.descriptor_index).bytes;
  }

  toMenu(callback) {
    return (
      <SubMenu key={this.descriptor_index + this.tag} title={`#${this.index} (${this.tagName}): ${this.descriptor}`}>
        {super.toMenu(callback)}
        <Menu.Item onClick={callback(this.descriptorIndex())}>{`descriptor_index: ${
          this.descriptor_index
        }`}</Menu.Item>
      </SubMenu>
    );
  }
}

export class InvokeDynamicConstant extends Constant {
  constructor(bootstrap_method_attr_index, name_and_type_index, start, end, tagName) {
    super(ConstantType.CONSTANT_InvokeDynamic, start, end, tagName);
    this.bootstrap_method_attr_index = bootstrap_method_attr_index;
    this.name_and_type_index = name_and_type_index;
  }

  bootstrapMethodAttrIndex() {
    const first = this.start;
    return [first, first + 1];
  }

  nameAndTypeIndex() {
    const first = this.start + 2;
    return [first, first + 1];
  }

  /**
   * @param {ConstantList} constantList
   */
  setConstantList(constantList) {
    super.setConstantList(constantList);
    const name = constantList.getByIndex(constantList.getByIndex(this.name_and_type_index).name_index).bytes;
    const descriptor = constantList.getByIndex(constantList.getByIndex(this.name_and_type_index).descriptor_index)
      .bytes;
    this.name_and_type = { name, descriptor };
  }

  toMenu(callback) {
    return (
      <SubMenu
        key={this.bootstrap_method_attr_index + this.name_and_type_index + this.tag}
        title={`#${this.index} (${this.tagName}): ${this.name_and_type.name}&${this.name_and_type.descriptor}`}
      >
        {super.toMenu(callback)}
        <Menu.Item onClick={callback(this.bootstrapMethodAttrIndex())}>{`bootstrap_method_attr_index: ${
          this.bootstrap_method_attr_index
        }`}</Menu.Item>
        <Menu.Item onClick={callback(this.nameAndTypeIndex())}>{`name_and_type_index: ${
          this.name_and_type_index
        }`}</Menu.Item>
      </SubMenu>
    );
  }
}
