import ConstantType from "../model/ConstantType";
import ConstantList from "../model/ConstantList";
import {
  ClassConstant,
  FieldrefConstant,
  NameAndTypeConstant,
  Utf8Constant,
  MethodrefConstant,
  InterfaceMethodrefConstant,
  StringConstant,
  DoubleConstant,
  FloatConstant,
  LongConstant,
  IntegerConstant,
  InvokeDynamicConstant,
  MethodHandleConstant,
  MethodTypeConstant
} from "../model/Constant";

/**
 * @param {number} constantPoolCount
 * @param {ByteStream} byteStream
 * @returns {ConstantList}
 */
export function getConstantList(constantPoolCount, byteStream) {
  let list = [];
  for (let i = 0; i < constantPoolCount - 1; i++) {
    let constant = getConstantFromStream(byteStream);
    constant.index = i + 1;
    list.push(constant);
    if (constant.tag === ConstantType.CONSTANT_Double || constant.tag === ConstantType.CONSTANT_Long) i++;
  }
  const constantList = new ConstantList(list);
  list.forEach(c => (c.constantList = constantList));
  return constantList;
}

/**
 * convert hex to string
 * @param {string} hex
 * @returns {string}
 */
function hex2a(hex) {
  var str = "";
  for (var i = 0; i < hex.length; i += 2) {
    var v = parseInt(hex.substr(i, 2), 16);
    if (v) str += String.fromCharCode(v);
  }
  return str;
}

/**
 * @param {ByteStream} byteStream
 * @returns {Constant}
 */
function getConstantFromStream(byteStream) {
  if (!byteStream.hasNext()) {
    console.error("out of stream length");
    return null;
  }
  const tap = parseInt(byteStream.next(), 16);
  if (tap === ConstantType.CONSTANT_Class) {
    const start = byteStream.position;
    const index = byteStream.sliceToNumber(2);
    const end = byteStream.position;
    return new ClassConstant(index, start, end, "Class");
  } else if (tap === ConstantType.CONSTANT_Fieldref) {
    const start = byteStream.position;
    const class_index = byteStream.sliceToNumber(2);
    const name_and_type_index = byteStream.sliceToNumber(2);
    const end = byteStream.position;
    return new FieldrefConstant(class_index, name_and_type_index, start, end, "Fieldref");
  } else if (tap === ConstantType.CONSTANT_Methodref) {
    const start = byteStream.position;
    const class_index = byteStream.sliceToNumber(2);
    const name_and_type_index = byteStream.sliceToNumber(2);
    const end = byteStream.position;
    return new MethodrefConstant(class_index, name_and_type_index, start, end, "Methodref");
  } else if (tap === ConstantType.CONSTANT_InterfaceMethodref) {
    const start = byteStream.position;
    const class_index = byteStream.sliceToNumber(2);
    const name_and_type_index = byteStream.sliceToNumber(2);
    const end = byteStream.position;
    return new InterfaceMethodrefConstant(class_index, name_and_type_index, start, end, "InterfaceMethodref");
  } else if (tap === ConstantType.CONSTANT_String) {
    const start = byteStream.position;
    const string_index = byteStream.sliceToNumber(2);
    const end = byteStream.position;
    return new StringConstant(string_index, start, end, "String");
  } else if (tap === ConstantType.CONSTANT_Integer) {
    const start = byteStream.position;
    const bytes = byteStream.sliceToNumber(4);
    const end = byteStream.position;
    return new IntegerConstant(bytes, start, end, "Integer");
  } else if (tap === ConstantType.CONSTANT_Float) {
    const start = byteStream.position;
    const bytes = byteStream.sliceToNumber(4);
    const end = byteStream.position;
    return new FloatConstant(bytes, start, end, "Float");
  } else if (tap === ConstantType.CONSTANT_Long) {
    const start = byteStream.position;
    const high_bytes = byteStream.sliceToNumber(4);
    const low_bytes = byteStream.sliceToNumber(4);
    const end = byteStream.position;
    return new LongConstant(high_bytes, low_bytes, start, end, "Long");
  } else if (tap === ConstantType.CONSTANT_Double) {
    const start = byteStream.position;
    const high_bytes = byteStream.sliceToNumber(4);
    const low_bytes = byteStream.sliceToNumber(4);
    const end = byteStream.position;
    return new DoubleConstant(high_bytes, low_bytes, start, end, "Double");
  } else if (tap === ConstantType.CONSTANT_NameAndType) {
    const start = byteStream.position;
    const name_index = byteStream.sliceToNumber(2);
    const descriptor_index = byteStream.sliceToNumber(2);
    const end = byteStream.position;
    return new NameAndTypeConstant(name_index, descriptor_index, start, end, "NameAndType");
  } else if (tap === ConstantType.CONSTANT_Utf8) {
    const start = byteStream.position;
    const length = byteStream.sliceToNumber(2);
    const end = byteStream.position;
    let bytes = hex2a(byteStream.slice(length).join(""));
    return new Utf8Constant(length, bytes, start, end, "Utf8");
  } else if (tap === ConstantType.CONSTANT_MethodHandle) {
    const start = byteStream.position;
    const reference_kind = parseInt(byteStream.slice(1).join(""), 16);
    const reference_index = byteStream.sliceToNumber(2);
    const end = byteStream.position;
    return new MethodHandleConstant(reference_kind, reference_index, start, end, "MethodHandle");
  } else if (tap === ConstantType.CONSTANT_MethodType) {
    const start = byteStream.position;
    const descriptor_index = byteStream.sliceToNumber(2);
    const end = byteStream.position;
    return new MethodTypeConstant(descriptor_index, start, end, "MethodType");
  } else if (tap === ConstantType.CONSTANT_InvokeDynamic) {
    const start = byteStream.position;
    const bootstrap_method_attr_index = byteStream.sliceToNumber(2);
    const name_and_type_index = byteStream.sliceToNumber(2);
    const end = byteStream.position;
    return new InvokeDynamicConstant(bootstrap_method_attr_index, name_and_type_index, start, end, "InvokeDynamic");
  }
  return {
    tap
  };
}
