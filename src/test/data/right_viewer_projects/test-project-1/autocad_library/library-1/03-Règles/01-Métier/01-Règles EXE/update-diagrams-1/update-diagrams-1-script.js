run();

function run() {
  let res = "none";
  let version = servicesService.modelService.getSelectedVersion();
  if (version) {
    let cmds = [];
    cmds = servicesService.modelExeService.getUpdateVersionDiagramsCommands(version);
    servicesService.commandService.executeCommands(cmds,
      "Mise à jour des schémas"
    );
    res = "ok";
  }
  return res;
}
