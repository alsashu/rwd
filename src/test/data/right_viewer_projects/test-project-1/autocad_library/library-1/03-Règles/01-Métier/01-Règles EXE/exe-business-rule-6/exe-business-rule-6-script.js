run();

function run() {
  let res = "none";
  let version = servicesService.modelService.getSelectedVersion();
  if (version) {
    let cmds = servicesService.modelExeService.getInstanciateMaterialFromDiagramsCommands(version);
    servicesService.commandService.executeCommands(cmds,
      "Création du matériel à partir des interfaces campagne/grilles type"
    );
    res = "ok";
  }
  return res;
}
