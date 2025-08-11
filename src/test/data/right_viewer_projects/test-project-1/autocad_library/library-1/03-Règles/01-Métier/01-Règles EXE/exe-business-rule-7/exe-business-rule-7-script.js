run();

function run() {
  let res = "none";
  let version = servicesService.modelService.getSelectedVersion();
  if (version) {
    let cmds = [];
    cmds = servicesService.modelSigService.getRecreateNLinksCommands(version);
    servicesService.commandService.executeCommands(cmds,
      "Création des liaisons entre N"
    );
    cmds = [];
    cmds = servicesService.modelExeService.getCreateCablesFromDiagramsCommands(version);
    servicesService.commandService.executeCommands(cmds,
      "Création des câbles à partir des interfaces campagne/grilles type"
    );
    res = "ok";
  }
  return res;
}
