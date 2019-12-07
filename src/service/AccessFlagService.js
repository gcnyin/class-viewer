const ACC_PUBLIC = 0x0001;
const ACC_PRIVATE = 0x0002;
const ACC_PROTECTED = 0x0004;
const ACC_STATIC = 0x0008;
const ACC_FINAL = 0x0010;
const ACC_SUPER = 0x0020;
const ACC_VOLATILE = 0x0040;
const ACC_INTERFACE = 0x0200;
const ACC_ABSTRACT = 0x0400;
const ACC_TRANSIENT = 0x0080;
const ACC_SYNTHETIC = 0x1000;
const ACC_ANNOTATION = 0x2000;
const ACC_ENUM = 0x4000;

const accessFlags = [
  {
    name: "ACC_PUBLIC",
    value: ACC_PUBLIC
  },
  {
    name: "ACC_PRIVATE",
    value: ACC_PRIVATE
  },
  {
    name: "ACC_PROTECTED",
    value: ACC_PROTECTED
  },
  {
    name: "ACC_STATIC",
    value: ACC_STATIC
  },
  {
    name: "ACC_VOLATILE",
    value: ACC_VOLATILE
  },
  {
    name: "ACC_TRANSIENT",
    value: ACC_TRANSIENT
  },
  {
    name: "ACC_FINAL",
    value: ACC_FINAL
  },
  {
    name: "ACC_SUPER",
    value: ACC_SUPER
  },
  {
    name: "ACC_INTERFACE",
    value: ACC_INTERFACE
  },
  {
    name: "ACC_ABSTRACT",
    value: ACC_ABSTRACT
  },
  {
    name: "ACC_SYNTHETIC",
    value: ACC_SYNTHETIC
  },
  {
    name: "ACC_ANNOTATION",
    value: ACC_ANNOTATION
  },
  {
    name: "ACC_ENUM",
    value: ACC_ENUM
  }
];

/**
 * @param {number} n
 * @returns {string[]}
 */
export const getAccessFlagsFromNumber = n => accessFlags.filter(flag => n & flag.value).map(flag => flag.name);
