run();

function run() {
  let res = "none";
  let version = servicesService.modelService.getSelectedVersion();
  if (version) {
    let nObjects = servicesService.modelSigService.getNObjects(version.dataModel);
    let n3Objects = nObjects.filter(n => !["n1", "n2", "n2-stmr"].includes(n.type));
    //TODO
    let n3ObjectsWithNoSelectedInterfaceDiagram = n3Objects.filter(n =>
      n.selectedInterfaceDiagramId == undefined || n.selectedInterfaceDiagramId == null
    );
/*
    let isInterfaceDiagram = false;
    let cmds = servicesService.modelExeService.getApplyProposedDiagramsCommands(n3ObjectsWithNoSelectedInterfaceDiagram, isInterfaceDiagram);
    servicesService.commandService.executeCommands(cmds,
      "Application des " + (isInterfaceDiagram ? "schémas & interfaces campagne proposés":"grilles type proposées")
    );
*/
    res = "ok";
  }
  return res;
}
