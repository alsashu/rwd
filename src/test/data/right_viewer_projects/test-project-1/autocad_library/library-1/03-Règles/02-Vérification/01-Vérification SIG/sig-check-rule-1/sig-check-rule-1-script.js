checkInfrastructure();

function checkInfrastructure() {
  let res = "none";
  let testsOK = true;
  let assertService = servicesService.assertService;
  let version = servicesService.modelService.getSelectedVersion();
  if (version) {
    let nObjects = servicesService.modelSigService.getNObjects(version.dataModel);
    let n3Objects = nObjects.filter(n => !["n1", "n2", "n2-stmr"].includes(n.type));

    if (!assertService.assertTrue(n3Objects.length, {
      label: "Test infrastructure",
      text: "L'infrastructure est définie",
      textNOK: "L'infrastructure n'est pas définie. Veuillez importer ou créer l'infrastructure",
      version: version, rule: context.rule, 
    })) { testsOK = false; }

    servicesService.workflowService.setWfActivityTestStatus("bo-fa5093fe-b603-42c0-991e-cbd8d8f213dd", { result: testsOK });
    res = (testsOK ? "ok" : "error");
  }
  return res;
}

