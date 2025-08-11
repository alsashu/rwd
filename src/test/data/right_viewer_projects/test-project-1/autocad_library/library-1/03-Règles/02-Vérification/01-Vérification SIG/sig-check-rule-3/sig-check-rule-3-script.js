checkNLinks();

function checkNLinks() {
  let res = "none";
  let testsOK = true;
  let assertService = servicesService.assertService;
  let modelService = servicesService.modelService;
  let modelSigService = servicesService.modelSigService;
  let rule = context ? context.rule : null;

  let version = modelService.getSelectedVersion();
  if (version) {
    let nObjects = modelSigService.getNObjects(version.dataModel);

    // let n1Objects = nObjects.filter(n => ["n1"].includes(n.type));
    // let n2Objects = nObjects.filter(n => ["n2"].includes(n.type));
    // let stmrObjects = nObjects.filter(n => ["n2-stmr"].includes(n.type));
    let n3Objects = nObjects.filter(n => !["n1", "n2", "n2-stmr"].includes(n.type));
    
    let nObjectsWithNParent = nObjects.filter(n =>
      !(n.nParentId == undefined || n.nParentId == "" || n.nParent == undefined)
    );

    let n3ObjectsWithNParent = nObjectsWithNParent.filter(n =>
      !["n1", "n2", "n2-stmr"].includes(n.type)
    );

    let nLinks = modelSigService.getNLinkObjects(version.dataModel);

    let n3NLinks = [];
    let nObjectWithNoNLink = [];
    let nLinkMap = new Map();

    nObjectsWithNParent.forEach(n => {
      let nLink = modelSigService.getNCableToNParent(nLinks, n);
      if (nLink) {
        nLinkMap.set(n, nLink);
        // n3 ?
        if (!["n1", "n2", "n2-stmr"].includes(n.type)) {
          n3NLinks.push(nLink);
        }
      } else {
        nObjectWithNoNLink.push(n);
      }
    });

    let kscale = 1000;
    if (version.scale != undefined) {
      let scale = parseFloat(version.scale);
      if (scale != 0) {
        kscale = 1 / scale;
      }
    }

    let n3NLinksWithLengthError = n3NLinks.filter(nl => {
      let res = false;
      if (nl.length && nl.length != "") {
        let length = parseInt(nl.length) * kscale;
        if (length > 0) {
          if (length > 1000) {
            res = true;
          }
        }
      }
      return res;
    });

    // console.log(
    //   ">> nObjectWithNoNLink", nObjectWithNoNLink, 
    //   "n3NLinks", n3NLinks,
    //   "n3NLinksWithLengthError", n3NLinksWithLengthError
    // );

    if (nObjectWithNoNLink.length) {
      testsOK = false;
      nObjectWithNoNLink.forEach(n => {
        assertService.assertTrue(false, {
          label: "Test liens N3",
          text: "Le lien N3 est manquant",
          version: version, rule: rule, bo: n,
        });
      });  
    } else {
      assertService.assertTrue(true, {
        label: "Test liens N3",
        text: "Tous les liens N3 ont été créés",
        version: version, rule: rule, 
      });
    }

    if (n3NLinksWithLengthError.length) {
      testsOK = false;
      n3NLinksWithLengthError.forEach(n => {
        assertService.assertTrue(false, {
          label: "Test liens N3",
          text: "Le lien N3 est d'une longueur trop importante",
          version: version, rule: rule, bo: n,
        });
      });  
    } else {
      assertService.assertTrue(true, {
        label: "Test liens N3",
        text: "Tous les liens N3 sont de longueur acceptable",
        version: version, rule: rule, 
      });
    }      

    res = (testsOK ? "ok" : "error");
  }
  return res;
}

