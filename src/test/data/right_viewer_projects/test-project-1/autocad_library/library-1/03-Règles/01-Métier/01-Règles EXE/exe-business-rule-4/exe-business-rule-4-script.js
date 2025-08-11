run();

function run() {
  let res = "none";
  let version = servicesService.modelService.getSelectedVersion();
  if (version) {
    let nObjects = servicesService.modelSigService.getNObjects(version.dataModel);
    let n3Objects = nObjects.filter(n => !["n1", "n2", "n2-stmr"].includes(n.type));

    let diagrams = servicesService.modelService.getDiagrams(version);
//    let n3ObjectsWithNoInstanciateInterfaceDiagram = n3Objects.filter(n =>
//      diagrams.find(d => d.boId == n.id) == null
//    );

    let isInterfaceDiagram = false;
    let cmds = servicesService.modelExeService.getInstanciateDiagramCommands(
      version, n3Objects, null, isInterfaceDiagram);
    servicesService.commandService.executeCommands(cmds,
      "Instanciation des " + (isInterfaceDiagram ? "schémas & interfaces campagne sélectionnés":"grilles type sélectionnées")
    );

    res = "ok";
  }
  return res;
}
