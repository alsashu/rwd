runCheckRule();

function runCheckRule() {
  let res = "none";
  let errors = [];
  let assertService = servicesService.assertService;
  let modelService = servicesService.modelService;
  let modelSigService = servicesService.modelSigService;
  let modelExeService = servicesService.modelExeService;
  let elecDiagramService = servicesService.elecDiagramService;
  let rule = context ? context.rule : null;

  let version = modelService.getSelectedVersion();
  if (version) {
    let materials = modelExeService.getMaterialObjects(version);

    let nObjects = modelSigService.getNObjects(version.dataModel);
    let signalObjects = nObjects.filter(n => ["signal"].includes(n.type));
    let signalObjectsTobeTested = signalObjects.filter(n => n.aspects != undefined);

    if (signalObjectsTobeTested.length && materials.length) {

      signalObjectsTobeTested.forEach(n3 => {
        let boFunctions = elecDiagramService.getFunctionsFromBo(n3);

        let materialsMappedToBo = modelExeService.getMaterialsMappedToBo(materials, n3);
        let materialFunctions = [];
        materialsMappedToBo.forEach(material => { 
          if (material.ioList) { 
            material.ioList.forEach(io => { 
              if (io.functionName) { materialFunctions.push(io.functionName); }
            });
          }
        });

        let functionsNotFoundInMaterials = boFunctions.filter(bot => !materialFunctions.includes(bot));

        functionsNotFoundInMaterials.forEach(t => 
          errors.push({
            level: "error",
            text: "La fonction " + t + " n'est affectée à aucune carte",
            bo: n3,
          })
        );
      });
      
      if (errors.length) {
        errors.forEach(message => {
          assertService.assertTrue(false, {
            label: "Test affectations matériel",
            text: message.text,
            version: version, rule: rule, bo: message.bo,
          });
        });  
      } 
      else {
        assertService.assertTrue(true, {
          label: "Test affectations matériel",
          text: "Toutes les fonctions des signaux sont affectées à une carte",
          version: version, rule: rule, 
        });
      }

      res = ((errors.length > 0) ? "ok" : "error");
    }
  }
 
  return res;
}