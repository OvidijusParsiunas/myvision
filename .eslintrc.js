module.exports = {
    "extends": "airbnb-base",
    rules:{
      "linebreak-style": 0,
      "no-underscore-dangle": 0,
      "no-param-reassign": 0,
      "import/no-unresolved": [2, {ignore: ['fabric']}]
    },
    "env": {
      "browser": true
    }
};
