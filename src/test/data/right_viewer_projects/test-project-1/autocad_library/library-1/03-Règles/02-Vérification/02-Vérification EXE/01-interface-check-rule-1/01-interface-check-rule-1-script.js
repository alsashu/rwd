checkInfrastructure();

function checkInfrastructure() {
  let res = "none";
  let testsOK = true;
  let assertService = servicesService.assertService;
  let version = servicesService.modelService.getSelectedVersion();
  if (version) {

    let nObjects = servicesService.modelSigService.getNObjects(version.dataModel);
    let n2Objects = nObjects.filter(n => ["n2"].includes(n.type));
    let stmrObjects = nObjects.filter(n => ["n2-stmr"].includes(n.type));
    let n3Objects = nObjects.filter(n => !["n1", "n2", "n2-stmr"].includes(n.type));
    //servicesService.modelSigService.getN2Parent(o)

    let n3ObjectsWithNoSelectedInterfaceDiagram = n3Objects.filter(n =>
      n.selectedInterfaceDiagramId == undefined || n.selectedInterfaceDiagramId == null
    );

    let diagrams = servicesService.modelService.getDiagrams(version);
    let n3ObjectsWithNoInstanciateInterfaceDiagram = n3Objects.filter(n =>
      diagrams.find(d => d.boId == n.id) == null
    );

    if (n3Objects.length) {
      if (n3ObjectsWithNoSelectedInterfaceDiagram.length) {
        testsOK = false;
        n3ObjectsWithNoSelectedInterfaceDiagram.forEach(n => {
          assertService.assertTrue(false, {
            label: "Test séléction Interface campagne",
            text: "Aucune interface campagne sélectionnée pour l'élément",
            version: version, rule: context.rule, bo: n,
          });
        });  
      } else {
        assertService.assertTrue(true, {
          label: "Test séléction Interface campagne",
          text: "Les interfaces campagnes sont sélectionnées pour tous les N3",
          version: version, rule: context.rule, 
        });
      }

      if (n3ObjectsWithNoInstanciateInterfaceDiagram.length) {
        testsOK = false;
        n3ObjectsWithNoInstanciateInterfaceDiagram.forEach(n => {
          assertService.assertTrue(false, {
            label: "Test instanciation Interface campagne",
            text: "Aucune interface campagne instanciée pour l'élément",
            version: version, rule: context.rule, bo: n,
          });
        });  
      } else {
        assertService.assertTrue(true, {
          label: "Test instanciation Interface campagne",
          text: "Les interfaces campagnes sont instanciées pour tous les N3",
          version: version, rule: context.rule, 
        });
      }

      servicesService.workflowService.setWfActivityTestStatus("bo-160901b7-8b4b-486a-8c83-7c73ff8984ba", { result: testsOK });
    }

    res = (testsOK ? "ok" : "error");
  }
  return res;
}

