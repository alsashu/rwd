import { ILayout } from './ilayout';

export class LinkLayout implements ILayout {
  execute(svgObject) {
    if (svgObject && svgObject.points && svgObject.isLink) {

    }
  }
}