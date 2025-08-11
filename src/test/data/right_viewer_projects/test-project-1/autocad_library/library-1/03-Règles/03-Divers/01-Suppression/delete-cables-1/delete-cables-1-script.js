run();

function run() {
  let res = "none";
  let version = servicesService.modelService.getSelectedVersion();
  if (version) {
    let cmds = servicesService.modelSigService.getDeleteCablesCommands(version);
    servicesService.commandService.executeCommands(cmds,
      "Suppression des c�bles"
    );
/*
    let cmds = [];
    cmds = servicesService.modelSigService.getDeleteCablesCommands(version);

    let cables = servicesService.modelSigService.getCableObjects(version.dataModel, ["cable"]);
    cmds.push(servicesService.commandFactoryService.buildDeleteCommand().
      initFromObjectList(cables, servicesService.modelService));
    servicesService.commandService.executeCommands(cmds,
      "Suppression des c�bles"
    );
*/
    res = "ok";
  }
  return res;
}
