import { getAccessFlagsFromNumber } from "../service/AccessFlagService";
import Field from "../model/Field";

export const getFields = (fieldsCount, byteStream) => {
  //   let result = [];
  //   for (let index = 0; index < fieldsCount; index++) {
  //     result.push(getField(byteStream));
  //   }
  //   return result; TODO: use it
  return [getField(byteStream)];
};

const getField = byteStream => {
  const accessFlags = getAccessFlagsFromNumber(byteStream.sliceToNumber(2));
  const nameIndex = byteStream.sliceToNumber(2);
  const descriptorIndex = byteStream.sliceToNumber(2);
  const attributesCount = byteStream.sliceToNumber(2);
  const attributes = []; // TODO: implement it
  return new Field(accessFlags, nameIndex, descriptorIndex, attributesCount, attributes);
};
