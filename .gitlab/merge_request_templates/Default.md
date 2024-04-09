# summary

<!-- add a summarized description of the MR content -->

# details

<!-- add a detailed list of changes, and link to the relevant commit-revision on each item.
alternatively, use the below generated text to simply show the MR commits' messages -->

<!--
an auto-generated list of the MR commits.  if any commit titles include a type prefix
(e.g. "fix", "feat", "docs"), the list will be categorized by type.
if you only see {all_commits} here but no text was generated, cancel and re-open the MR.
-->

%{all_commits}

# how to test

<!-- add any useful information for local testing, like environment or tooling prerequisites,
specially used CLI options, the user-flow, and so on -->

# screen captures

| before                                              | after                                   |
| --------------------------------------------------- | --------------------------------------- |
| <!-- attach a "before" screenshot or video here --> | <!-- attach an "after" capture here --> |

# reviews

See [OCM UI MR into Master/Main process guide](https://docs.google.com/document/d/1utGXwyP63cViOyLR7T2R7eU5BoeNOKMf7MyqjY1VApo/) for more information.

## reviewer 1 < name >

- [ ] Reviewed code
- [ ] Verified unit tests were added/modified for changed logic
- [ ] Verified change locally in a browser (downloaded and ran code)
- [ ] Closed threads I started after the author made changes or added an explanation

## reviewer 2 < name >

- [ ] Reviewed code
- [ ] Verified unit tests were added/modified for changed logic
- [ ] Verified change locally in a browser (downloaded and ran code)
- [ ] Closed threads I started after the author made changes or added an explanation

NOTE: The author of the MR will merge the MR.

## author

Check the following before merging:

- [ ] Unit tests have been created and/or modified
- [ ] All above checkboxes for both reviewers have been checked
- [ ] All CI tests have passed
- [ ] Has at least 2 approvals, ready to merge

# ticketing

<!-- state the ticket or tickets this MR pertains to, e.g. "closes HAC-nnn, HAC-mmm".
note that "fixes", "closes" or "resolves" (case-insensitive) will automatically
move the ticket(s) to "review" upon merge.
to avoid this, you can use e.g. "addresses HAC-nnn" -->
