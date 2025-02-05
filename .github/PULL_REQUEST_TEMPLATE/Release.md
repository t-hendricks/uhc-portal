
Move changes from `master` to `stable`, to promote content from [Staging][stage-env] to [Production][prod-env].

See the [Release Notes wiki page][change-log] for the changelog.


# Reviews

## Reviewer 1 < name >

- [ ] Verified the PR's Commits list only contains commits with messages "Merge ... to master"; any other commits must have good reasoning
- [ ] Verified the PR's Commits list matches the Release Notes wiki
- [ ] Closed threads I started after the author made changes or added an explanation

## Reviewer 2 < name >

- [ ] Verified the PR's Commits list only contains commits with messages "Merge ... to master"; any other commits must have good reasoning
- [ ] Verified the PR's Commits list matches the Release Notes wiki
- [ ] Closed threads I started after the author made changes or added an explanation

NOTE: The author of the PR will merge the PR.

## Author

Check the following before merging:

- [ ] All above checkboxes for both reviewers have been checked
- [ ] All CI tests have passed
- [ ] Has at least 2 approvals, ready to merge
- [ ] "Merge pull request" is selected as the merge-method (**not** "Squash and merge" or "Rebase and merge")



<!-- TODO: update this link to point to the correct section in the release notes -->
<!--       by appending the heading permalink, e.g. /Release-Notes#mar-5-1981 -->
[change-log]: https://github.com/RedHatInsights/uhc-portal/wiki/Release-Notes
[prod-env]: https://console.redhat.com/openshift/
[stage-env]: https://console.dev.redhat.com/openshift/
