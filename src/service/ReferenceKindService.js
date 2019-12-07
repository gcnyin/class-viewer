export const REF_getField = 1;
export const REF_getStatic = 2;
export const REF_putField = 3;
export const REF_putStatic = 4;
export const REF_invokeVirtual = 5;
export const REF_invokeStatic = 6;
export const REF_invokeSpecial = 7;
export const REF_newInvokeSpecial = 8;
export const REF_invokeInterface = 9;

const referenceKinds = [
  { name: "REF_getField", value: REF_getField },
  { name: "REF_getStatic", value: REF_getStatic },
  { name: "REF_putField", value: REF_putField },
  { name: "REF_putStatic", value: REF_putStatic },
  { name: "REF_invokeVirtual", value: REF_invokeVirtual },
  { name: "REF_invokeStatic", value: REF_invokeStatic },
  { name: "REF_invokeSpecial", value: REF_invokeSpecial },
  { name: "REF_newInvokeSpecial", value: REF_newInvokeSpecial },
  { name: "REF_invokeInterface", value: REF_invokeInterface }
];

/**
 * @param {number} r
 * @returns {string}
 */
export const getRefKindName = r => referenceKinds.filter(e => e.value === r)[0].name;
