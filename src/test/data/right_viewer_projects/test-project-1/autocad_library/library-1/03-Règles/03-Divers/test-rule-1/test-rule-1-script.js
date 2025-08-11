run();

function run() {
//  console.log("hello");
  let cmd = servicesService.commandFactoryService.buildCalcCableNeedsCommand();
  servicesService.commandService.execute(cmd);
/*  
  console.log("hello", toto, scriptService, servicesService);
  let version = servicesService.modelService.getSelectedVersion();
  servicesService.messageService.addTextMessage("La version courant est " + version.label); 
*/  
}
