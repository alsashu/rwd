import { Injectable } from "@angular/core";
import { ModelService } from "../../services/model/model.service";
import { ServicesService } from "../services/services.service";
import { ServicesConst } from "../services/services.const";
// import { SvgService } from '../../services/svg/svg.service';
// import { SvgGeneratorService } from '../../services/svg/svg-generator.service';

@Injectable({
  providedIn: "root",
})
export class WikiFactoryService {
  private modelService: ModelService;

  constructor(public servicesService: ServicesService) {
    this.modelService = <ModelService>this.servicesService.getService(ServicesConst.ModelService);
  }

  buildPosteWikiPages(project: any) {
    if (!project || !project.id) {
      return null;
    }

    // let phase = this.modelService.getObjectParentById(null, version.id);
    // if (phase) {
    //   let project = this.modelService.getObjectParentById(null, phase.id);
    //   // Calc diagrams svgs and post them to server
    //   this.buildDiagramSvgFromVersion(project, version);
    //   // Build wiki pages on server side
    //   this.apiService.buildWiki("/" + project.id);
    // }
  }

  buildDiagramSvgFromVersion(project: any, version: any) {
    // if (!project || !version || !version.graphicalModel || !version.graphicalModel.diagrams) { return; }
    // this.modelService.getDiagrams(version).forEach(diagram => {
    //   this.svgService.initSvgObjectRec(diagram.svgObject, diagram.svgObject, version, true);
    //   let svg = this.svgGeneratorService.getSvgFromSvgObject(diagram.svgObject);
    //   console.log(">> buildDiagramSvgFromVersion", diagram.label, diagram.id);
    //   this.apiService.postWikiPage(project.id + "/" + diagram.id + ".svg", svg);
    // });
  }
}
