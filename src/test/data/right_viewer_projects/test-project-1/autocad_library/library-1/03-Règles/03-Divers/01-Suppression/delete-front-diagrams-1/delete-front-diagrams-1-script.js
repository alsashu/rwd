run();

function run() {
  let res = "none";
  let version = servicesService.modelService.getSelectedVersion();
  if (version) {
    let cmds = [];
    let diagrams = servicesService.modelService.getDiagrams(version);
    let toBeDeletedDiagrams = diagrams.filter(d => d.subType == "front-diagram");
    cmds.push(servicesService.commandFactoryService.buildDeleteCommand().
      initFromObjectList(toBeDeletedDiagrams, servicesService.modelService));
    servicesService.commandService.executeCommands(cmds,
      "Suppression des vues façades"
    );

    res = "ok";
  }
  return res;
}
