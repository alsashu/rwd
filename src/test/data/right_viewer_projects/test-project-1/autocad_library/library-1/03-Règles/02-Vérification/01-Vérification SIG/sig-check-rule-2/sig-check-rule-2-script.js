checkNParents();

function checkNParents() {
  let res = "none";
  let testsOK = true;
  let assertService = servicesService.assertService;

  let version = servicesService.modelService.getSelectedVersion();
  if (version) {
    let nObjects = servicesService.modelSigService.getNObjects(version.dataModel);

    let n1Objects = nObjects.filter(n => ["n1"].includes(n.type));
    let n2Objects = nObjects.filter(n => ["n2"].includes(n.type));
    let stmrObjects = nObjects.filter(n => ["n2-stmr"].includes(n.type));
    
    let nObjectsWithNoNParent = nObjects.filter(n =>
      !["n1"].includes(n.type) &&
      (n.nParentId == undefined || n.nParentId == "" || n.nParent == undefined)
    );

    if (!assertService.assertTrue(n1Objects.length, {
      label: "Test N1",
      text: "Un centre N1 est défini",
      textNOK: "Aucun centre N1 n'est défini",
      version: version, rule: context.rule, 
    })) { testsOK = false; }

    if (!assertService.assertTrue(n2Objects.length, {
      label: "Test N2",
      text: "Un centre N2 est défini",
      textNOK: "Aucun centre N2 n'est défini",
      version: version, rule: context.rule, 
    })) { testsOK = false; }

    if (nObjects.length) {
      if (nObjectsWithNoNParent.length) {
        testsOK = false;
        nObjectsWithNoNParent.forEach(n => {
          assertService.assertTrue(false, {
            label: "Test association N",
            text: "L'élément n'est associé à aucun centre ou STMR",
            version: version, rule: context.rule, bo: n,
          });
        });  
      } else {
        assertService.assertTrue(true, {
          label: "Test association N",
          text: "Tous les N sont associés à un centre ou STMR",
          version: version, rule: context.rule, 
        });
      }
    }

    servicesService.workflowService.setWfActivityTestStatus("bo-e2b9484f-912c-48ef-9074-fcd4e45bd939", { result: testsOK });

    res = (testsOK ? "ok" : "error");
  }
  return res;
}

