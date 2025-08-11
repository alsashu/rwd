run();

function run() {
  let res = "none";
  let version = servicesService.modelService.getSelectedVersion();
  if (version) {
    let nObjects = servicesService.modelSigService.getNObjects(version.dataModel);
//    let n3Objects = nObjects.filter(n => !["n1", "n2", "n2-stmr"].includes(n.type));
    let n2n3Objects = nObjects.filter(n => !["n1"].includes(n.type));

    let nObjectsWithNoSelectedInterfaceDiagram = n2n3Objects.filter(n =>
      n.selectedInterfaceDiagramId == undefined || n.selectedInterfaceDiagramId == null
    );

    let isInterfaceDiagram = true;
    let cmds = servicesService.modelExeService.getApplyProposedDiagramsCommands(
      nObjectsWithNoSelectedInterfaceDiagram, isInterfaceDiagram);
    servicesService.commandService.executeCommands(cmds,
      "Application des " + (isInterfaceDiagram ? "schémas & interfaces campagne proposés":"grilles type proposées")
    );

    res = "ok";
  }
  return res;
}

