module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    'pre-push': 'yarn run --silent code:check',
    'pre-commit': 'yarn run --slient lint-staged',
  },
};
