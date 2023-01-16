/* eslint-disable no-return-assign */
/* eslint-disable import/no-mutable-exports */
export let showIssueForm = false;

export const getShowIssueForm = () => showIssueForm;
export const setShowIssueForm = () => {
  showIssueForm = !showIssueForm;
};

export let issue = '';

export const getIssue = () => issue;
export const setIssue = (currentIssue) => (issue = currentIssue);

export let issueCategory = '';

export const getIssueCategory = () => issueCategory;
export const setIssueCategory = (category) => (issueCategory = category);
