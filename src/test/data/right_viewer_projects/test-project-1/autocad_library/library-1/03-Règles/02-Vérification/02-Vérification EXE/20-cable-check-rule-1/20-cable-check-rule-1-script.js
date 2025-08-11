runCheckRule();

function runCheckRule() {
  let res = "none";
  let testsOK = true;
  let assertService = servicesService.assertService;
  let modelService = servicesService.modelService;
  let modelSigService = servicesService.modelSigService;
  let rule = context ? context.rule : null;

  let version = modelService.getSelectedVersion();
  if (version) {
    let nObjects = modelSigService.getNObjects(version.dataModel);
    if (nObjects.length) {
      let nCables = modelSigService.getCableObjects(version.dataModel, ["cable"]);
      if (nCables.length == 0) {
        assertService.assertTrue(false, {
          label: "Test câbles",
          text: "Les câbles n'ont pas été créés",
          version: version, rule: rule, 
        });
      }
      else {
        let nObjectWithNoNCable = [];
        let nObjectsWithNParent = nObjects.filter(n =>
          !(n.nParentId == undefined || n.nParentId == "" || n.nParent == undefined)
        );
        let n3StmrObjectsWithNParent = nObjectsWithNParent.filter(n =>
          !["n1", "n2"].includes(n.type)
        );
  
        n3StmrObjectsWithNParent.forEach(n => {
          let nCable = modelSigService.getNCableToNParent(nCables, n);
          if (!nCable) {
            nObjectWithNoNCable.push(n);
          }
        });

        if (nObjectWithNoNCable.length) {
          testsOK = false;
          nObjectWithNoNCable.forEach(n => {
            assertService.assertTrue(false, {
              label: "Test création câbles",
              text: "Le câble n'a pas été créé",
              version: version, rule: rule, bo: n,
            });
          });  
        } else {
          assertService.assertTrue(true, {
            label: "Test création câbles",
            text: "Tous les câbles ont été créés",
            version: version, rule: rule, 
          });
        }
      }
    }

    res = (testsOK ? "ok" : "error");
  }
  return res;
}
