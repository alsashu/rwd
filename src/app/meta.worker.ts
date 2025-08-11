// <reference lib="webworker" />
// import { MetaModelService } from "./service/meta/meta-model.service";

// addEventListener("message", ({ data }) => {
//   const response = `worker response`;
//   console.log(data);
//   postMessage(response);
// });

// function getAttrForType(type: string, xsdFileMap: Map<string, any>): any[] {
//   // let res = this.getKeyBySelector(type);
//   let res = [];
//   for (const key of Array.from(xsdFileMap.keys())) {
//     const file = xsdFileMap.get(key);
//     let docTypes = file.getElementsByTagName("xs:complexType");
//     for (const dom of docTypes) {
//       if (dom.getAttribute("name").split(":").pop() === type) {
//         // find attributes
//         const elements = dom.getElementsByTagName("xs:attribute");
//         for (const ele of elements) {
//           const newAtt = {};
//           for (const att of ele.attributes) {
//             newAtt[att.name] = att.nodeValue;
//           }
//           res.push(newAtt);
//         }
//         // find attributesGroup
//         const groups = dom.getElementsByTagName("xs:attributeGroup");
//         for (const group of groups) {
//           res = fuseList(res, getAttributeFromAttributeGroup(group.getAttribute("ref"), file));
//         }
//       }
//     }
//   }
//   return res;
// }

// /**
//  * Function that return the list of attributes for attributeGoupe given
//  * @param attributeGroupRef : string the name of the atributeGroup
//  * @param file : the file in which we search the attributes
//  * @returns the list of all attributes as {name , type, optional}
//  */
// function getAttributeFromAttributeGroup(attributeGroupRef: string, file: any): any[] {
//   let res = [];
//   let attributeGroups = file.getElementsByTagName("xs:attributeGroup");
//   for (const group of attributeGroups) {
//     if (group.getAttribute("name").split(":").pop() === attributeGroupRef.split(":").pop()) {
//       const elements = group.getElementsByTagName("xs:attribute");
//       for (const ele of elements) {
//         const newAtt = {};
//         for (const att of ele.attributes) {
//           newAtt[att.name] = att.nodeValue;
//         }
//         res.push(newAtt);
//       }
//     }
//   }
//   return res;
// }

// function getAllAttrForTypeRec(
//   type: string,
//   seen: any[],
//   namespaces: any[],
//   map: Map<string, any>,
//   complexTypeMap: Map<string, any>
// ): any[] {
//   let res = getAttrForType(type, map);
//   for (const namespace of namespaces) {
//     const value = complexTypeMap.get(namespace + ":" + type);
//     // console.log(namespace + ":" + type, value);
//     if (value && value.name && type != value.name.split(":").pop()) {
//       const name = value.name.split(":").pop();
//       seen.push(value.name);
//       // console.log(type, value.type, seen);
//       res = fuseList(res, getAllAttrForTypeRec(name, seen, namespaces, map, complexTypeMap));
//       for (const seqType of value.type) {
//         const typeName = seqType.type.split(":").pop();
//         seen.push(typeName);
//         const attributes = getAllAttrForTypeRec(typeName, seen, namespaces, map, complexTypeMap);
//         for (const attr of attributes) {
//           attr.name = seqType.name + "." + attr.name;
//           res.push(attr);
//         }
//       }
//     }
//   }
//   return res;
// }

// /**
//  * Function that find the attributes of type entered
//  * @param type : string base type
//  */
// function getAllAttrForType(type: string, namespace: any[], map: Map<string, any>, complexTypeMap: Map<string, any>) {
//   if (type && type.includes(":")) {
//     type = type.split(":")[1];
//   }
//   const res = getAllAttrForTypeRec(type, [], namespace, map, complexTypeMap);
//   return res;
// }

// /**
//  * Function that fuse two list removing the objects that are present multiple times
//  * @param listA
//  * @param listB
//  * @returns listeC : A u B \ (A n B)
//  */
// function fuseList(listA: any[], listB: any[]): any[] {
//   for (const ele of listB) {
//     if (!listA.find((e) => e.name === ele.name)) {
//       listA.push(ele);
//     }
//   }
//   return listA;
// }
