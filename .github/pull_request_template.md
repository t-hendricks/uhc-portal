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
&#x1F53B _The PR Author is responsible for keeping this PR rebased and up-to-date with master._

Check the following before merging:

- [ ] Unit tests have been created and/or modified
- [ ] All checkboxes for all above reviewers have been checked
- [ ] All CI tests have passed
- [ ] Has at least 2 dev approvals and 1 QE approval; ready to merge
- [ ] Verify the 'Squash and merge' option is selected before merging the PR into master (Click on the little arrow on the right of the green merge button, and choose the 'Squash and merge' option)
- [ ] _Author tests code again on staging after PR code merged and deployed to staging!_

# Ticketing

<!-- state the ticket or tickets this PR pertains to, e.g. "closes OCMUI-nnn, OCMUI-mmm".
note that "fixes", "closes" or "resolves" (case-insensitive) will automatically
move the ticket(s) to "review" upon merge.
to avoid this, you can use e.g. "addresses OCMUI-nnn" -->
