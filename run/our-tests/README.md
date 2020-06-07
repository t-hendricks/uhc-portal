This directory is symlinked and/or mounted at verification-tests/our-tests.

To allow us to make UI and test changes in same MR in one repo,
we're placing here our forks of OCM tests originally developed
in upstream https://github.com/openshift/verification-tests
and QE's fork https://github.com/xueli181114/verification-tests,
but as of May 2020 they still exist there too!
(Whether they'll be maintained in both places in the long term is unclear)

We're still loading most Ruby support code from run/verification-tests.
But features/step_definitions/ocm.rb here overrides the one from ../verification-tests/;
*.xyaml are loaded **only from here**, not from ../verification-tests/.
