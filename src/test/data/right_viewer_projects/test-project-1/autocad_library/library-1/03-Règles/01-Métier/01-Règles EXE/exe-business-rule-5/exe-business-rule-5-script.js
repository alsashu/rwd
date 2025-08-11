run();

function run() {
  let res = "none";
  let version = servicesService.modelService.getSelectedVersion();
  if (version) {
/*
    let cmds = servicesService.modelExeService.getInstanciateMaterialFromDiagramsCommands(version);
    servicesService.commandService.executeCommands(cmds,
      "Instanciation des vues façades"
    );
*/
    res = "ok";
  }
  return res;
}
