runCheckRule();

function runCheckRule() {
  let res = "none";
  let errors = [];
  let assertService = servicesService.assertService;
  let modelService = servicesService.modelService;
  let modelSigService = servicesService.modelSigService;
  let elecDiagramService = servicesService.elecDiagramService;
  let rule = context ? context.rule : null;

  let version = modelService.getSelectedVersion();
  if (version) {
    let nObjects = modelSigService.getNObjects(version.dataModel);
    
    let diagrams = servicesService.modelService.getDiagrams(version);
    let signalObjects = nObjects.filter(n => ["signal"].includes(n.type));

    signalObjects.forEach(n3 => {
      let diagram = diagrams.find(d => d.boId == n3.id);
      if (diagram) {
        let n3IsToBeTested = (n3 && n3.aspects != undefined);
        if (n3IsToBeTested) {
          let diagramFilterTags = elecDiagramService.getDiagramFilterTags(diagram);
          let boFilterTags = elecDiagramService.getTagsFromBo(n3);
          
          let tagsNotFoundInDiagrams = boFilterTags.filter(bot => !diagramFilterTags.includes(bot));
          let tagsNotFoundInBo = diagramFilterTags.filter(bot => !boFilterTags.includes(bot));

          tagsNotFoundInDiagrams.forEach(t => 
            errors.push({
              level: "error",
              text: "La fonction " + t + " n'est pas implémentée dans l'interface campagne",
              bo: n3,
            })
          );

          tagsNotFoundInBo.forEach(t => 
            errors.push({
              level: "error",
              text: "La fonction " + t + " implémentée dans l'interface campagne ne correspond à aucun aspect du signal",
              bo: n3,
            })
          );
        }
      }
    });
    
    if (errors.length) {
      errors.forEach(message => {
        assertService.assertTrue(false, {
          label: "Test interface campagne",
          text: message.text,
          version: version, rule: rule, bo: message.bo,
        });
      });  
    } 
    else {
      assertService.assertTrue(true, {
        label: "Test liens N3",
        text: "Toutes les interfaces campagnes signal prennent en compte les aspects des signaux",
        version: version, rule: rule, 
      });
    }

    res = ((errors.length > 0) ? "ok" : "error");
  }
 
  return res;
}
