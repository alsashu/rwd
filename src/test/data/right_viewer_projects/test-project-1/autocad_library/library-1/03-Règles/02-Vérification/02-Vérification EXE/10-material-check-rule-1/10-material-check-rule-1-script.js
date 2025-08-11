runCheckRule();

function runCheckRule() {
  let res = "none";
  let testsOK = true;
  let assertService = servicesService.assertService;
  let modelService = servicesService.modelService;
  let modelSigService = servicesService.modelSigService;
  let modelExeService = servicesService.modelExeService;
  let rule = context ? context.rule : null;

  let version = modelService.getSelectedVersion();
  if (version) {
    let materials = modelExeService.getMaterialObjects(version)
    if (!materials.length) {
      assertService.assertTrue(false, {
        label: "Test création matériel",
        text: "Le matériel n'a pas été créé",
        version: version, rule: rule, 
      });
    } else {
      assertService.assertTrue(true, {
        label: "Test création matériel",
        text: "Le matériel a été créé",
        version: version, rule: rule, 
      });
    }

    res = (testsOK ? "ok" : "error");
  }
  return res;
}
