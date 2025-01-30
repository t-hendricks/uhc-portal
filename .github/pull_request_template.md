# Summary

<!-- add a summarized description of the PR content -->

Jira ticket: <!-- add URL to the associated JIRA ticket -->

# Details

<!-- add a detailed list of changes, and link to the relevant commit-revision on each item.
alternatively, use the below generated text to simply show the PR commits' messages -->

# How to Test

<!-- add any useful information for local testing, like environment or tooling prerequisites,
specially used CLI options, the user-flow, and so on -->


# Screen Captures

| Before                                              | After                                   |
| --------------------------------------------------- | --------------------------------------- |
| <!-- attach a "before" screenshot or video here --> | <!-- attach an "after" capture here --> |
             

# Reviews

See [OCM UI PR into Master/Main process guide](https://docs.google.com/document/d/1utGXwyP63cViOyLR7T2R7eU5BoeNOKMf7MyqjY1VApo/) for more information.

## Reviewer 1 < name >

- [ ] Reviewed code
- [ ] Verified unit tests were added/modified for changed logic
- [ ] Verified change locally in a browser (downloaded and ran code)
- [ ] Closed threads I started after the author made changes or added an explanation

## Reviewer 2 < name >

- [ ] Reviewed code
- [ ] Verified unit tests were added/modified for changed logic
- [ ] Verified change locally in a browser (downloaded and ran code)
- [ ] Closed threads I started after the author made changes or added an explanation

## QE Reviewer < name >
- [ ] _Pre-merge testing : Verified change locally in a browser(downloaded and ran code using reviewx tool)_
- [ ] Updated/created Polarion test cases which were peer(QE) reviewed
- [ ] Confirmed 'tc-approved' label was added by dev to JIRA card
- [ ] (optional) Updated/created Cypress e2e tests
- [ ] Closed threads I started after the author made changes or added an explanation

NOTE: The author of the PR will merge the PR.

## Author
&#x1F53B; _The PR Author is responsible for keeping this PR rebased and up-to-date with master._

### Check the following before peer review:
- [ ] Unit tests have been created and/or modified
- [ ] All CI tests have passed
- [ ] Assign 2 Dev Reviewers
- [ ] Assign ‘QA contact’ from associated JIRA card as the QE Reviewer
- [ ] &#x1F53B; _When 2 dev approvals, change JIRA status to ‘Review’_
### Check the following before merging:
- [ ] All checkboxes for all above reviewers have been checked
- [ ] CI & Jenkins have passed
- [ ] There are 3 approvals (2 Dev, 1 QE)
- [ ] Merge via ‘Squash and merge’ option
### Check the following after PR has merged:
- [ ] Verified PR was deployed to staging via [build deploy job](https://ci.int.devshift.net/job/RedHatInsights-uhc-portal-gh-build-stable/) and [#ocm-ui-deploys](https://redhat.enterprise.slack.com/archives/C03GKHGMX7U)
- [ ] Quick test code/feature again on staging (https://console.dev.redhat.com/openshift/).


# Ticketing

<!-- state the ticket or tickets this PR pertains to, e.g. "closes OCMUI-nnn, OCMUI-mmm".
note that "fixes", "closes" or "resolves" (case-insensitive) will automatically
move the ticket(s) to "review" upon merge.
to avoid this, you can use e.g. "addresses OCMUI-nnn" -->
